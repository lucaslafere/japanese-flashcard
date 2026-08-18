# KanjiCards 漢字

PWA mobile para aprender japonês com flashcards, conjuntos por dificuldade e suporte offline.

## Funcionalidades

- **Modo Desafio**: card grande com kanji, flip para romaji e tradução
- **Modo Dicionário**: grid scrollável com busca e cards que giram ao toque
- **Conjuntos A, B e C** por nível de dificuldade
- **Tema claro/escuro** com preferência salva localmente
- **PWA instalável** no iPhone pelo Safari
- **PWA offline** após a primeira visita online

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/japanese-flashcard/`.

Para testar o comportamento de produção e do service worker localmente:

```bash
npm run build
npm run preview
```

## Build

O build também pode ser validado com:

```bash
npm run lint
```

## Deploy no GitHub Pages

1. Crie um repositório no GitHub chamado `japanese-flashcard`
2. Envie este projeto para a branch `main`
3. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**
4. Faça push na `main`; o workflow `.github/workflows/deploy.yml` faz build e publica automaticamente
5. URL final: `https://<seu-usuario>.github.io/japanese-flashcard/`

Se o repositório tiver outro nome, altere `base` em `vite.config.ts` para `/<nome-do-repo>/`.

## Usar no iPhone

1. Abra a URL publicada no **Safari**. HTTPS é obrigatório para o service worker
2. Toque em **Compartilhar** (ícone de quadrado com seta)
3. Escolha **Adicionar à Tela de Início**
4. Abra pelo ícone na tela inicial

O app está preparado para uso como PWA no iPhone. Depois de abrir a aplicação online pelo menos uma vez, o service worker salva localmente os arquivos do app e o conteúdo dos conjuntos de kanji. Assim, a navegação e os cards continuam disponíveis sem conexão.

O que é salvo localmente:

- Arquivos compilados do app e assets necessários ao funcionamento offline
- Dados dos conjuntos de kanji, que fazem parte do próprio app
- Preferência de tema claro/escuro em `localStorage`

O que ainda não é salvo:

- Progresso de estudo, cards aprendidos ou histórico
- Áudios de pronúncia, que ainda não estão implementados

Na primeira abertura, é necessário estar online para baixar o app. Depois de uma nova versão ser publicada, abra o app novamente com conexão para permitir que o service worker atualize o cache.

## Editar os kanjis

Edite [`src/data/kanjiSets.ts`](src/data/kanjiSets.ts). Cada conjunto tem `kanji`, `romaji` e `translation`. O campo `audio` está reservado para a fase 2.

## Estrutura

```
src/
├── components/   # FlashCard, KanjiGrid, Layout, ThemeToggle
├── data/         # kanjiSets.ts
├── hooks/        # useTheme
├── pages/        # Home, SetSelect, Challenge, Dictionary
└── styles/       # global.css
```

## Próximos passos (fase 2)

- MP3 de pronúncia em `public/audio/`
- Cache offline dos áudios
- Embaralhar cards no modo desafio
- Persistir progresso de estudo localmente
