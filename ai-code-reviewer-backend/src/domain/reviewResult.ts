export interface ReviewResult {
  summary: string;
  positives: string[];
  risks: string[];
  suggestions: string[];
  refactorExample?: string;
}
