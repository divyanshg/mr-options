import { db } from '../../../../lib/db';

export async function GET(req: Request) {
  try {
    const allsurveys = await db.survey.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    return new Response(JSON.stringify(allsurveys), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (err) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
}
