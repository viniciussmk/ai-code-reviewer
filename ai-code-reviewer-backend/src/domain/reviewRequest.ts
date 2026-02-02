export type ReviewStack = 'flutter' | 'react' | 'generic';

export type ReviewFocus =
  | 'clean_architecture'
  | 'solid'
  | 'tests'
  | 'performance'
  | 'readability'
  | 'security';

export type ReviewRequest = {
  diffOrCode: string;
  stack: ReviewStack;
  reviewFocuses: ReviewFocus[];
  context?: string | undefined;
};
