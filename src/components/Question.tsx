
import { Input } from './ui/Input';

interface QuestionProps {
  question_id: number;
  question_number: number;
  survey_id: string;
  question_text: string;
  options: Option[];
}

interface Option {
  option_id: number;
  option_number: number;
  option_text: string;
  score: number;
}

const Question = ({
  question,
  register,
}: {
  question: QuestionProps;
  register: any;
}) => {
  return (
    <div className="w-full p-4 border border-gray-200 rounded-lg">
      <div className="flex flex-row space-x-1">
        <h1 className="text-xl font-semibold">
          {question.question_number}. {question.question_text}
        </h1>
      </div>
      <ul className="my-2 space-y-3">
        {question.options.map((option) => (
          <li key={option.option_id} className="">
            <label className="flex flex-row items-center justify-start space-x-2">
              <Input
                type="radio"
                name={`question_${question.question_id}`}
                value={option.option_number}
                className="w-6 h-6"
                {...register(`question_${question.question_id}`, {
                  required: `Question ${question.question_number} is required`,
                })}
              />
              <span>{option.option_text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
