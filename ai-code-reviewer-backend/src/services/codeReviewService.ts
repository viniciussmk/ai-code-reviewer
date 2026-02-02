import { openai } from '../infra/openaiClient';
import { ReviewRequest } from '../domain/reviewRequest';
import { ReviewResult } from '../domain/reviewResult';

function buildSystemPrompt(stack: ReviewRequest['stack']): string {
  const base = `
Você é um desenvolvedor sênior especializado em Clean Architecture e SOLID.
Você está fazendo code review em um pull request.
Sua resposta deve ser sempre objetiva, prática e aplicável.
`;

  const stackHints: Record<ReviewRequest['stack'], string> = {
    flutter: `
Stack principal: Flutter/Dart.
Considere boas práticas de:
- separação de camadas (data, domain, presentation)
- uso de bloc/cubit/controllers
- imutabilidade
- nomes claros de widgets e controllers.
`,
    react: `
Stack principal: React/TypeScript.
Considere boas práticas de:
- componentização
- hooks
- separação de responsabilidades
- legibilidade e coesão.
`,
    generic: `
Stack genérica. Considere boas práticas gerais de engenharia de software.
`,
  };

  return base + stackHints[stack];
}

type ReviewFocus = ReviewRequest['reviewFocuses'][number];

const focusDescriptions: Record<ReviewFocus, string> = {
  clean_architecture:
    'Clean Architecture (camadas, fronteiras bem definidas, dependências apontando para o domínio).',
  solid:
    'Princípios SOLID (SRP, OCP, LSP, ISP, DIP) aplicados à modelagem de classes, funções e módulos.',
  tests:
    'Testabilidade e cobertura de testes (unidade, widget/component, integração), facilidade de isolar dependências.',
  performance:
    'Performance e uso eficiente de recursos (renderizações desnecessárias, alocações, IO síncrono, coleções).',
  readability:
    'Legibilidade, clareza, nomes expressivos, padronização de estilo e organização de arquivos/pastas.',
  security:
    'Segurança e tratamento de dados sensíveis (validações, sanitização, erros, exposição de detalhes internos).',
};

export default class CodeReviewService {
  async review(request: ReviewRequest): Promise<ReviewResult> {
    const systemPrompt = buildSystemPrompt(request.stack);

    const focusText =
      request.reviewFocuses && request.reviewFocuses.length > 0
        ? request.reviewFocuses.map((f) => `- ${focusDescriptions[f]}`).join('\n')
        : '- Sem focos específicos informados. Faça uma revisão geral.';

    const contextText =
      request.context && request.context.trim().length > 0
        ? request.context.trim()
        : 'Não informado.';

    const userPrompt = `
Faça uma revisão de código do trecho abaixo (pode ser diff de PR ou código completo).

Stack principal: ${request.stack}
Focos de revisão selecionados:
${focusText}

Contexto adicional do projeto:
${contextText}

Considere prioritariamente os focos de revisão listados acima ao avaliar o código.
Quando apontar um problema ou sugestão, explique sempre o motivo e relacione com os padrões/boas práticas envolvidas.

Código/diff:
"""
${request.diffOrCode}
"""

Responda SEMPRE em JSON, no seguinte formato EXATO:

{
  "summary": "texto curto resumindo o PR / mudança",
  "positives": ["ponto positivo 1", "ponto positivo 2"],
  "risks": ["risco ou problema 1", "risco ou problema 2"],
  "suggestions": ["sugestão 1", "sugestão 2"],
  "refactorExample": "exemplo de refatoração em código (opcional, mas recomendado)"
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      throw new Error('Resposta vazia da IA ao tentar revisar o código.');
    }

    let parsed: ReviewResult;

    try {
      parsed = JSON.parse(raw) as ReviewResult;
    } catch (error) {
      console.error('Falha ao fazer parse do JSON retornado pela IA:');
      console.error(raw);
      throw error;
    }

    return parsed;
  }
}
