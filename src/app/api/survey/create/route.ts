export async function POST(req: Request) {
  try { 
    const body = await req.json()
    console.log(body)
  } catch (err) {
    console.log(err)
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500 }
    );
  }
}
