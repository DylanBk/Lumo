// packages
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSession } from "@/lib/session";
import { SessionPayload } from "@/lib/definitions";

import { ContrastProvider } from "@/context/ContrastContext";
import { SessionProvider } from "@/context/SessionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";

// styles
import "./globals.css";

// UI components
import Header from "@/components/Header";
import Toast from "@/components/Toast";


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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContrastProvider>
          <SessionProvider value={session?.payload as SessionPayload}>
            <ToastProvider>
              <ThemeProvider>
                    <Header />
                    <Toast />
                    {children}
              </ThemeProvider>
            </ToastProvider>
          </SessionProvider>
        </ContrastProvider>
      </body>
    </html>
  );
};

export default RootLayout;