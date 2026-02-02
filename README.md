# AI Code Reviewer 🤖

Agente de IA para revisar PRs com foco em Clean Architecture, SOLID e boas práticas de engenharia.

> Side project criado para estudar automação de code review com IA, arquitetura limpa e boas práticas de front e back. Ideal para portfólio e para gerar conteúdo técnico no LinkedIn.

---

## 🔧 Tech stack

- **Front-end:** React + TypeScript + Vite  
- **Back-end:** Node.js + Express + TypeScript  
- **IA:** OpenAI (modelo `gpt-4.1-mini`)  
- **Validação:** Zod

---

## 🌟 O que ele faz

- Analisa **diffs de PR** ou **trechos de código**.
- Entende a **stack principal** informada:
  - Flutter / Dart
  - React / TypeScript
  - Genérico / outra stack
- Permite selecionar **focos da revisão**, como:
  - Clean Architecture
  - SOLID
  - Testes
  - Performance
  - Legibilidade
  - Segurança
- Possui campo de **“Contexto do projeto”**, para o review respeitar a arquitetura real (evitando críticas injustas por falta de contexto).
- Faz validação básica entre **código colado x stack escolhida** (ex: se parecer Flutter mas a stack for React, ele te avisa antes de chamar a IA).

---

## 🧱 Estrutura do projeto

```txt
ai-code-reviewer/
  ai-code-reviewer-web/      # Front-end React + TS (Vite)
  ai-code-reviewer-backend/  # Back-end Node + TS (Express + OpenAI)



🚀 Como rodar localmente
✅ Pré-requisitos

Node.js (versão 18+ recomendada)

npm (ou pnpm/yarn, se preferir)

Uma conta na OpenAI com créditos de API


1️⃣ Backend (API)

Dentro da pasta raiz do projeto:

cd ai-code-reviewer-backend
npm install

🔐 Configurar o .env

Na pasta ai-code-reviewer-backend, crie um arquivo .env baseado no exemplo abaixo:

Crie o arquivo:

cd ai-code-reviewer-backend
cp .env.example .env    # se o arquivo .env.example existir
# ou crie manualmente se preferir


Conteúdo sugerido do .env:

# Chave da API da OpenAI
# Crie uma em: https://platform.openai.com/
OPENAI_API_KEY=COLOQUE_SUA_CHAVE_AQUI

# Porta onde o servidor Express vai rodar
PORT=3001


⚠️ Importante:

Nunca commitar o arquivo .env (já há um .gitignore ignorando esse arquivo).

Use sempre um valor fictício (ex: COLOQUE_SUA_CHAVE_AQUI) em .env.example se for versionar um exemplo.

▶️ Rodar o servidor
cd ai-code-reviewer-backend
npm run dev


Se tudo estiver certo, você verá algo como:

Iniciando app.ts...
🚀 Server running on port 3001


Testar a rota de saúde:

GET http://localhost:3001/health
Resposta esperada:

{ "status": "ok" }

2️⃣ Frontend (Web)

Em outro terminal:

cd ai-code-reviewer-web
npm install
npm run dev


O Vite sobe em:

http://localhost:5173/

Abra esse endereço no navegador e você verá a interface do AI Code Reviewer.

📡 API – Endpoints principais
GET /health

Descrição: Verifica se o servidor está de pé.

Exemplo:

curl http://localhost:3001/health


Resposta:

{ "status": "ok" }

POST /review

Descrição: Envia o código/diff + configurações para a IA fazer o code review.

URL: http://localhost:3001/review

Método: POST

Body (JSON):

{
  "diffOrCode": "class Example extends StatelessWidget { ... }",
  "stack": "flutter",
  "reviewFocuses": [
    "clean_architecture",
    "solid",
    "tests",
    "performance",
    "readability",
    "security"
  ],
  "context": "Projeto Flutter com Clean Architecture. Este trecho é só da camada presentation; regras de negócio ficam em usecases/controllers."
}


Campos:

diffOrCode (string, obrigatório) – código ou diff do PR.

stack (string, obrigatório) – uma das opções:

"flutter"

"react"

"generic"

reviewFocuses (array, obrigatório) – lista de focos de revisão. Valores possíveis:

"clean_architecture"

"solid"

"tests"

"performance"

"readability"

"security"

context (string, opcional) – contexto do projeto / arquitetura / regras importantes.

Resposta (JSON):

{
  "summary": "Resumo curto da mudança.",
  "positives": ["Ponto positivo 1", "Ponto positivo 2"],
  "risks": ["Risco ou problema 1", "Risco ou problema 2"],
  "suggestions": ["Sugestão 1", "Sugestão 2"],
  "refactorExample": "Exemplo de refatoração em código (string)."
}

🧠 Como usar o campo “Contexto do projeto (opcional)”

Esse campo é essencial para o code review ser justo e alinhado com a sua arquitetura.
Ele ajuda a evitar críticas do tipo:

“Falta validação aqui” → quando na verdade a validação fica num usecase.

“Regra de negócio na UI” → quando o projeto define que a tela só dispara eventos para o controller/usecase.

“Cadê o repository?” → sendo que você está mostrando só o widget/page.

Use o contexto para:

Descrever a arquitetura do projeto.

Explicar o papel do arquivo/trecho colado.

Orientar o que você espera que a IA foque.

💡 Exemplos de contexto bem usados
Exemplo 1 – Flutter com Clean Architecture
Projeto Flutter com Clean Architecture:

- lib/presentation: apenas UI (Widgets, Pages)
- lib/controllers: orquestram lógica e chamam usecases
- lib/domain: entidades e casos de uso
- lib/data: repositórios e datasources

O trecho colado aqui é SÓ da camada presentation.
Regra de negócio, validação e chamadas de API já estão em usecases/controllers.

Quero foco em:
- legibilidade
- divisão de responsabilidades na UI
- se o widget está muito "gordo"
- oportunidades de extração de componentes
- aderência à arquitetura proposta.

Exemplo 2 – React + API externa
Monorepo com front em React e back em Node.

- Toda validação de negócio e segurança roda no backend.
- Este componente React renderiza apenas UI e dispara ações para o back.

Não sugira mover regra de negócio para o front.
Foque em:
- legibilidade do JSX
- uso adequado de hooks
- separação de responsabilidades entre componentes
- acessibilidade e organização.


Quanto mais claro o contexto, mais cirúrgico e coerente será o code review.

🎛 Filtros e focos de revisão

Na interface web, você pode marcar/desmarcar focos de revisão, como:

✅ Clean Architecture

✅ SOLID

✅ Testes

✅ Performance

✅ Legibilidade

✅ Segurança

Esses focos são enviados para o backend e incorporados diretamente no prompt da IA, orientando a revisão para:

olhar para arquitetura em camadas;

avaliar responsabilidades e coesão;

destacar riscos de performance;

apontar legibilidade e nomeclatura;

sugerir melhorias de testabilidade.

Por padrão, todos os focos vêm selecionados para um review mais completo.

🧭 Validação de stack x código

O front faz uma checagem simples do código colado para tentar inferir:

se parece mais Flutter/Dart,

se parece mais React/TypeScript,

ou se se encaixa melhor como Genérico / outra stack.

Se houver conflito entre:

código detectado como Flutter e stack selecionada React (ou vice-versa),

ou código que não parece Flutter/React mas stack diferente de Genérico,

a aplicação mostra um aviso e pede para você ajustar a stack antes de chamar a IA.

🗺️ Ideias futuras (roadmap)

Algumas evoluções naturais desse projeto:

🔗 Integrar com GitHub:

puxar código direto de arquivos/pastas do repositório;

analisar múltiplos arquivos para entender melhor o fluxo.

📁 Suporte a “modos”:

Review de PR inteiro em vez de apenas snippet.

📚 Integração com documentação oficial:

Flutter/Dart, React, etc. para sugerir melhorias citando práticas recomendadas.

📄 Licença

Sinta-se livre para estudar, adaptar e evoluir este projeto.
Se for usar em produção, revise custos de uso da OpenAI e ajuste a arquitetura conforme sua necessidade.
