// src/components/reviewForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
    REVIEW_FOCUS_OPTIONS,
    type ReviewFocusId,
    type StackOption,
} from '../review/reviewTypes';

type ReviewFormProps = {
    diffOrCode: string;
    stack: StackOption;
    focuses: ReviewFocusId[];
    context: string;
    loading: boolean;
    error: string | null;
    hasResult: boolean;
    onDiffChange: (value: string) => void;
    onStackChange: (stack: StackOption) => void;
    onToggleFocus: (id: ReviewFocusId) => void;
    onContextChange: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

function ReviewForm(props: ReviewFormProps) {
    const {
        diffOrCode,
        stack,
        focuses,
        context,
        loading,
        error,
        hasResult,
        onDiffChange,
        onStackChange,
        onToggleFocus,
        onContextChange,
        onSubmit,
    } = props;

    const [isStackOpen, setIsStackOpen] = useState(false);

    return (
        <section className="panel panel--input">
            <div className="panel__header">
                <span className="panel__step">Passo 1</span>
                <h2 className="panel__title">Cole o diff ou código</h2>
            </div>

            <form onSubmit={onSubmit} className="form">
                <label className="field">
                    <span className="field__label">Código ou diff do PR</span>
                    <textarea
                        value={diffOrCode}
                        onChange={(event) => onDiffChange(event.target.value)}
                        placeholder="Cole aqui o diff do PR ou o código que você quer revisar..."
                    />
                </label>

                <div className="form__controls">
                    <div className="field">
                        <span className="field__label">Stack principal</span>
                        <div
                            className={
                                'stack-select' + (isStackOpen ? ' stack-select--open' : '')
                            }
                        >
                            <select
                                value={stack}
                                onChange={(event) =>
                                    onStackChange(event.target.value as StackOption)
                                }
                                onClick={() => setIsStackOpen((previous) => !previous)}
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

                <div className="focus-grid">
                    <span className="field__label">Focos de revisão</span>
                    <div className="focus-grid__items">
                        {REVIEW_FOCUS_OPTIONS.map((option) => {
                            const checked = focuses.includes(option.id);

                            return (
                                <label
                                    key={option.id}
                                    className={
                                        'focus-pill' + (checked ? ' focus-pill--active' : '')
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => onToggleFocus(option.id)}
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

                <label className="field field--context">
                    <span className="field__label">Contexto do projeto (opcional)</span>
                    <textarea
                        className="field__context-textarea"
                        value={context}
                        onChange={(event) => onContextChange(event.target.value)}
                        placeholder="Ex: App de previdência com camadas data/domain/presentation; este PR altera a jornada de seleção de fundos..."
                    />
                </label>

                {error && <div className="feedback feedback--error">{error}</div>}
                {!error && !hasResult && (
                    <div className="feedback feedback--hint">
                        Dica: comece colando um trecho que você realmente revisaria em um PR
                        da sua squad.
                    </div>
                )}
            </form>
        </section>
    );
}

// 👇 aqui é o pulo do gato: export nomeado E default
export { ReviewForm };
export default ReviewForm;
