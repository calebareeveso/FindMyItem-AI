import "./globals.css";
import localFont from "next/font/local";
import { DM_Sans, Inter, EB_Garamond, DM_Mono } from "next/font/google";

const InterFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const Display = localFont({
  src: [
    {
      path: "./fonts/Johnston100W03-Light.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "./fonts/Johnston100W03-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Johnston100W03-Medium.ttf",
      weight: "500",
      style: "medium",
    },
  ],

  variable: "--font-display",
});

export const metadata = {
  title: "Found by AI",
  description: "Find your lost items with AI",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${Display.variable} ${InterFont.variable} antialiased min-h-screen `}
      >
        <main className="container mx-auto py-10">{children}</main>
      </body>
    </html>
  );
}

import "./globals.css";
