import type { ReviewFocusId, StackOption } from './reviewTypes';
import { detectStackFromCode } from './detectStack';

export type ValidateParams = {
    code: string;
    stack: StackOption;
    focuses: ReviewFocusId[];
};

function validateSubmission(params: ValidateParams): string | null {
    const { code, stack, focuses } = params;

    if (!code.trim()) {
        return 'Cole algum código ou diff para revisar.';
    }

    if (focuses.length === 0) {
        return 'Selecione pelo menos um foco de revisão.';
    }

    const detected = detectStackFromCode(code);

    if (detected === 'flutter' && stack !== 'flutter') {
        return 'Parece que o código é Flutter/Dart. Ajuste a stack principal para "Flutter / Dart" antes de analisar.';
    }

    if (detected === 'react' && stack !== 'react') {
        return 'Parece que o código é React/TypeScript. Ajuste a stack principal para "React / TypeScript" antes de analisar.';
    }

    if (detected === 'other' && stack !== 'generic') {
        return 'Esse código não parece Flutter nem React. Use a opção "Genérico / Outra stack" para analisá-lo.';
    }

    return null;
}

export { validateSubmission };
export default validateSubmission;
