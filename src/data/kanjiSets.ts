export interface KanjiCard {
  id: string;
  kanji: string;
  romaji: string;
  translation: string;
  audio?: string;
}

export interface KanjiSet {
  id: 'A' | 'B' | 'C';
  label: string;
  difficulty: string;
  cards: KanjiCard[];
}

export const kanjiSets: KanjiSet[] = [
  {
    id: 'A',
    label: 'Conjunto A',
    difficulty: 'Básico',
    cards: [
      { id: 'a-1', kanji: '誰', romaji: 'dare', translation: 'Quem' },
      { id: 'a-2', kanji: '水', romaji: 'mizu', translation: 'Água' },
      { id: 'a-3', kanji: '火', romaji: 'hi', translation: 'Fogo' },
      { id: 'a-4', kanji: '人', romaji: 'hito', translation: 'Pessoa' },
      { id: 'a-5', kanji: '日', romaji: 'hi', translation: 'Dia / Sol' },
    ],
  },
  {
    id: 'B',
    label: 'Conjunto B',
    difficulty: 'Intermediário',
    cards: [
      { id: 'b-1', kanji: '食', romaji: 'taberu', translation: 'Comer' },
      { id: 'b-2', kanji: '見', romaji: 'miru', translation: 'Ver' },
      { id: 'b-3', kanji: '言', romaji: 'iu', translation: 'Falar' },
      { id: 'b-4', kanji: '学', romaji: 'manabu', translation: 'Estudar' },
      { id: 'b-5', kanji: '時', romaji: 'toki', translation: 'Tempo' },
    ],
  },
  {
    id: 'C',
    label: 'Conjunto C',
    difficulty: 'Avançado',
    cards: [
      { id: 'c-1', kanji: '愛', romaji: 'ai', translation: 'Amor' },
      { id: 'c-2', kanji: '心', romaji: 'kokoro', translation: 'Coração' },
      { id: 'c-3', kanji: '道', romaji: 'michi', translation: 'Caminho' },
      { id: 'c-4', kanji: '夢', romaji: 'yume', translation: 'Sonho' },
      { id: 'c-5', kanji: '静', romaji: 'shizuka', translation: 'Calmo' },
    ],
  },
];

export function getSetById(setId: string): KanjiSet | undefined {
  return kanjiSets.find((set) => set.id === setId);
}
