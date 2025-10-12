// packages
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

// styles
import "./globals.css";

// UI components
import HeaderWrapper from "@/components/HeaderWrapper";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumo",
  description: "Lorem ipsum dolor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeaderWrapper />
        {children}
      </body>
    </html>
  );
}
