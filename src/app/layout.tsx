import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bike Hero — CO₂ Tracker",
  description: "Track your biking CO₂ savings and earn rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
