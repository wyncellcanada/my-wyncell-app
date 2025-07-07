import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://partners-api.airalo.com';

// Helper function to get the access token
async function getAccessToken(clientId, clientSecret) {
  const tokenResponse = await fetch(`${API_BASE_URL}/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });
  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`Failed to get token. Status: ${tokenResponse.status}. Body: ${errorBody}`);
  }
  const tokenData = await tokenResponse.json();
  return tokenData.data.access_token;
}

// This is a POST function to handle creating an order
export async function POST(request) {
  const clientId = process.env.AIRALO_CLIENT_ID;
  const clientSecret = process.env.AIRALO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'API credentials are not set' }, { status: 500 });
  }
  
  try {
    const { package_id, quantity } = await request.json();

    if (!package_id || !quantity) {
      return NextResponse.json({ error: 'Missing package_id or quantity' }, { status: 400 });
    }

    // 1. Get the access token
    const accessToken = await getAccessToken(clientId, clientSecret);

    // 2. Submit the order to Airalo
    const orderResponse = await fetch(`${API_BASE_URL}/v2/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        quantity: quantity,
        package_id: package_id,
        description: 'Order from Wyncell' // Optional description
      }),
    });

    if (!orderResponse.ok) {
      const errorBody = await orderResponse.text();
      throw new Error(`Failed to submit order. Status: ${orderResponse.status}. Body: ${errorBody}`);
    }

    const orderData = await orderResponse.json();
    return NextResponse.json(orderData, { status: 200 });

  } catch (error) {
    console.error('[Order API Error]', error.message);
    return NextResponse.json({ error: 'An error occurred while placing the order.', details: error.message }, { status: 500 });
  }
}