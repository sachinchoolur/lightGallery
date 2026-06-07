export async function POST(request: Request) {
  const { code } = await request.json();

  if (code) {
    const requestUrl = new URL(request.url);
    const origin = `${requestUrl.origin}`;

    return fetch(`${origin}/auth/callback?code=${code}`, {
      method: 'GET',
    });
  }

  return new Response('No code provided', { status: 400 });
}
