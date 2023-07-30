import type { UserState } from "@/context/User";
import { db } from '../../../lib/db';

export async function POST(req: Request) {
  try {
    const user: UserState = await req.json();

    if (user.type !== "student")
      return new Response(JSON.stringify({ code: "NOT_STUDENT" }), {
        status: 200,
      });

    let userExists = await db.student.findFirst({
      where: {
        rollNumber: user.rollNumber,
      },
    });

    if (!userExists) {
      //create user
      userExists = await db.student.create({
        data: {
          rollNumber: user.rollNumber,
          name: user.name as string,
          branch: user.branch,
          semester: user.semester,
        },
      });
    }

    const responseExists = await db.responses.findFirst({
      where: {
        student_id: userExists.id,
      },
    });

    if (responseExists)
      return new Response(JSON.stringify({ code: "RESPONSE_EXISTS" }), {
        status: 200,
      });

    return new Response(
      JSON.stringify({ code: "USER_EXISTS", user: userExists }),
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
