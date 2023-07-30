"use client";
import { FC } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import User from '../User';

interface ManagerProps {
  children: React.ReactNode;
}

const Manager: FC<ManagerProps> = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <User>{children}</User>
    </QueryClientProvider>
  );
};

export default Manager;
