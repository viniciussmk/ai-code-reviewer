import { useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

type StackOption = 'flutter' | 'react' | 'generic';

type ReviewResult = {
  summary: string;
  positives: string[];
  risks: string[];
  suggestions: string[];
  refactorExample?: string;
};

type DetectedStack = 'flutter' | 'react' | 'other';

type ReviewFocusId =
  | 'clean_architecture'
  | 'solid'
  | 'tests'
  | 'performance'
  | 'readability'
  | 'security';

type ReviewFocusOption = {
  id: ReviewFocusId;
  label: string;
  description: string;
};

const REVIEW_FOCUS_OPTIONS: ReviewFocusOption[] = [
  {
    id: 'clean_architecture',
    label: 'Clean Architecture',
    description: 'Camadas bem definidas, dependências e fronteiras claras.',
  },
  {
    id: 'solid',
    label: 'SOLID',
    description: 'Responsabilidades únicas, baixo acoplamento e alta coesão.',
  },
  {
    id: 'tests',
    label: 'Testes',
    description: 'Testabilidade, cobertura e facilidade de escrever testes.',
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Uso eficiente de memória, CPU e IO.',
  },
  {
    id: 'readability',
    label: 'Legibilidade',
    description: 'Nomes claros, padrão de código e organização.',
  },
  {
    id: 'security',
    label: 'Segurança',
    description: 'Tratamento seguro de dados e validações.',
  },
];

function detectStackFromCode(code: string): DetectedStack {
  const lower = code.toLowerCase();

  // Heurísticas bem simples pra Flutter / Dart
  if (
    code.includes('extends StatelessWidget') ||
    code.includes('extends StatefulWidget') ||
    lower.includes('widget build(') ||
    lower.includes('scaffold(') ||
    lower.includes('materialapp')
  ) {
    return 'flutter';
  }

  // Heurísticas simples pra React / TSX
  if (
    lower.includes('import react') ||
    lower.includes('from "react"') ||
    lower.includes("from 'react'") ||
    lower.includes('usestate(') ||
    lower.includes('useeffect(') ||
    /<\w+[^>]*>[\s\S]*<\/\w+>/.test(code) // JSX básico
  ) {
    return 'react';
  }

  // Se não bate Flutter nem React, consideramos "other"
  return 'other';
}

function App() {
  const [diffOrCode, setDiffOrCode] = useState('');
  const [stack, setStack] = useState<StackOption>('flutter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [isStackOpen, setIsStackOpen] = useState(false);

  const [reviewFocuses, setReviewFocuses] = useState<ReviewFocusId[]>([
    'clean_architecture',
    'solid',
    'tests',
    'performance',
    'readability',
    'security',
  ]);

  const [context, setContext] = useState('');

  const hasResult = !!result;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!diffOrCode.trim()) {
      setError('Cole algum código ou diff para revisar.');
      return;
    }

    if (reviewFocuses.length === 0) {
      setError('Selecione pelo menos um foco de revisão.');
      return;
    }

    // 🔍 Validação de stack x código colado
    const detected = detectStackFromCode(diffOrCode);

    if (detected === 'flutter' && stack !== 'flutter') {
      setError(
        'Parece que o código é Flutter/Dart. Ajuste a stack principal para "Flutter / Dart" antes de analisar.',
      );
      return;
    }

    if (detected === 'react' && stack !== 'react') {
      setError(
        'Parece que o código é React/TypeScript. Ajuste a stack principal para "React / TypeScript" antes de analisar.',
      );
      return;
    }

    if (detected === 'other' && stack !== 'generic') {
      setError(
        'Esse código não parece Flutter nem React. Use a opção "Genérico / Outra stack" para analisá-lo.',
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diffOrCode, stack, reviewFocuses, context }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.error ||
          data?.details ||
          'Erro ao revisar o código. Tente novamente em alguns instantes.';
        throw new Error(message);
      }

      setResult(data as ReviewResult);
    } catch (err: any) {
      setError(err?.message ?? 'Erro inesperado ao revisar o código.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="shell-header">
        <div className="shell-header__inner">
          <span className="shell-header__badge">
            IA • Code Review • Clean Architecture
          </span>
          <h1 className="shell-header__title">AI Code Reviewer</h1>
          <p className="shell-header__subtitle">
            Cole o diff do PR ou o código e deixe a IA encontrar pontos fortes, riscos e
            oportunidades de refatoração.
          </p>
        </div>
      </header>

      <main className="shell-main">
        <div
          className={
            'shell-main__inner' + (hasResult ? ' shell-main__inner--has-result' : '')
          }
        >
          <section className="panel panel--input">
            <div className="panel__header">
              <span className="panel__step">Passo 1</span>
              <h2 className="panel__title">Cole o diff ou código</h2>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <label className="field">
                <span className="field__label">Código ou diff do PR</span>
                <textarea
                  value={diffOrCode}
                  onChange={(e) => setDiffOrCode(e.target.value)}
                  placeholder="Cole aqui o diff do PR ou o código que você quer revisar..."
                />
              </label>

              <div className="form__controls">
                <div className="field">
                  <span className="field__label">Stack principal</span>
                  <div
                    className={`stack-select${isStackOpen ? ' stack-select--open' : ''
                      }`}
                  >
                    <select
                      value={stack}
                      onChange={(e) => setStack(e.target.value as StackOption)}
                      onClick={() => setIsStackOpen((prev) => !prev)}
                      onBlur={() => setIsStackOpen(false)}
                    >
                      <option value="flutter">Flutter / Dart</option>
                      <option value="react">React / TypeScript</option>
                      <option value="generic">Genérico / Outra stack</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? 'Analisando código...' : 'Analisar PR com IA'}
                </button>
              </div>

              {/* Focos de revisão */}
              <div className="focus-grid">
                <span className="field__label">Focos de revisão</span>
                <div className="focus-grid__items">
                  {REVIEW_FOCUS_OPTIONS.map((option) => {
                    const checked = reviewFocuses.includes(option.id);

                    return (
                      <label
                        key={option.id}
                        className={`focus-pill${checked ? ' focus-pill--active' : ''
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setReviewFocuses((current) =>
                              current.includes(option.id)
                                ? current.filter((id) => id !== option.id)
                                : [...current, option.id],
                            );
                          }}
                        />
                        <div className="focus-pill__content">
                          <span className="focus-pill__label">{option.label}</span>
                          <span className="focus-pill__description">
                            {option.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Contexto do projeto */}
              <label className="field field--context">
                <span className="field__label">Contexto do projeto (opcional)</span>
                <textarea
                  className="field__context-textarea"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Ex: App de previdência com camadas data/domain/presentation; este PR altera a jornada de seleção de fundos..."
                />
              </label>

              {error && <div className="feedback feedback--error">{error}</div>}
              {!error && !hasResult && (
                <div className="feedback feedback--hint">
                  Dica: comece colando um trecho que você realmente revisaria em um PR da
                  sua squad.
                </div>
              )}
            </form>
          </section>

          <section
            className={
              'panel panel--output' + (hasResult ? ' panel--output--active' : '')
            }
          >
            <div className="panel__header">
              <span className="panel__step">Passo 2</span>
              <h2 className="panel__title">Resultado da análise</h2>
            </div>

            {!hasResult && (
              <div className="output-placeholder">
                <p>
                  Rode a análise no painel ao lado para ver aqui o resumo, os pontos
                  positivos, riscos e sugestões de melhoria do seu PR.
                </p>
              </div>
            )}

            {hasResult && result && (
              <div className="output">
                <div className="output__section">
                  <h3>Resumo</h3>
                  <p>{result.summary}</p>
                </div>

                <div className="output__grid">
                  <div className="output__section">
                    <h3>Pontos positivos</h3>
                    <ul>
                      {result.positives.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="output__section">
                    <h3>Riscos / Problemas</h3>
                    <ul>
                      {result.risks.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="output__section">
                  <h3>Sugestões de melhoria</h3>
                  <ul>
                    {result.suggestions.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {result.refactorExample && (
                  <div className="output__section">
                    <h3>Exemplo de refatoração</h3>
                    <pre className="output__code">
                      <code>{result.refactorExample}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="shell-footer">
        <div className="shell-footer__inner">
          <span>Construído como side project com React + TypeScript + OpenAI.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
