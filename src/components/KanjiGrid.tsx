import { useState, type CSSProperties } from "react";
import type { KanjiCard } from "../data/kanjiSets";
import styles from "./KanjiGrid.module.css";

interface KanjiGridProps {
  cards: KanjiCard[];
}

export function KanjiGrid({ cards }: KanjiGridProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  if (cards.length === 0) {
    return <p className={styles.empty}>Nenhum kanji encontrado.</p>;
  }

  return (
    <div className={styles.grid}>
      {cards.map((card) => {
        const isFlipped = flippedCards.has(card.id);

        return (
          <button
            key={card.id}
            type='button'
            className={`${styles.item} ${isFlipped ? styles.flipped : ""}`}
            onClick={() => {
              setFlippedCards((current) => {
                const next = new Set(current);
                if (next.has(card.id)) {
                  next.delete(card.id);
                } else {
                  next.add(card.id);
                }
                return next;
              });
            }}
            aria-label={
              isFlipped
                ? `Mostrar ${card.kanji}`
                : `Ver detalhes de ${card.kanji}`
            }
            aria-pressed={isFlipped}>
            <span className={styles.inner}>
              <span
                className={`${styles.face} ${styles.front}`}
                style={
                  { "--kanji-length": [...card.kanji].length } as CSSProperties
                }>
                <span className={styles.kanji}>{card.kanji}</span>
              </span>
              <span className={`${styles.face} ${styles.back}`}>
                <span className={styles.meta}>{card.romaji}</span>
                <span className={styles.translation}>{card.translation}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
