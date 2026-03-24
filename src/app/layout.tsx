import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "הודיה - חוויות קסומות לצוותים",
  description: "הופכת אירועי צוות לאגדות - חוויות בלתי נשכחות",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-['Heebo',sans-serif]">{children}</body>
    </html>
  );
}
