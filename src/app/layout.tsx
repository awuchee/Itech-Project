import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../contexts/AppContext";
import AppLayoutShell from "../components/AppLayoutShell";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-600/30 selection:text-white">
        <AppProvider>
          <AppLayoutShell>{children}</AppLayoutShell>
        </AppProvider>
      </body>
    </html>
  );
}
