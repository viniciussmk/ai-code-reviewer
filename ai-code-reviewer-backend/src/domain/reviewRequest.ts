export const REVIEW_STACKS = ['flutter', 'react', 'generic'] as const;
export type ReviewStack = (typeof REVIEW_STACKS)[number];

export const REVIEW_FOCUSES = [
  'clean_architecture',
  'solid',
  'tests',
  'performance',
  'readability',
  'security',
] as const;
export type ReviewFocus = (typeof REVIEW_FOCUSES)[number];

export type ReviewRequest = {
  diffOrCode: string;
  stack: ReviewStack;
  reviewFocuses: ReviewFocus[];
  context?: string | undefined;
};
