import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const surveyId = url.searchParams.get("surveyId");

    if (!surveyId) {
      return new Response("Missing surveyId", { status: 400 });
    }

    //get the survey from db

    const survey = await db.survey.findFirst({
      where: {
        id: surveyId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!survey) {
      return new Response("Survey not found", { status: 404 });
    }

    return new Response(JSON.stringify(survey), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response("Something went wrong. Please try again!", {
      status: 500,
    });
  }
}
