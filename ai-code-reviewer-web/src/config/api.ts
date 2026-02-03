import type { ReviewPayload, ReviewResult } from '../review/reviewTypes';

export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export async function reviewCode(
    payload: ReviewPayload,
): Promise<ReviewResult> {
    const response = await fetch(`${API_BASE_URL}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            data?.error ||
            data?.details ||
            'Erro ao revisar o código. Tente novamente em alguns instantes.';
        throw new Error(message);
    }

    return data as ReviewResult;
}
