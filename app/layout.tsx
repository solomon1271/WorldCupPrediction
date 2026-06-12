import type { Metadata } from "next";
import { NationalBackdrop } from "@/components/NationalBackdrop";
import "./globals.css";

export const metadata: Metadata = {
  title: "Champion's Path",
  description: "Private World Cup prediction league."
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
