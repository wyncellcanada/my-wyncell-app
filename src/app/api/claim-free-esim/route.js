import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const API_BASE_URL = 'https://partners-api.airalo.com';
const FREE_ESIM_PACKAGE_ID = 'change-7days-1gb'; // The package you offer for free

// Helper function to get the access token
async function getAiraloAccessToken(clientId, clientSecret) {
  const tokenResponse = await fetch(`${API_BASE_URL}/v2/token`, {
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
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 });
    }

    // 2. Check if user has already claimed the offer
    const { data: profile } = await supabase
      .from('profiles')
      .select('has_claimed_free_esim')
      .eq('id', user.id)
      .single();

    if (profile && profile.has_claimed_free_esim) {
      return NextResponse.json({ error: 'Free eSIM has already been claimed for this account.' }, { status: 403 });
    }

    // 3. If checks pass, place the order with Airalo
    const clientId = process.env.AIRALO_CLIENT_ID;
    const clientSecret = process.env.AIRALO_CLIENT_SECRET;
    const accessToken = await getAiraloAccessToken(clientId, clientSecret);

    const orderResponse = await fetch(`${API_BASE_URL}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        quantity: 1,
        package_id: FREE_ESIM_PACKAGE_ID,
        description: `Promotional Free Starter eSIM for ${user.email}`
      }),
    });

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.text();
      throw new Error(`Airalo order failed. Status: ${orderResponse.status}. Body: ${errorBody}`);
    }

    const orderData = await orderResponse.json();

    // 4. Save the order and mark the offer as claimed
    // "upsert" will create the profile if it doesn't exist, or update it if it does.
    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, has_claimed_free_esim: true })
        .select()

    if (upsertError) throw new Error(`Failed to update user profile: ${upsertError.message}`);
    
    // Also save the order to your orders table
    await supabase.from('orders').insert({
        user_id: user.id,
        package_id: FREE_ESIM_PACKAGE_ID,
        airalo_order_details: orderData.data
    });
    
    return NextResponse.json(orderData, { status: 200 });

  } catch (error) {
    console.error('[Claim API Error]', error.message);
    return NextResponse.json({ error: 'An error occurred while claiming the eSIM.', details: error.message }, { status: 500 });
  }
}