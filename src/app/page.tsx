"use client";

import { useEffect } from 'react';

import Survey from '@/components/Survey';
import UserForm from '@/components/UserForm';
import useUser from '@/hooks/useUser';

import TAResults from '../components/TAResults';

export default function Home() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <main className="lg:p-24 min-h-fit">
      {user.type !== "student" ? (
        <UserForm type="student" />
      ) : (
        <Survey />
      )}
    </main>
  );
}
