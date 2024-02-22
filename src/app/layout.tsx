import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import StoreWrapper from "@/components/store";
import { Toaster } from "react-hot-toast";
import Dialogs from "@/components/dialog";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Browsi",
  description: "A dashboard for your browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreWrapper>
      <html lang="en" className="">
        <body className={inter.className}>
          {children}
          <Toaster />
          <Dialogs />
        </body>
      </html>
    </StoreWrapper>
  );
}
