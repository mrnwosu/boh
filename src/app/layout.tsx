import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Open_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";
import { Providers } from "~/components/providers";

export const metadata: Metadata = {
  title: "Kappa Kappa Psi Learning App",
  description: "Learn about Kappa Kappa Psi through flashcards, quizzes, and information pages",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${openSans.variable}`}>
      <body className="font-sans">
        <Providers>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
