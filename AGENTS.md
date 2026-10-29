# Instruções para agentes de IA

Projeto base fictício ("Rota") usado para testar ferramentas de design e código. A descrição completa, as rotas e os cenários estão no [README.md](README.md).

## Comandos

- `npm run dev`: Servidor de desenvolvimento em `http://localhost:5173`.
- `npm run build`: Checagem de tipos e build. Precisa passar antes de concluir qualquer mudança.
- `npm test`: Testes com Vitest. Precisam passar antes de concluir qualquer mudança.
- `npm run lint`: Lint com oxlint, sem avisos.

## Convenções

- Interface, comentários e documentação em português brasileiro. Nomes de código (variáveis, componentes, arquivos) em inglês.
- Estilos em CSS Modules (`Componente.module.css` ao lado do `.tsx`). Use sempre as variáveis de `src/styles/tokens.css`, nunca cores ou espaçamentos soltos.
- Um componente por pasta em `src/components/`. Componentes de domínio ficam em `src/features/`.
- Hooks e contextos ficam em arquivos `.ts` separados dos providers `.tsx`, para não quebrar o fast refresh.
- Toda tela que carrega dados usa `useAsync` com o cenário atual nas dependências (`useScenario()`) e trata os estados de loading, erro e vazio.
- Não adicione dependências, fontes da web ou imagens remotas sem necessidade: o projeto precisa rodar offline e dentro de sandboxes.
- Não acesse `localStorage` ou `sessionStorage` diretamente. Use `src/lib/storage.ts`, que trata ambientes onde o storage é bloqueado.
- Os dados são fictícios e ficam em `src/api/data.ts`. Não coloque dados pessoais reais nem segredos no repositório.
