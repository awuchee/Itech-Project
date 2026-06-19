import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Opportunities Hub",
  description: "Global Opportunities Hub is a professional platform where users can discover, study, save, and apply for elite international opportunities worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
