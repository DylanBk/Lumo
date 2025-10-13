// packages
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/context/ThemeContext";
import { ContrastProvider } from "@/context/ContrastContext";
import { SessionProvider } from "@/context/SessionContext";

// styles
import "./globals.css";

// UI components
import { getSession } from "@/lib/session";
import Header from "@/components/Header";
import { SessionPayload } from "@/lib/definitions";


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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ContrastProvider>
            <SessionProvider value={session?.payload as SessionPayload}>
              <Header />
              {children}
            </SessionProvider>
          </ContrastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;