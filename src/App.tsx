import { Field, Form, Formik } from 'formik';
import { CSSProperties, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import styled from '@emotion/styled';

import sanityClient from './client';

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

const App = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [personalDetailsSubmitted, setPersonalDetailsSubmitted] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          window.open("about:blank", "_self");
          window.close();
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
      <div className="w-full flex flex-row items-center justify-center mb-2 pb-2 border-b-2 border-gray-300">
        <img
          src="https://manavrachna.edu.in/wp-content/uploads/2022/09/newmrlogo-scaled.jpg"
          className="w-[200px] "
        />
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
              <h2 className="text-xl font-semibold text-center">Questions</h2>
              <h1 className="text-sm text-gray-500 text-center">
                Please select the option that best describes you.
              </h1>
              <h1 className="text-sm text-gray-500 text-center">
                Please answer all questions.
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

export default App;
