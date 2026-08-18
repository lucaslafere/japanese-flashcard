import type { KanjiCard } from '../data/kanjiSets';
import styles from './KanjiGrid.module.css';

interface KanjiGridProps {
  cards: KanjiCard[];
}

export function KanjiGrid({ cards }: KanjiGridProps) {
  if (cards.length === 0) {
    return <p className={styles.empty}>Nenhum kanji encontrado.</p>;
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => (
        <article key={card.id} className={styles.item} title={card.translation}>
          <span className={styles.kanji}>{card.kanji}</span>
          <span className={styles.meta}>{card.romaji}</span>
        </article>
      ))}
    </div>
  );
}
