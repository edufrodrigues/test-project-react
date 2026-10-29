# Rota

App fictício de reserva de experiências de viagem pelo Brasil, feito em React. Serve como projeto base para testar ferramentas de design e código (importação de repositório, Code Layers do Figma, agentes de IA, cursos etc.).

Todos os dados são falsos e ficam no próprio navegador. Não há backend, chamadas externas, fontes da web ou imagens remotas: o projeto roda offline.

## Como rodar

Requer Node 22 ou superior (testado com Node 24).

```bash
npm install
```

```bash
npm run dev
```

O app abre em `http://localhost:5173`.

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm test` | Roda os testes uma vez (Vitest + Testing Library) |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run lint` | Lint com oxlint |

## Telas e rotas

| Tela | Rota | Estados disponíveis |
|---|---|---|
| Explorar | `/` | Loading (skeleton), erro com "tentar de novo", vazio, sem resultados na busca, sucesso |
| Detalhe da experiência | `/experiencias/:id` | Loading, não encontrada, erro, sucesso |
| Reserva (formulário) | `/experiencias/:id/reservar` | Validação por campo, enviando, erro no envio, sucesso |
| Confirmação | `/reserva/:codigo/confirmada` | Loading, não encontrada, sucesso |
| Minhas reservas | `/reservas` | Abas (próximas, passadas, canceladas), vazio por aba, modal de cancelamento, toast |
| Perfil | `/perfil` | Formulário com salvar, troca de tema, preferências com switches |
| Página não encontrada | qualquer outra | 404 |

Fluxo principal: Explorar → Detalhe → Reserva → Confirmação → Minhas reservas.

Os filtros da tela Explorar ficam na URL (`?q=paraty&categoria=natureza&ordem=menor-preco`), assim como a aba de reservas (`?aba=passadas`). Dá para abrir qualquer estado direto por link.

## Simulador de cenários

A API falsa ([src/api/client.ts](src/api/client.ts)) responde de acordo com o cenário ativo. Troque pelo botão flutuante "Cenário" no canto inferior direito ou pela URL:

| URL | Comportamento |
|---|---|
| `?cenario=normal` | Dados de exemplo com atraso de cerca de 0,8 s |
| `?cenario=lento` | Atraso de 4 s, para observar os loadings |
| `?cenario=erro` | Todas as chamadas falham |
| `?cenario=vazio` | Listas vazias e detalhes "não encontrados" |
| `?cenario=erro-envio` | As telas carregam, mas reservar, cancelar e salvar o perfil falham |

Exemplos:

- `http://localhost:5173/?cenario=lento` mostra o skeleton da lista por 4 segundos.
- `http://localhost:5173/reservas?cenario=vazio` mostra o estado vazio das reservas.
- `http://localhost:5173/experiencias/trilha-pai-inacio/reservar?cenario=erro-envio` permite ver o erro ao confirmar a reserva.

O cenário escolhido vale para a aba atual do navegador (fica no `sessionStorage`). Reservas e perfil ficam no `localStorage`. Para voltar ao estado inicial, use "Restaurar dados de exemplo" no painel de cenários.

## Estrutura

```
src/
  api/              API falsa: tipos, dados de exemplo e cliente com cenários
  app/              Rotas e providers globais
  components/       Design system (um componente por pasta, com CSS Module)
    layout/         Cabeçalho, rodapé e painel de cenários
  features/         Componentes de domínio (cards de experiência, validação da reserva)
  hooks/            useAsync (estados loading, erro e sucesso)
  lib/              Utilitários: datas, formatação, tema, cenário, storage
  pages/            Uma página por rota, com seus testes
  styles/           tokens.css (design tokens) e global.css
  test/             Setup do Vitest e helper renderApp
```

## Design system

Os tokens ficam em [src/styles/tokens.css](src/styles/tokens.css) como variáveis CSS: cores (base, marca e feedback), tipografia, espaçamento em escala de 4 px, raios, sombras e movimento. O tema escuro sobrescreve só as cores, via `[data-theme='dark']`. A preferência (claro, escuro ou sistema) fica na tela de Perfil.

Componentes disponíveis em `src/components/`:

- `Button` e `ButtonLink`: variantes `primary`, `secondary`, `ghost` e `danger`, tamanhos `sm`, `md` e `lg`, ícones e estado `loading`.
- `Input`, `Select` e `Textarea`: com `label`, `hint`, `error` e `required`.
- `Checkbox` e `Switch`.
- `Badge`: tons `neutral`, `primary`, `success`, `warning`, `danger` e `info`.
- `Alert`: tons `info`, `success`, `warning` e `danger`.
- `Card`, `Avatar`, `Rating`, `Breadcrumb` e `Tabs`.
- `Skeleton`, `EmptyState` e `ErrorState`.
- `Modal` e `Toast` (via `ToastProvider` e `useToast`).

As ilustrações das experiências são SVGs gerados em código ([ExperienceArt.tsx](src/features/experiences/ExperienceArt.tsx)) a partir de uma paleta por experiência.

## Stack

- React 19 e TypeScript 7 (versão instalada pelo template oficial do Vite)
- Vite 8
- React Router 8, no modo biblioteca (`createBrowserRouter`)
- CSS Modules com variáveis CSS, sem framework de CSS
- lucide-react para ícones
- Vitest 5, Testing Library e jsdom para testes
- oxlint para lint

## Duplicar para testes

Para criar cópias de teste, copie a pasta sem `node_modules` e `dist` e rode `npm install` na cópia. Copiar `node_modules` no Windows é lento e pode quebrar links internos dos pacotes.

No PowerShell:

```powershell
robocopy "C:\Projects\design-ops\test-project-react" "C:\Projects\design-ops\test-project-react-teste-1" /E /XD node_modules dist
```

```powershell
cd "C:\Projects\design-ops\test-project-react-teste-1"; npm install
```

O `robocopy` retorna código 1 quando copia arquivos com sucesso. Isso é normal.

A pasta `.git` vem junto na cópia, então cada teste começa do mesmo commit inicial. Para ver o que uma ferramenta alterou, rode `git status` ou `git diff` na cópia.

## Roteamento com hash

Algumas ferramentas servem o app dentro de um iframe ou em uma subpasta, e aí as rotas normais (`/reservas`) podem não funcionar. Nesse caso, crie um arquivo `.env.local` na raiz com:

```
VITE_ROUTER=hash
```

As rotas passam a usar `#` (`/#/reservas`). Apague o arquivo para voltar ao modo normal.

## Observações

- A pasta `.claude/launch.json` configura o servidor de desenvolvimento para o preview do Claude Code. Outras ferramentas ignoram esse arquivo.
- As datas disponíveis e as reservas de exemplo são calculadas a partir do dia atual, então o app nunca mostra só datas vencidas.
