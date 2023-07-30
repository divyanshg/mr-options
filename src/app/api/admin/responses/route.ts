import { db } from '@/lib/db';

function formatName(s: string) {
  return s.replace(/ /g, "_").toLowerCase();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const surveyId = url.searchParams.get("surveyId");

    const unformattedResponses = await db.responses.findMany({
      where: {
        survey_id: surveyId as string,
      },
      include: {
        student: true,
        employee: true,
        question: true,
        option: true,
      },
    });

    const studentRollNumbers: string[] = [];
    const employeesWithIndex: string[] = [];

    unformattedResponses.forEach((item: any, idx: number) => {
      if (item.student) {
        studentRollNumbers.push(item.student.rollNumber);
      }

      if (item.employee) {
        // Check if the 'name' field exists in the employee object
        const hasEmployeeName = "name" in item.employee;

        // Create a new object with the 'employee_index' field added
        // const employeeWithIndex = {
        //   ...item.employee,
        //   employee_index: hasEmployeeName
        //     ? item.employee.name
        //     : "employee_index",
        // };

        employeesWithIndex.push(formatName(`response@${item.employee.orgName}`));
      }
    });

    const studentResponses: any = {};

    unformattedResponses.forEach((item: any) => {
      if (item.student) {
        if (!studentResponses[item.student.rollNumber]) {
          studentResponses[item.student.rollNumber] = {
            student_details: item.student,
            responses: {},
          };
        }
        studentResponses[item.student.rollNumber].responses[
          `question_${item.question.question_id}`
        ] = item.option.option_number;
      }
    });

    const employeeResponses: any = {};

    unformattedResponses.forEach((item: any) => {
      if (item.employee) {
        if (!employeeResponses[formatName(`response@${item.employee.orgName}`)]) {
          employeeResponses[formatName(`response@${item.employee.orgName}`)] = {
            employee_details: item.employee,
            responses: {},
          };
        }
        employeeResponses[formatName(`response@${item.employee.orgName}`)].responses[
          `question_${item.question.question_id}`
        ] = item.option.option_number;
      }
    });

    const response = {
      student_responses: studentResponses,
      employee_responses: employeeResponses,
      student_roll_numbers: studentRollNumbers,
      employees_with_index: employeesWithIndex,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
