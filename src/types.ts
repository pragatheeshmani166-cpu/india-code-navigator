export interface StateAmendment {
  id: string;
  stateName: string;
  text: string;
  details: string;
  year?: number;
}

export interface Section {
  id: string;
  actId: string;
  number: string;
  title: string;
  text: string;
  keywords: string[];
  crossReferences: string[]; // List of other section IDs (e.g., "bns-103", "bnss-173")
  oldSectionMapping?: string; // e.g., "IPC Section 302" or "CrPC Section 154"
  stateAmendments?: StateAmendment[];
}

export interface Chapter {
  id: string;
  title: string;
  number: string;
  sections: Section[];
}

export interface Act {
  id: string;
  title: string;
  shortTitle: string;
  year: number;
  type: 'central' | 'state';
  category: 'Constitutional' | 'Criminal' | 'Civil' | 'Corporate' | 'Technology';
  description: string;
  chapters: Chapter[];
}

export interface Bookmark {
  actId: string;
  sectionId: string;
  actTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  bookmarkedAt: string;
  notes?: string;
}

export interface ResearchMemo {
  id: string;
  query: string;
  summary: string;
  memo: string; // Markdown format synthesized by AI
  citedSections: {
    actId: string;
    sectionId: string;
    sectionNumber: string;
    actTitle: string;
    sectionTitle: string;
  }[];
  createdAt: string;
}
