"use client";
import { createContext, FC, useReducer } from 'react';

interface UserProps {
  children: React.ReactNode;
}

type InitialState = {
  id?: string;
  name?: string;
  type: "student" | "employee" | "";
  submittedAt?: string;
} & (Student | Employee | { type: "" });

type Student = {
  type: "student";
  rollNumber: string;
  branch: string;
  semester: string;
};

type Employee = {
  type: "employee";
  age: number;
  workExperience: number;
  orgName: string;
  gender: "Male" | "Female";
};

type Context = {
  user: InitialState;
  dispatch: React.Dispatch<any>;
};

const initialState: InitialState = {
  name: "",
  type: "",
};

export const UserContext = createContext<Context>({
  user: initialState,
  dispatch: () => null,
});

function reducer(state: InitialState, action: any) {
  switch (action.type) {
    case "SET_USER":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

const User: FC<UserProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ user: state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export type { InitialState as UserState };
export default User;
