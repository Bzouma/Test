export async function onRequest({ request }) {
  const url = new URL(request.url);
  const ids = url.searchParams.get('ids');

  if (!ids) {
    return new Response(JSON.stringify({ error: "Missing 'ids' param" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const upstreamUrl = `https://price.jup.ag/v4/price?ids=${encodeURIComponent(ids)}`;

  try {
    const res = await fetch(upstreamUrl);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
