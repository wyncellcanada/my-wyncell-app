import { NextResponse } from 'next/server';

async function getAccessToken(clientId, clientSecret, apiBaseUrl) {
  const tokenResponse = await fetch(`${apiBaseUrl}/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });
  if (!tokenResponse.ok) throw new Error('Failed to get token');
  const tokenData = await tokenResponse.json();
  return tokenData.data.access_token;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'local';

  const clientId = process.env.AIRALO_CLIENT_ID;
  const clientSecret = process.env.AIRALO_CLIENT_SECRET;
  const apiBaseUrl = 'https://partners-api.airalo.com';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'API credentials are not set' }, { status: 500 });
  }

  try {
    const accessToken = await getAccessToken(clientId, clientSecret, apiBaseUrl);

    let fetchUrl = `${apiBaseUrl}/v2/packages`;
    if (type === 'global') {
      fetchUrl += `?filter[type]=global`;
    }

    // --- New Pagination Logic ---
    let allPackages = [];
    let currentPage = 1;
    let lastPage = 1;

    do {
      const urlWithPage = `${fetchUrl}${type === 'global' ? '&' : '?'}page=${currentPage}`;
      
      const packagesResponse = await fetch(urlWithPage, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!packagesResponse.ok) {
        throw new Error(`Could not fetch packages on page ${currentPage}`);
      }
      
      const packagesData = await packagesResponse.json();
      
      if (packagesData.data && packagesData.data.length > 0) {
        allPackages = allPackages.concat(packagesData.data);
      }
      
      lastPage = packagesData.meta?.last_page || 1;
      currentPage++;

    } while (currentPage <= lastPage);
    // --- End Pagination Logic ---

    return NextResponse.json({ data: allPackages }, { status: 200 });

  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}