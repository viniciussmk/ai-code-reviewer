export type ReviewResult = {
  summary: string;
  positives: string[];
  risks: string[];
  suggestions: string[];
  refactorExample?: string;
};
