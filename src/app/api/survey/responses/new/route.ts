import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    /* format of incoming body
    {
      user: {
        type: 'student',
        name: 'Divyansh',
        rollNumber: '1/20/FET/BCS/043',
        branch: 'B.Tech CSE',
        semester: '1',
        id: 'clkpavhpp0000pe4s5jqio2zx'
      },
      survey_id: 'transactional_analysis',
      responses: [ { id: '1', response: '2' }, { id: '2', response: '3' } ]
    }
  */

    if (body.user.type === "student") {
      for (const responseItem of body.responses) {
        const questionId = parseInt(responseItem.id, 10);
        const responseValue = parseInt(responseItem.response, 10);

        await db.responses.create({
          data: {
            survey: {
              connect: {
                id: body.survey_id,
              },
            },
            question: {
              connect: {
                question_id: questionId,
              },
            },
            option: {
              connect: {
                option_id: responseValue, // Assuming response value corresponds to option_id
              },
            },
            student: {
              connect: {
                id: body.user.id,
              },
            },
          },
        });
      }
    } else if (body.user.type === "employee") {
      for (const responseItem of body.responses) {
        const questionId = parseInt(responseItem.id, 10);
        const responseValue = parseInt(responseItem.response, 10);

        await db.responses.create({
          data: {
            survey: {
              connect: {
                id: body.survey_id,
              },
            },
            question: {
              connect: {
                question_id: questionId,
              },
            },
            option: {
              connect: {
                option_id: responseValue, // Assuming response value corresponds to option_id
              },
            },
            employee: {
              create: {
                name: body.user.name,
                age: parseInt(body.user.age, 10),
                workExperience: body.user.workExperience,
                orgName: body.user.orgName,
                gender: body.user.gender,
              },
            },
          },
        });
      }
    }

    return new Response(JSON.stringify({ message: "Success" }), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again" }),
      {
        status: 500,
      }
    );
  }
}
