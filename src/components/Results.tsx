import { FC } from 'react';

import { UserState } from '../context/User';
import TAResults from './TAResults';
import UserData from './UserData';

interface ResultsProps {
  type: "TA" | "FR" | "WT";
  responses: any;
  user: UserState;
}

const Results: FC<ResultsProps> = ({ type, responses, user }) => {
  console.log(responses);
  return (
    <div>
      <UserData {...user} />
      <h1 className="mx-3 my-3 text-lg font-semibold">Results</h1>
      {type === "TA" && <TAResults data={[responses]} />}
    </div>
  );
};

export default Results;
