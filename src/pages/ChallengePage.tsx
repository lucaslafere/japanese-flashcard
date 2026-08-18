import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { FlashCard } from '../components/FlashCard';
import { Layout } from '../components/Layout';
import { getSetById } from '../data/kanjiSets';
import styles from './ChallengePage.module.css';

export function ChallengePage() {
  const { setId } = useParams<{ setId: string }>();
  const set = setId ? getSetById(setId) : undefined;
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = useMemo(() => set?.cards ?? [], [set]);
  const currentCard = cards[currentIndex];

  if (!set) {
    return <Navigate to="/modo/desafio/conjunto" replace />;
  }

  const goPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? cards.length - 1 : index - 1));
  };

  const goNext = () => {
    setCurrentIndex((index) => (index === cards.length - 1 ? 0 : index + 1));
  };

  return (
    <Layout
      title="Modo Desafio"
      subtitle={`${set.label} · ${currentIndex + 1}/${cards.length}`}
      showBack
      backTo="/modo/desafio/conjunto"
    >
      <div className={styles.content}>
        {currentCard && (
          <FlashCard key={currentCard.id} card={currentCard} />
        )}

        <div className={styles.navigation}>
          <button type="button" className={styles.navButton} onClick={goPrevious}>
            Anterior
          </button>
          <button type="button" className={styles.navButton} onClick={goNext}>
            Próximo
          </button>
        </div>
      </div>
    </Layout>
  );
}
