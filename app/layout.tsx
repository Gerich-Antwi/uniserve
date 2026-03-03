import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";

import "./styles.css";
import { Toaster } from "@/components/ui/sonner"
import BetterAuthUIProvider from "@/providers/better-auth-ui-provider"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CampusServices — Campus Life Simplified",
  description: "Everything you need on campus — laundry, food, tech fixes — all in one place. No BS, just services that work.",
};

// Forced HMR update for CSS changes
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <BetterAuthUIProvider>
          {children}
        </BetterAuthUIProvider>
        <Toaster />
      </body>
    </html>

  );
}
