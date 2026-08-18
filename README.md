# Aprender Japonês

PWA de flashcards de japonês com dois modos de estudo, conjuntos por dificuldade e suporte offline.

## Funcionalidades

- **Modo Desafio**: card grande com kanji, flip para romaji e tradução
- **Modo Dicionário**: grid scrollável com busca
- **Conjuntos A, B e C** por nível de dificuldade
- **Tema claro/escuro** com preferência salva localmente
- **PWA offline** após a primeira visita

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra `http://localhost:5173/japanese-flashcard/`.

## Build

```bash
npm run build
npm run preview
```

## Deploy no GitHub Pages

1. Crie um repositório no GitHub chamado `japanese-flashcard`
2. Envie este projeto para a branch `main`
3. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**
4. O workflow `.github/workflows/deploy.yml` publica automaticamente a cada push em `main`
5. URL final: `https://<seu-usuario>.github.io/japanese-flashcard/`

Se o repositório tiver outro nome, altere `base` em `vite.config.ts` para `/<nome-do-repo>/`.

## Instalar no iPhone

1. Abra a URL publicada no **Safari** (HTTPS é obrigatório)
2. Toque em **Compartilhar** (ícone de quadrado com seta)
3. Escolha **Adicionar à Tela de Início**
4. Abra pelo ícone na tela inicial

Após a primeira visita online, o app funciona offline para navegação e cards. Áudio (MP3) será adicionado em uma versão futura.

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
