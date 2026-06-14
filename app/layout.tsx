import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // Update this to your real domain after deploy (used to make OG image URLs absolute).
  metadataBase: new URL("https://pradumnabajoria.vercel.app/"),
  title: "Pradumna Bajoria — Frontend Engineer",
  description:
    "Frontend engineer (React, TypeScript) leading a platform migration used by 5,000+ users. Open to remote roles. Climb the mountain to higher ground.",
  openGraph: {
    title: "Pradumna Bajoria — Frontend Engineer",
    description: "React · TypeScript · micro-frontends. Climbing toward higher ground.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${grotesk.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
