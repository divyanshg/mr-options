import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import styled from '@emotion/styled';

import sanityClient from '../client';
import { SurveyTable } from './AdminPage';

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

function getHumanReadableDateTime() {
  const now = new Date();

  // Get date components
  const year = now.getFullYear();
  const month = now.toLocaleString("default", { month: "long" }); // e.g., "January"
  const day = now.getDate();

  // Get time components
  let hours = now.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Concatenate the components into a human-readable date and time string
  const humanReadableDateTime = `${month} ${day}, ${year} - ${hours}:${minutes}:${seconds} ${ampm}`;

  return humanReadableDateTime;
}

const FormPage = (): JSX.Element => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [personalDetailsSubmitted, setPersonalDetailsSubmitted] =
    useState<boolean>(false);
  const [personalDetails, setPersonalDetails] = useState<
    Record<string, string | number>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [submitted, setSubmit] = useState<boolean>(false);
  const [responseRecorded, setResponseRecorded] = useState<boolean>(false);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

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

  const getNewData = (arr: { questionId: string; optionIndex: string }[]) => {
    const obj: Record<string, number> = {}; // Explicitly define the type of obj

    arr.forEach((item: { questionId: string; optionIndex: string }) => {
      obj[`Question_${item.questionId}`] = parseInt(item.optionIndex, 10);
    });

    return obj;
  };

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
    if (responseRecorded) return alert("Your response is being recorded");

    setIsLoading(true);
    if (!personalDetailsSubmitted) {
      setPersonalDetails(values);
      setPersonalDetailsSubmitted(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setResponseRecorded(true);
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
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((_data) => {
        console.log(_data);
        if (!_data.success) {
          switch (_data.code) {
            case "RECORD_EXISTS":
              alert("You have already submitted the form");
              break;
            case "RECORD_CREATED":
              alert("Thank you for patient answering! Uploading your Marks….");
              break;
            default:
              alert("Error submitting form");
          }
        } else {
          alert("Thank you for patient answering! Uploading your Marks….");
          setAllData(
            getNewData(JSON.parse(data.responses)) as unknown as any[]
          );
          setSubmit(true);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Error submitting form");
      });

    setIsLoading(false);
  };

  return (
    <div className="px-3">
      {" "}
      <div className="flex flex-col items-center justify-center w-full pb-2 mb-2 border-b-2 border-gray-300">
        <img
          src="https://manavrachna.edu.in/wp-content/uploads/2023/04/mrnaac-jpg.jpg"
          className="w-[200px] "
        />
        <h2 className="text-xl font-semibold">
          School of Leadership and Management
        </h2>
      </div>
      {!submitted && (
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          <Form>
            {!personalDetailsSubmitted && (
              <>
                <h2 className="text-xl font-semibold text-center">
                  Your Details
                </h2>
                <div className="flex flex-col my-4 space-y-2">
                  <div className="flex flex-col space-y-2">
                    <label>Name:</label>
                    <Field
                      type="text"
                      name="Student Name"
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label>Roll Number:</label>
                    <Field
                      type="text"
                      name="RollNumber"
                      placeholder="Eg. 1/20/FET/BCS/043"
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label>Branch:</label>
                    <Field
                      type="text"
                      name="Branch"
                      placeholder="Eg. B.Tech CSE"
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label>Semester:</label>
                    <Field
                      type="number"
                      name="Semester"
                      min="1"
                      className="w-full px-3 py-2 border-2 border-gray-400 rounded-lg focus:outline-blue-500"
                    />
                  </div>
                </div>
              </>
            )}
            {personalDetailsSubmitted && (
              <div className="pb-2">
                <h2 className="text-xl font-semibold text-center">
                  Express yourself
                </h2>
                <h1 className="text-sm text-center text-gray-500">
                  Modus Operandi: Indicate how frequently you do each of the
                  following by putting a tick mark in the proper column opposite
                  to each item. Please feel free to respond as this purely for
                  your consumption. If you will not honest to these items you
                  will get a negative picture of yours.
                </h1>
                <div className="flex flex-col my-2 space-y-3">
                  {questions.map((question) => (
                    <div
                      key={question.questionId}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg"
                    >
                      <p className="text-lg font-semibold">
                        {question.questionId}. {question.question}
                      </p>
                      <OptionContainer className="flex flex-col my-2 space-y-2">
                        {options.map((option, optionIndex) => (
                          <Label
                            key={optionIndex}
                            className="flex flex-row items-center space-x-2"
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
              className="px-3 py-2 border-2 border-gray-400 rounded-lg disabled:cursor-not-allowed disabled:opacity-50 width-full focus:outline-blue-500 hover:bg-blue-500 hover:text-white"
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
              {isLoading
                ? "Loading..."
                : !personalDetailsSubmitted
                ? "Next"
                : "Submit"}
            </button>
          </Form>
        </Formik>
      )}
      {submitted && (
        <>
          <div className="flex flex-col p-3 my-4 border-2 border-gray-200 rounded-lg">
            <div>
              <span className="text-lg font-semibold underline">
                Roll Number:
              </span>
              <span className="text-lg font-semibold">
                {" "}
                {personalDetails.RollNumber}
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold underline">
                Student Name:
              </span>
              <span className="text-lg font-semibold">
                {" "}
                {personalDetails["Student Name"]}
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold underline">Branch:</span>
              <span className="text-lg font-semibold">
                {" "}
                {personalDetails.Branch}
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold underline">Semester:</span>
              <span className="text-lg font-semibold">
                {" "}
                {personalDetails.Semester}
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold underline">
                Submitted At:
              </span>
              <span className="text-lg font-semibold">
                {" "}
                {getHumanReadableDateTime()}
              </span>
            </div>
          </div>
          <SurveyTable data={[allData]} />
        </>
      )}
    </div>
  );
};

export default FormPage;
