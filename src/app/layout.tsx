import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Opportunities Hub — Jobs, Scholarships & More",
  description: "Global Opportunities Hub (GH) is your gateway to premium international jobs, fully-funded scholarships, apprenticeships, and nanny placements worldwide.",
  keywords: "global jobs, scholarships, apprenticeships, nanny placements, international opportunities, study abroad, work abroad",
  openGraph: {
    title: "Global Opportunities Hub (GH)",
    description: "Discover elite international jobs, scholarships, apprenticeships, and nanny placements in one place.",
    type: "website",
  },
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
