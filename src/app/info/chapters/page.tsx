import type { Metadata } from "next";
import { ChaptersClient } from "./chapters-client";

export const metadata: Metadata = {
  title: "Chapter Directory | Kappa Kappa Psi",
  description:
    "Explore all 343 chapters of Kappa Kappa Psi National Honorary Band Fraternity across the nation. Search by district, institution type, and status.",
  keywords: [
    "Kappa Kappa Psi",
    "KKPsi",
    "band fraternity",
    "chapters",
    "college bands",
    "honorary band fraternity",
  ],
  openGraph: {
    title: "Chapter Directory | Kappa Kappa Psi",
    description:
      "Explore all 343 chapters of Kappa Kappa Psi across the nation",
    type: "website",
  },
};

export default function ChaptersPage() {
  return <ChaptersClient />;
}
