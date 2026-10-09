import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/navbar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Sahyog (सहयोग) - Cooperative Gig Services Platform",
  description: "Connecting households with verified skilled workers from Labour Cooperative Societies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-text-primary antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <footer className="bg-white border-t border-border py-4 text-center text-xs text-text-secondary">
            <p>Sahyog (सहयोग) Cooperative Platform Prototype · Built for Labour Cooperative Federations</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
