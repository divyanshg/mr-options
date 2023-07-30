import axios from 'axios';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Skeleton } from '@/components/ui/skeleton';
import useUser from '@/hooks/useUser';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useToast } from '../hooks/use-toast';
import Question from './Question';
import Results from './Results';
import { Button } from './ui/Button';

interface StudentSurveyProps {
  id?: string;
}

const Survey: FC<StudentSurveyProps> = ({
  id = "transactional_analysis",
}) => {
  const fetchSurvey = async () => {
    const { data } = await axios.get(`/api/survey?surveyId=${id}`);
    return data;
  };

  const {
    data: survey,
    error,
    isFetching,
    isLoading,
  } = useQuery(["survey"], fetchSurvey);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [responses, setResponses] = useState<any>({});

  const { mutate: saveResponses } = useMutation({
    mutationFn: (data: any) => {
      const payload = data;
      return axios.post("/api/survey/responses/new", payload);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while saving your responses.",
        variant: "destructive",
        duration: 5000,
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Your responses have been recorded.",
      });
      setSubmitted(true);
    },
  });

  const { toast } = useToast();
  const { user } = useUser();

  const [isBtnLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching the questions.",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [error]);

  if (isLoading || isFetching) {
    return (
      <div className="w-full p-4 border border-gray-200 rounded-lg">
        <div>
          <Skeleton className="h-4 my-2" />
          <Skeleton className="h-4 my-2 w-[250px]" />
        </div>
        <ul className="mt-4">
          <li>
            <Skeleton className="h-4 my-2 w-[100px]" />
            <Skeleton className="h-4 my-2 w-[80px]" />
            <Skeleton className="h-4 my-2 w-[120px]" />
            <Skeleton className="h-4 my-2 w-[100px]" />
          </li>
        </ul>
      </div>
    );
  }

  async function onSubmit(data: any) {
    setIsLoading(true);
    setResponses(data);

    /*convet data from the format {question_id: response} to {
      id: question_id,
      response: response
    }*/

    const responses = Object.entries(data).map(([id, response]) => ({
      id: id.split("_")[1],
      response,
    }));

    console.log(responses);

    saveResponses({
      user,
      survey_id: survey.id,
      responses,
    });
  }

  if (submitted) return <Results type="TA" responses={responses} user={user} />;

  if (survey) {
    return (
      <div className="flex flex-col w-full my-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-xl font-semibold">{survey.title}</h1>
          <pre>{survey.description}</pre>
        </div>
        <form id="questions-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col p-4 mx-2 space-y-2">
            {survey.questions.map((question: any) => (
              <Question
                key={question.question_id}
                question={question}
                register={register}
              />
            ))}
          </div>
          <div className="flex flex-col p-4 py-2 mx-2 space-y-2">
            <Button isLoading={isBtnLoading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default Survey;
