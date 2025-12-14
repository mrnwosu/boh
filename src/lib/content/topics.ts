/**
 * Topic definitions (client-safe)
 * This file contains no server-side imports and can be used in client components
 */

import { type TopicInfo } from "~/types";

export const TOPICS: TopicInfo[] = [
  {
    slug: "chapters",
    title: "Chapters",
    description: "Learn about KKPsi's 343 chapters across the United States",
    fileName: "chapters_trivia.json",
    totalQuestions: 50,
  },
  {
    slug: "founding_fathers",
    title: "Founding Fathers",
    description: "Explore the lives of the 10 founding fathers of Kappa Kappa Psi",
    fileName: "founding_fathers_trivia.json",
    totalQuestions: 75,
  },
  {
    slug: "awards_and_jewelry",
    title: "Awards & Jewelry",
    description: "Discover KKPsi awards and official jewelry",
    fileName: "awards_and_jewelry_trivia.json",
    totalQuestions: 50,
  },
  {
    slug: "bohumil_makovsky",
    title: "Bohumil Makovsky",
    description: "Learn about this notable KKPsi member",
    fileName: "bohumil_makovsky_trivia.json",
    totalQuestions: 25,
  },
  {
    slug: "districts",
    title: "Districts",
    description: "Understand KKPsi's district-level organization",
    fileName: "districts_trivia.json",
    totalQuestions: 30,
  },
  {
    slug: "hbcu_chapters",
    title: "HBCU Chapters",
    description: "Focus on chapters at Historically Black Colleges & Universities",
    fileName: "hbcu_chapters_trivia.json",
    totalQuestions: 40,
  },
  {
    slug: "nib",
    title: "National Intercollegiate Band",
    description: "KKPsi's most prestigious service project since 1947",
    fileName: "nib_trivia.json",
    totalQuestions: 50,
  },
];
