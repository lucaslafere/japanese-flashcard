import { useState, type MouseEvent } from 'react';
import type { KanjiCard } from '../data/kanjiSets';
import styles from './FlashCard.module.css';

interface FlashCardProps {
  card: KanjiCard;
}

export function FlashCard({ card }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [audioMessage, setAudioMessage] = useState<string | null>(null);

  const handleFlip = () => {
    setIsFlipped((current) => !current);
  };

  const handleAudioClick = (event: MouseEvent) => {
    event.stopPropagation();
    setAudioMessage('Áudio em breve');
    window.setTimeout(() => setAudioMessage(null), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.cardArea}>
        <button
          type="button"
          className={styles.audioButton}
          onClick={handleAudioClick}
          aria-label="Ouvir pronúncia"
        >
          ▶
        </button>

        <button
          type="button"
          className={`${styles.card} ${isFlipped ? styles.flipped : ''}`}
          onClick={handleFlip}
          aria-label={isFlipped ? 'Mostrar kanji' : 'Mostrar tradução'}
        >
          <div className={styles.inner}>
            <div className={`${styles.face} ${styles.front}`}>
              <span className={styles.kanji}>{card.kanji}</span>
            </div>

            <div className={`${styles.face} ${styles.back}`}>
              <span className={styles.romaji}>{card.romaji.toUpperCase()}</span>
              <span className={styles.translation}>{card.translation}</span>
            </div>
          </div>
        </button>
      </div>

      <p className={styles.hint}>Toque para girar</p>

      {audioMessage && <p className={styles.toast}>{audioMessage}</p>}
    </div>
  );
}
