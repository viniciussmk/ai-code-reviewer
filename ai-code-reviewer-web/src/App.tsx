import { useState } from 'react';
import type { FormEvent } from 'react';
import './app.css';

import { ShellHeader } from './components/shellHeader';
import { ShellFooter } from './components/shellFooter';
import { ReviewForm } from './components/reviewForm';
import { ReviewOutput } from './components/reviewOutput';

import {
  DEFAULT_REVIEW_FOCUSES,
  type ReviewFocusId,
  type ReviewResult,
  type StackOption,
} from './review/reviewTypes';
import { validateSubmission } from './review/reviewValidation';
import { reviewCode } from './config/api';


function App() {
  const [diffOrCode, setDiffOrCode] = useState('');
  const [stack, setStack] = useState<StackOption>('flutter');
  const [reviewFocuses, setReviewFocuses] =
    useState<ReviewFocusId[]>(DEFAULT_REVIEW_FOCUSES);
  const [context, setContext] = useState('');
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hasResult = Boolean(result);

  function handleToggleFocus(id: ReviewFocusId) {
    setReviewFocuses((current) =>
      current.includes(id)
        ? current.filter((focusId) => focusId !== id)
        : [...current, id],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationError = validateSubmission({
      code: diffOrCode,
      stack,
      focuses: reviewFocuses,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        diffOrCode,
        stack,
        reviewFocuses,
        context,
      };

      const data = await reviewCode(payload);
      setResult(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Erro inesperado ao revisar o código.';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="page">
      <ShellHeader />

      <main className="shell-main">
        <div
          className={
            'shell-main__inner' + (hasResult ? ' shell-main__inner--has-result' : '')
          }
        >
          <ReviewForm
            diffOrCode={diffOrCode}
            stack={stack}
            focuses={reviewFocuses}
            context={context}
            loading={loading}
            error={error}
            hasResult={hasResult}
            onDiffChange={setDiffOrCode}
            onStackChange={setStack}
            onToggleFocus={handleToggleFocus}
            onContextChange={setContext}
            onSubmit={handleSubmit}
          />

          <ReviewOutput result={result} />
        </div>
      </main>

      <ShellFooter />
    </div>
  );
}

export default App;
