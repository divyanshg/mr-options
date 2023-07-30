"use client";
import axios from 'axios';
import { FC, useEffect, useState } from 'react';

import ResponseList from '@/components/Admin/ResponseList';
import SurveyList from '@/components/Admin/SurveyList';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

import Results from '../../components/Results';

interface pageProps {}

const convertData = (data: any) => {
  let uniqueData = data?.filter(
    (item: any, index: number) => data.indexOf(item) === index
  );
  return uniqueData?.map((d: any) => ({
    label: d,
    value: d,
  }));
};

const Page: FC<pageProps> = ({}) => {
  const [sopen, setsOpen] = useState<boolean>(false);
  const [ropen, setrOpen] = useState<boolean>(false);

  const [value, setValue] = useState<string>("");

  const [responses, setResponses] = useState<any>();
  const [selectedResponse, setSelectedResponse] = useState<any>("");
  const [type, setType] = useState<"student" | "employee">("student");

  const { toast } = useToast();

  const { data, isFetching, isLoading } = useQuery(["surveys"], async () => {
    const { data } = await axios.get("/api/survey/all");
    return data;
  });

  const surveys = data?.map((survey: any) => ({
    label: survey.title,
    value: survey.id,
  }));

  useEffect(() => {
    const get = async () => {
      const surveyId = surveys?.find(
        (survey: any) => survey.label.toLowerCase() === value.toLowerCase()
      )?.value;

      const { data } = await axios.get(
        `/api/admin/responses?surveyId=${surveyId}`
      );

      if (data.length == 0) {
        toast({
          title: "No responses found",
          description: "No responses were found for this survey.",
        });
      }
      console.log(data);
      setResponses(data);
    };

    if (value && value.length > 0) get();
  }, [value]);

  return (
    <div>
      <div className="flex flex-row items-center space-x-2">
        <SurveyList
          open={sopen}
          setOpen={setsOpen}
          value={value}
          setValue={setValue}
          surveys={surveys ?? []}
        />
        <select
          className="px-2 py-2 bg-gray-100 border border-gray-300 rounded-md"
          value={type}
          onChange={(e) => {
            setSelectedResponse("");
            setType(e.target.value as any);
          }}
        >
          <option value="student">Student</option>
          <option value="employee">Employee</option>
        </select>
        {value && value.length > 0 && (
          <ResponseList
            open={ropen}
            setOpen={setrOpen}
            responses={
              convertData(
                responses &&
                  responses[
                    type === "student"
                      ? "student_roll_numbers"
                      : "employees_with_index"
                  ]
              ) ?? []
            }
            value={selectedResponse}
            setValue={setSelectedResponse}
          />
        )}
      </div>
      {type === "student" &&
        selectedResponse &&
        selectedResponse.length > 0 && (
          <Results
            user={{
              ...responses.student_responses[selectedResponse.toUpperCase()]
                ?.student_details,
              type: "student",
            }}
            type="TA"
            responses={
              responses.student_responses[selectedResponse.toUpperCase()]
                .responses
            }
          />
        )}
      {type === "employee" &&
        selectedResponse &&
        selectedResponse.length > 0 && (
          <Results
            user={{
              ...responses.employee_responses[selectedResponse]
                ?.employee_details,
              type: "employee",
            }}
            type="TA"
            responses={responses.employee_responses[selectedResponse].responses}
          />
        )}
    </div>
  );
};

export default Page;
