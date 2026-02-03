import type { ReviewResult } from '../review/reviewTypes';

type ReviewOutputProps = {
    result: ReviewResult | null;
};

export function ReviewOutput({ result }: ReviewOutputProps) {
    if (!result) {
        return (
            <section className="panel panel--output">
                <div className="panel__header">
                    <span className="panel__step">Passo 2</span>
                    <h2 className="panel__title">Resultado da análise</h2>
                </div>

                <div className="output-placeholder">
                    <p>
                        Rode a análise no painel ao lado para ver aqui o resumo, os pontos
                        positivos, riscos e sugestões de melhoria do seu PR.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="panel panel--output panel--output--active">
            <div className="panel__header">
                <span className="panel__step">Passo 2</span>
                <h2 className="panel__title">Resultado da análise</h2>
            </div>

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
        </section>
    );
}
