import type { Metadata } from "next";
import { NationalBackdrop } from "@/components/NationalBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewRez World Cup Prediction",
  description: "Private tournament prediction app for a friend group."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <NationalBackdrop />
        {children}
      </body>
    </html>
  );
}
