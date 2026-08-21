import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { KanjiCard, StudyListResult } from "../data/kanjiSets";
import styles from "./KanjiGrid.module.css";

interface KanjiGridProps {
  cards: KanjiCard[];
  columns?: 2 | 3;
  onSwipe?: (card: KanjiCard) => StudyListResult;
  onToggleStudyList?: (card: KanjiCard) => StudyListResult;
  studyCardIds?: Set<string>;
}

export function KanjiGrid({
  cards,
  columns = 3,
  onSwipe,
  onToggleStudyList,
  studyCardIds,
}: KanjiGridProps) {
  const swipeThreshold = 80;
  const maxSwipeOffset = 120;
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [swipePreview, setSwipePreview] = useState<{
    cardId: string;
    offset: number;
    phase: "dragging" | "ready" | "success" | "cancelled";
    action: "add" | "remove";
  } | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    cardId: string;
    result: StudyListResult;
  } | null>(null);
  const gestureRef = useRef<{
    cardId: string;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const showActionFeedback = (
    card: KanjiCard,
    action: ((card: KanjiCard) => StudyListResult) | undefined = onSwipe,
  ) => {
    if (!action) {
      return "error" as StudyListResult;
    }

    const result = action(card);
    setActionFeedback({ cardId: card.id, result });
    window.setTimeout(() => {
      setActionFeedback((current) =>
        current?.cardId === card.id ? null : current,
      );
    }, 1800);
    return result;
  };

  if (cards.length === 0) {
    return <p className={styles.empty}>Nenhum kanji encontrado.</p>;
  }

  return (
    <div className={`${styles.grid} ${columns === 2 ? styles.twoColumns : ""}`}>
      {cards.map((card) => {
        const isFlipped = flippedCards.has(card.id);
        const isPreviewing = swipePreview?.cardId === card.id;
        const swipeOffset = isPreviewing ? swipePreview.offset : 0;
        const isReady = isPreviewing && swipePreview.phase === "ready";
        const isSuccess = isPreviewing && swipePreview.phase === "success";
        const cardFeedback =
          actionFeedback?.cardId === card.id ? actionFeedback.result : null;
        const isBookmarked =
          studyCardIds?.has(card.id) || cardFeedback === "added";
        const swipeAction = isBookmarked ? onToggleStudyList : onSwipe;

        const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
          if (!event.isPrimary) {
            return;
          }

          gestureRef.current = {
            cardId: card.id,
            startX: event.clientX,
            startY: event.clientY,
            moved: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        };

        const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
          const gesture = gestureRef.current;
          if (!gesture || gesture.cardId !== card.id) {
            return;
          }

          if (!event.isPrimary) {
            return;
          }

          const offsetX = event.clientX - gesture.startX;
          const offsetY = event.clientY - gesture.startY;
          if (
            Math.abs(offsetX) < 10 ||
            Math.abs(offsetX) < Math.abs(offsetY) * 1.2
          ) {
            return;
          }

          gesture.moved = true;
          const distance = Math.abs(offsetX);
          const limitedOffset = Math.min(
            maxSwipeOffset,
            distance > swipeThreshold
              ? swipeThreshold + (distance - swipeThreshold) * 0.25
              : distance,
          );
          setSwipePreview({
            cardId: card.id,
            offset: Math.sign(offsetX) * limitedOffset,
            phase: distance >= swipeThreshold ? "ready" : "dragging",
            action: isBookmarked ? "remove" : "add",
          });
        };

        const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
          const gesture = gestureRef.current;
          if (!gesture || gesture.cardId !== card.id) {
            return;
          }

          if (!event.isPrimary) {
            return;
          }

          const offsetX = event.clientX - gesture.startX;
          if (gesture.moved) {
            suppressClickRef.current = true;
            if (Math.abs(offsetX) >= swipeThreshold) {
              setSwipePreview({
                cardId: card.id,
                offset: Math.sign(offsetX) * maxSwipeOffset,
                phase: "success",
                action: isBookmarked ? "remove" : "add",
              });
              showActionFeedback(card, swipeAction);
              window.setTimeout(() => setSwipePreview(null), 450);
            } else {
              setSwipePreview({
                cardId: card.id,
                offset: 0,
                phase: "cancelled",
                action: isBookmarked ? "remove" : "add",
              });
              window.setTimeout(() => setSwipePreview(null), 180);
            }
          }
          gestureRef.current = null;
        };

        return (
          <div
            key={card.id}
            className={styles.cardItem}>
            <button
              type='button'
              className={`${styles.item} ${isFlipped ? styles.flipped : ""} ${isPreviewing ? styles.swiping : ""} ${isReady ? styles.ready : ""} ${isSuccess ? styles.success : ""}`}
              style={{
                transform: `translateX(${swipeOffset}px) rotate(${Math.max(-8, Math.min(8, swipeOffset / 15))}deg)`,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={() => {
                gestureRef.current = null;
                setSwipePreview(null);
              }}
              onLostPointerCapture={() => {
                if (gestureRef.current?.cardId === card.id) {
                  gestureRef.current = null;
                  setSwipePreview(null);
                }
              }}
              onClick={() => {
                if (suppressClickRef.current) {
                  suppressClickRef.current = false;
                  return;
                }
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
              {isPreviewing && (
                <span className={styles.swipeHint}>
                  {isSuccess
                    ? swipePreview.action === "remove"
                      ? "Removido da lista"
                      : "Adicionado à lista"
                    : isReady
                      ? swipePreview.action === "remove"
                        ? "Solte para remover"
                        : "Solte para adicionar"
                      : `${swipePreview.action === "remove" ? "Remover" : "Adicionar"} à lista ${swipeOffset < 0 ? "←" : "→"}`}
                </span>
              )}
              <span className={styles.inner}>
                <span
                  className={`${styles.face} ${styles.front}`}
                  style={
                    {
                      "--kanji-length": [...card.kanji].length,
                    } as CSSProperties
                  }>
                  <span className={styles.kanji}>{card.kanji}</span>
                </span>
                <span className={`${styles.face} ${styles.back}`}>
                  <span className={styles.meta}>{card.romaji}</span>
                  <span className={styles.translation}>{card.translation}</span>
                </span>
              </span>
            </button>
            {onSwipe && (
              <button
                type='button'
                className={`${styles.addButton} ${isBookmarked ? styles.added : ""}`}
                onClick={() => showActionFeedback(card, onToggleStudyList)}
                aria-label={
                  isBookmarked
                    ? `Remover ${card.kanji} da lista de estudo`
                    : `Adicionar ${card.kanji} à lista de estudo`
                }
                aria-pressed={isBookmarked}
                title={
                  isBookmarked
                    ? "Remover da lista de estudo"
                    : "Adicionar à lista de estudo"
                }>
                <span
                  className={`${styles.bookmarkIcon} ${isBookmarked ? styles.filled : ""}`}
                  aria-hidden='true'
                />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
