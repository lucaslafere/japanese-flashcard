import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { FlashCard } from "../components/FlashCard";
import { Layout } from "../components/Layout";
import { getSetById } from "../data/kanjiSets";
import type { Theme } from "../hooks/useTheme";
import styles from "./ChallengePage.module.css";

interface ChallengePageProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function ChallengePage({ theme, onToggleTheme }: ChallengePageProps) {
  const { setId } = useParams<{ setId: string }>();
  const set = setId ? getSetById(setId) : undefined;
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const cards = useMemo(() => set?.cards ?? [], [set]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) {
      return;
    }

    const slides = Array.from(carousel.children);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSlide = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              second.intersectionRatio - first.intersectionRatio,
          )[0];
        const index =
          visibleSlide?.target instanceof HTMLElement
            ? Number(visibleSlide.target.dataset.slideIndex)
            : Number.NaN;

        if (Number.isInteger(index)) {
          setCurrentIndex(index);
        }
      },
      { root: carousel, threshold: 0.6 },
    );

    slides.forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [cards.length]);

  if (!set) {
    return (
      <Navigate
        to='/modo/desafio/conjunto'
        replace
      />
    );
  }

  const goToCard = (index: number) => {
    carouselRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const goPrevious = () => {
    goToCard(currentIndex === 0 ? cards.length - 1 : currentIndex - 1);
  };

  const goNext = () => {
    goToCard(currentIndex === cards.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <Layout
      title='Modo Desafio'
      subtitle={`${set.label} · ${currentIndex + 1}/${cards.length}`}
      showBack
      backTo='/modo/desafio/conjunto'
      theme={theme}
      onToggleTheme={onToggleTheme}>
      <div className={styles.content}>
        <div
          ref={carouselRef}
          className={styles.carousel}
          aria-label='Cartões do desafio'>
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={styles.slide}
              data-slide-index={index}>
              <FlashCard card={card} />
            </div>
          ))}
        </div>

        <div className={styles.navigation}>
          <button
            type='button'
            className={styles.navButton}
            onClick={goPrevious}
            aria-label='Cartão anterior'>
            <span aria-hidden='true'>←</span>
            Anterior
          </button>
          <button
            type='button'
            className={styles.navButton}
            onClick={goNext}
            aria-label='Próximo cartão'>
            Próximo
            <span aria-hidden='true'>→</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
