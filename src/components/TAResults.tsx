import { FC } from 'react';

interface TAResultsProps {
  data: any[];
}

const points = [0, 1, 2, 3, 4];
const letters = ["A", "B", "C", "D", "E", "F"];

const markings: Record<string, number> = {
  question_1: 3,
  question_2: 6,
  question_3: 1,
  question_4: 3,
  question_5: 6,
  question_6: 6,
  question_7: 5,
  question_8: 4,
  question_9: 2,
  question_10: 4,
  question_11: 1,
  question_12: 4,
  question_13: 5,
  question_14: 3,
  question_15: 5,
  question_16: 3,
  question_17: 2,
  question_18: 4,
  question_19: 1,
  question_20: 5,
  question_21: 3,
  question_22: 2,
  question_23: 6,
  question_24: 1,
  question_25: 4,
  question_26: 6,
  question_27: 2,
  question_28: 3,
  question_29: 4,
  question_30: 5,
  question_31: 2,
  question_32: 2,
  question_33: 6,
  question_34: 5,
  question_35: 1,
  question_36: 1,
};

const TAResults: FC<TAResultsProps> = ({ data }) => {
//   const data = [
//     {
//       question_1: 3,
//       question_2: 2,
//       question_3: 1,
//       question_4: 3,
//       question_5: 2,
//       question_6: 2,
//       question_7: 5,
//       question_8: 4,
//       question_9: 2,
//       question_10: 4,
//       question_11: 1,
//       question_12: 4,
//       question_13: 5,
//       question_14: 3,
//       question_15: 5,
//       question_16: 3,
//       question_17: 2,
//       question_18: 4,
//       question_19: 1,
//       question_20: 5,
//       question_21: 3,
//       question_22: 2,
//       question_23: 2,
//       question_24: 1,
//       question_25: 4,
//       question_26: 2,
//       question_27: 2,
//       question_28: 3,
//       question_29: 4,
//       question_30: 5,
//       question_31: 2,
//       question_32: 2,
//       question_33: 2,
//       question_34: 5,
//       question_35: 1,
//       question_36: 1,
//     },
//   ];
  const calculateTotalCount = (optionNum: number) => {
    let totalCount = 0;
    Array.from({ length: 36 }, (_, index) => index + 1).map((questionNum) => {
      data.forEach((student: any) => {
        if (markings[`question_${questionNum}`] === optionNum) {
          totalCount += points[
            student[`question_${questionNum}`] - 1
          ] as number;
        }
      });
    });
    return totalCount;
  };

  return (
    <div className="my-4">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="p-2 border">Question No.</th>
            <th className="p-2 border">A</th>
            <th className="p-2 border">B</th>
            <th className="p-2 border">C</th>
            <th className="p-2 border">D</th>
            <th className="p-2 border">E</th>
            <th className="p-2 border">F</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 36 }, (_, index) => index + 1).map(
            (questionNum) => (
              <tr key={questionNum} className="text-center">
                <td className="p-2 border">{questionNum}</td>
                {[1, 2, 3, 4, 5, 6].map((optionNum) => (
                  <td key={optionNum} className="p-2 border">
                    {data.map((student: any) => (
                      <span
                        key={student.RollNumber}
                        className={
                          markings[`question_${questionNum}`] === optionNum
                            ? "font-bold"
                            : ""
                        }
                      >
                        {markings[`question_${questionNum}`] === optionNum
                          ? points[student[`question_${questionNum}`] - 1]
                          : ""}
                      </span>
                    ))}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-2 font-bold text-center border">Total Count</td>
            {[1, 2, 3, 4, 5, 6].map((optionNum) => (
              <td key={optionNum} className="p-2 text-center border">
                <span className="font-semibold">
                  {letters[optionNum - 1]} - {calculateTotalCount(optionNum)}
                </span>
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default TAResults;
