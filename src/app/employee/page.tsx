"use client";
import { useEffect } from 'react';

import SurveySelector from '@/components/SurveySelector';
import UserForm from '@/components/UserForm';
import useUser from '@/hooks/useUser';

const Page = () => {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <main className="lg:p-24 min-h-fit">
      {user.type !== "employee" ? (
        <UserForm type="employee" />
      ) : (
        <SurveySelector />
      )}
    </main>
  );
};

export default Page;
