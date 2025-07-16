import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper function to get Airalo token
async function getAiraloAccessToken(clientId, clientSecret) {
  const tokenResponse = await fetch('https://partners-api.airalo.com/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });
  if (!tokenResponse.ok) throw new Error('Failed to get Airalo token');
  const tokenData = await tokenResponse.json();
  return tokenData.data.access_token;
}

export async function POST(request) {
  const { payment_method_id, package_id, amount } = await request.json();
  const supabase = createRouteHandlerClient({ cookies });

  // 1. Get the logged-in user from Supabase
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be logged in to make a purchase.' }, { status: 401 });
  }

  try {
    // 2. Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'cad',
      payment_method: payment_method_id,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' }
    });

    // 3. If payment is successful, place the order with Airalo
    if (paymentIntent.status === 'succeeded') {
      const airaloToken = await getAiraloAccessToken(process.env.AIRALO_CLIENT_ID, process.env.AIRALO_CLIENT_SECRET);
      
      const orderResponse = await fetch('https://partners-api.airalo.com/v2/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${airaloToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            quantity: 1,
            package_id: package_id,
            description: `Order by ${user.email}`
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Payment succeeded but failed to place eSIM order with Airalo.');
      }
      
      const orderData = await orderResponse.json();

      // 4. Save the successful order to your Supabase database
      const { error: insertError } = await supabase
        .from('orders')
        .insert({ 
           user_id: user.id, 
           package_id: package_id, 
           airalo_order_details: orderData.data, // Save the Airalo response
           stripe_charge_id: paymentIntent.id
        });

      if (insertError) {
        // Log an error if saving to DB fails, but still return success to the user
        console.error('Failed to save order to database:', insertError.message);
      }

      return NextResponse.json({ success: true, order: orderData });
    }

    return NextResponse.json({
      requires_action: true,
      client_secret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('[Charge API Error]', error.message);
    return NextResponse.json({ error: 'An error occurred during payment.', details: error.message }, { status: 500 });
  }
}