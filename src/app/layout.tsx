import '@/styles/globals.css';

import { Inter } from 'next/font/google';

import Header from '@/components/Header';
import { Toaster } from '@/components/ui/Toaster';
import Manager from '@/context/Manager';

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manav Rachna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <Manager>{children}</Manager>
        <Toaster />
      </body>
    </html>
  );
}
