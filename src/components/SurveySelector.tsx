"use client";
import axios from 'axios';
import Link from 'next/link';
import { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

interface SurveySelectorProps {}

const SurveySelector: FC<SurveySelectorProps> = ({}) => {
  const {
    data: surveys,
    isFetching,
    isLoading,
  } = useQuery(["surveys"], async () => {
    const { data } = await axios.get("/api/survey/all");
    return data;
  });

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold">Select a survey to begin</h1>
      <div>
        {isLoading || (isFetching && <p>Loading...</p>)}
        <div className="flex flex-col my-2 space-y-2">
          {surveys?.map((survey: any) => (
            <Link key={survey.id} href={`/employee/survey/${survey.id}`}>
              <div className="p-4 border border-gray-200 rounded-lg">
                <p>{survey.title}</p>
                <p>{survey.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SurveySelector;
