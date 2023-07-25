import { Field, Form, Formik } from 'formik';
import { CSSProperties, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import styled from '@emotion/styled';

import sanityClient from '../client';

interface Question {
  questionId: number;
  question: string;
}

const Label = styled.label`
  margin-right: 8px;
`;

const OptionContainer = styled.div`
  margin-bottom: 8px;
`;

const options = [
  "Almost Never",
  "Rarely",
  "Sometimes",
  "Frequently",
  "Very Frequently",
];

const initialValues = {
  "Student Name": "",
  RollNumber: "",
  Branch: "",
  Semester: "",
};


const FormPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [personalDetailsSubmitted, setPersonalDetailsSubmitted] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([])

  useEffect(() => {
    // Fetch questions from Sanity
    sanityClient
      .fetch('*[_type == "questions"]{question, questionId}')
      .then((data) => {
        const sortedData = data.sort(
          (a: Question, b: Question) => a.questionId - b.questionId
        );
        setQuestions(sortedData);
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  useEffect(() => {
    if(!isSubmitted) return
    fetch("https://script.googleusercontent.com/macros/echo?user_content_key=tVwz64Sl1klQon_lZLW4myQqx3cYSxOkcYVyT8pZG_u7bMb01fgxD5IqM4yADIdduFCn7nN3SEi38uOiVm1GxqSppL_xDREzm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMi42bRYzZy3riDdvlAkWszRm9m-R0scv3xLo0-S3yCaacQCdOZWlgNkRUrXQEBQUV1gSvSZXOOM4ZYbj1USgFmmKbFgBBuMm9z9Jw9Md8uu&lib=Mj9sCKg167WlSD7i4YbtxJMb_W9z17S8P")
        .then(res => res.json())
        .then(res => {
            setIsLoading(false)
            console.log(res.filter((r:any) => r.RollNumber === initialValues.RollNumber))
        })
        .catch(err => {
            alert("Something went wrong")
            console.log(err)
        })
}, [isSubmitted])

  const formatResponses = (
    responses: Record<string, string | number>
  ): object[] => {
    const formatedResponses: object[] = [];

    Object.keys(responses).map((response) => {
      const questionId = response.split("_")[1];
      const optionIndex = options.indexOf(responses[response] as string) + 1;

      formatedResponses.push({
        questionId,
        optionIndex,
      });
    });

    return formatedResponses;
  };

  const handleSubmit = (values: Record<string, string | number>) => {
    if (!personalDetailsSubmitted) {
      setPersonalDetailsSubmitted(true);
      return;
    }

    const only_questions: Record<string, string | number> = Object.keys(values)
      .filter((key) => key.includes("question"))
      .reduce((obj: Record<string, string | number>, key: string) => {
        obj[key] = values[key];
        return obj;
      }, {});

    const valuesWithoutQuestions = Object.keys(values)
      .filter((key) => !key.includes("question"))
      .reduce((obj: Record<string, string | number>, key) => {
        obj[key] = values[key];
        return obj;
      }, {});

    const formatedResponses = formatResponses(only_questions);
    console.log({
      ...valuesWithoutQuestions,
      responses: formatedResponses,
    });

    saveData({
      ...valuesWithoutQuestions,
      responses: JSON.stringify(formatedResponses),
    });
  };

  const saveData = (data: Record<string, string>) => {
    setIsLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          switch (data.code) {
            case "RECORD_EXISTS":
              alert("You have already submitted the form");
              break;
            case "RECORD_CREATED":
              alert("Form submitted successfully");
              break;
            default:
              alert("Error submitting form");
          }
        } else {
          alert("Form submitted successfully");
          setIsSubmitted(true)
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error submitting form");
      });

    setIsLoading(false);
  };

  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  if (isLoading)
    return (
      <ClipLoader
        color={"black"}
        loading={isLoading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );

  return (
    <div className="px-3">
      {" "}
      <div className="w-full flex flex-col items-center justify-center mb-2 pb-2 border-b-2 border-gray-300">
        <img
          src="https://manavrachna.edu.in/wp-content/uploads/2023/04/mrnaac-jpg.jpg"
          className="w-[200px] "
        />
        <h2 className='text-xl font-semibold'>School of Leadership and Management</h2>
      </div>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          {!personalDetailsSubmitted && (
            <>
              <h2 className="text-xl font-semibold text-center">
                Your Details
              </h2>
              <div className="flex flex-col space-y-2 my-4">
                <div className="flex flex-col space-y-2">
                  <label>Name:</label>
                  <Field
                    type="text"
                    name="Student Name"
                    className="border-2 border-gray-400 px-3 py-2 focus:outline-blue-500 rounded-lg w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label>Roll Number:</label>
                  <Field
                    type="text"
                    name="RollNumber"
                    className="border-2 border-gray-400 px-3 py-2 focus:outline-blue-500 rounded-lg w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label>Branch:</label>
                  <Field
                    type="text"
                    name="Branch"
                    className="border-2 border-gray-400 px-3 py-2 focus:outline-blue-500 rounded-lg w-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label>Semester:</label>
                  <Field
                    type="number"
                    name="Semester"
                    className="border-2 border-gray-400 px-3 py-2 focus:outline-blue-500 rounded-lg w-full"
                  />
                </div>
              </div>
            </>
          )}
          {personalDetailsSubmitted && (
            <div className="pb-2">
              <h2 className="text-xl font-semibold text-center">Express yourself</h2>
              <h1 className="text-sm text-gray-500 text-center">
                Modus Operandi: Indicate how frequently you do each of the following by putting a tick mark in the proper column opposite to each item. Please feel free to respond as this purely for your consumption. If you will not honest to these items you will get a negative picture of yours. 
              </h1>
              <div className="flex flex-col space-y-3 my-2">
                {questions.map((question) => (
                  <div
                    key={question.questionId}
                    className="border-2 border-gray-300 px-3 py-2 rounded-lg"
                  >
                    <p className="text-lg font-semibold">
                      {question.questionId}. {question.question}
                    </p>
                    <OptionContainer className="flex flex-col space-y-2 my-2">
                      {options.map((option, optionIndex) => (
                        <Label
                          key={optionIndex}
                          className="flex flex-row space-x-2 items-center"
                        >
                          <Field
                            type="radio"
                            name={`question_${question.questionId}`}
                            value={option}
                            required
                            className="w-4 h-4"
                          />
                          <span>{option}</span>
                        </Label>
                      ))}
                    </OptionContainer>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "16px",
              marginBottom: "32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#03a5fc",
              color: "white",
              fontWeight: 600,
              fontSize: "16px",
            }}
          >
            {!personalDetailsSubmitted ? "Next" : "Submit"}
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default FormPage;
