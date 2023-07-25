import {useEffect , useState} from "react";

const SurveyTable = ({ data }: {data: any}) => {
  // Function to calculate the total count of each option
  const calculateTotalCount = (optionNum: number) => {
    let totalCount = 0;
    for (let i = 1; i <= 36; i++) {
      for (const student of data) {
        if (student[`Question_${i}`] === optionNum) {
          totalCount++;
          break; // Break inner loop to avoid counting the same question multiple times for a student
        }
      }
    }
    return totalCount;
  };

  return (
    <div className="my-4">
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr>
            <th className="border p-2">Question No.</th>
            <th className="border p-2">Option 1</th>
            <th className="border p-2">Option 2</th>
            <th className="border p-2">Option 3</th>
            <th className="border p-2">Option 4</th>
            <th className="border p-2">Option 5</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 36 }, (_, index) => index + 1).map((questionNum) => (
            <tr key={questionNum} className="text-center">
              <td className="border p-2">{questionNum}</td>
              {[1, 2, 3, 4, 5].map((optionNum) => (
                <td key={optionNum} className="border p-2">
                  {data.map((student: any) => (
                    <span
                      key={student.RollNumber}
                      className={student[`Question_${questionNum}`] === optionNum ? 'font-bold' : ''}
                    >
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
            <td className="border p-2 font-bold">Total Count</td>
            {[1, 2, 3, 4, 5].map((optionNum) => (
              <td key={optionNum} className="border p-2">
                {calculateTotalCount(optionNum)}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};


export default function AdminPage(): JSX.Element{
    const [allData, setAllData] = useState<any[]>([])
    const [selectedRollNumber, setSelectedRollNumber] = useState(allData[0]?.RollNumber);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [loggedIn, setLoggedIn] = useState(false);

    const adminPassword = 'yourAdminPassword'; // Replace this with your actual admin password

    const inputPassword = prompt('Enter Admin Password:');
    if (inputPassword === adminPassword) {
        setLoggedIn(true);
    } else {
        alert('Invalid password. Please try again.');
    }


    const handleLogout = () => {
        setLoggedIn(false);
    };

    const handleSelectChange = (event: any) => {
      setSelectedRollNumber(event.target.value);
    };
  
    const selectedStudentData = allData.find((student: any) => student.RollNumber === selectedRollNumber);

    useEffect(() => {
        if(!loggedIn) return
        fetch("https://script.googleusercontent.com/macros/echo?user_content_key=tVwz64Sl1klQon_lZLW4myQqx3cYSxOkcYVyT8pZG_u7bMb01fgxD5IqM4yADIdduFCn7nN3SEi38uOiVm1GxqSppL_xDREzm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMi42bRYzZy3riDdvlAkWszRm9m-R0scv3xLo0-S3yCaacQCdOZWlgNkRUrXQEBQUV1gSvSZXOOM4ZYbj1USgFmmKbFgBBuMm9z9Jw9Md8uu&lib=Mj9sCKg167WlSD7i4YbtxJMb_W9z17S8P")
            .then(res => res.json())
            .then(res => {
                setIsLoading(false)
                setAllData(res)
            })
            .catch(err => {
                alert("Something went wrong")
                console.log(err)
            })
    }, [loggedIn])

    if(loggedIn){

    if(isLoading){
        return (
            <p>Loading...</p>
        )
    }else{

        return (
        <div>
                <div className="w-full flex flex-col items-center justify-center mb-2 pb-2 border-b-2 border-gray-300">
                    <img
                    src="https://manavrachna.edu.in/wp-content/uploads/2023/04/mrnaac-jpg.jpg"
                    className="w-[200px] "
                    />
                    <h2 className='text-xl font-semibold'>School of Leadership and Management</h2>
                    <h2 className='text-xl font-semibold'>Responses</h2>

                </div>
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
        }else{
            return <p>Please refresh to login.</p>
        }
}