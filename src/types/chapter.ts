/**
 * Type definitions for KKPsi chapter data
 */

export interface Chapter {
  Number: string;
  Chapter: string;
  School: string;
  District: string;
  "Founding Date": string;
  "NCAA Conference": string;
  "Institution Type": "PWI" | "HBCU";
  Location: string;
  Active: "Active" | "Inactive";
}

export interface ChapterFilters {
  district?: string;
  institutionType?: "PWI" | "HBCU";
  ncaaConference?: string;
  activeOnly?: boolean;
  search?: string;
}
