"use client";
import { FC } from 'react';

import Survey from '@/components/Survey';

interface pageProps {
  params: {
    id: string;
  };
}

const Page: FC<pageProps> = ({ params }) => {
  return <Survey id={params.id} />;
};

export default Page;
