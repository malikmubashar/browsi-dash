import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import StoreWrapper from "@/components/store";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";
import Dialogs from "@/components/dialog";
import "@/idb";

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
      <html lang="en">
        <body className={inter.className}>
          <Header />
          {children}
          <Toaster />
          <Dialogs />
        </body>
      </html>
    </StoreWrapper>
  );
}
