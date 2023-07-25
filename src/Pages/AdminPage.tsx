import {useEffect , useState} from "react";

const SurveyTable = ({ data }: {data: any}) => {
  // Function to calculate the total count of each option
  const calculateTotalCount = (optionNum: number) => {
    return data.reduce((total: number, student: any) => {
      return total + (student[`Question_${optionNum}`] === optionNum ? 1 : 0);
    }, 0);
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Question No.</th>
          <th>Option 1</th>
          <th>Option 2</th>
          <th>Option 3</th>
          <th>Option 4</th>
          <th>Option 5</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 36 }, (_, index) => index + 1).map((questionNum) => (
          <tr key={questionNum}>
            <td>{questionNum}</td>
            {[1, 2, 3, 4, 5].map((optionNum) => (
              <td key={optionNum}>
                {data.map((student: any) => (
                  <span key={student.RollNumber}>
                    {student[`Question_${questionNum}`] === optionNum ? '*' : ''}
                  </span>
                ))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td>Total Count</td>
          {[1, 2, 3, 4, 5].map((optionNum) => (
            <td key={optionNum}>{calculateTotalCount(optionNum)}</td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};


export default function AdminPage(): JSX.Element{
    const [allData, setAllData] = useState<any[]>([])
    const [selectedRollNumber, setSelectedRollNumber] = useState(allData[0]?.RollNumber);

    const handleSelectChange = (event: any) => {
      setSelectedRollNumber(event.target.value);
    };
  
    const selectedStudentData = allData.find((student: any) => student.RollNumber === selectedRollNumber);

    useEffect(() => {
        fetch("https://script.googleusercontent.com/macros/echo?user_content_key=tVwz64Sl1klQon_lZLW4myQqx3cYSxOkcYVyT8pZG_u7bMb01fgxD5IqM4yADIdduFCn7nN3SEi38uOiVm1GxqSppL_xDREzm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMi42bRYzZy3riDdvlAkWszRm9m-R0scv3xLo0-S3yCaacQCdOZWlgNkRUrXQEBQUV1gSvSZXOOM4ZYbj1USgFmmKbFgBBuMm9z9Jw9Md8uu&lib=Mj9sCKg167WlSD7i4YbtxJMb_W9z17S8P")
            .then(res => res.json())
            .then(res => setAllData(res))
            .catch(err => {
                alert("Something went wrong")
                console.log(err)
            })
    }, [])

    return (
       <div>
      <h1>Survey Results</h1>
      <div>
        <label htmlFor="selectRollNumber">Select RollNumber:</label>
        <select
          id="selectRollNumber"
          value={selectedRollNumber}
          onChange={handleSelectChange}
        >
          {allData.map((student: any) => (
            <option key={student.RollNumber} value={student.RollNumber}>
              {student.RollNumber}
            </option>
          ))}
        </select>
      </div>
      {selectedStudentData && <SurveyTable data={[selectedStudentData]} />}
    </div>
    )
}