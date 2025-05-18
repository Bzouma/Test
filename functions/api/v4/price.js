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
  console.log("Proxying to:", upstreamUrl);

  try {
    const res = await fetch(upstreamUrl);

    if (!res.ok) {
      console.error("Jupiter responded with:", res.status);
      return new Response(JSON.stringify({ error: `Upstream error: ${res.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    console.error("Fetch to Jupiter failed:", e.message);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
