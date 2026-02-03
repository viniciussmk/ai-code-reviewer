export type StackOption = 'flutter' | 'react' | 'generic';

export type DetectedStack = 'flutter' | 'react' | 'other';

export type ReviewFocusId =
    | 'clean_architecture'
    | 'solid'
    | 'tests'
    | 'performance'
    | 'readability'
    | 'security';

export type ReviewPayload = {
    diffOrCode: string;
    stack: StackOption;
    reviewFocuses: ReviewFocusId[];
    context?: string;
};

export type ReviewResult = {
    summary: string;
    positives: string[];
    risks: string[];
    suggestions: string[];
    refactorExample?: string;
};

export type ReviewFocusOption = {
    id: ReviewFocusId;
    label: string;
    description: string;
};

export const REVIEW_FOCUS_OPTIONS: ReviewFocusOption[] = [
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

export const DEFAULT_REVIEW_FOCUSES: ReviewFocusId[] = REVIEW_FOCUS_OPTIONS.map(
    (option) => option.id,
);
