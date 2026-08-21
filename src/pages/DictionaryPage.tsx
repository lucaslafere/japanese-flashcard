import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { KanjiGrid } from "../components/KanjiGrid";
import { Layout } from "../components/Layout";
import {
  getSetById,
  getStudySet,
  type KanjiCard,
  type StudyListResult,
} from "../data/kanjiSets";
import type { Theme } from "../hooks/useTheme";
import styles from "./DictionaryPage.module.css";

interface DictionaryPageProps {
  theme: Theme;
  onToggleTheme: () => void;
  studyCards: KanjiCard[];
  onAddToStudyList: (card: KanjiCard) => StudyListResult;
  onToggleStudyList: (card: KanjiCard) => StudyListResult;
}

export function DictionaryPage({
  theme,
  onToggleTheme,
  studyCards,
  onAddToStudyList,
  onToggleStudyList,
}: DictionaryPageProps) {
  const { setId } = useParams<{ setId: string }>();
  const set =
    setId === "study"
      ? getStudySet(studyCards)
      : setId
        ? getSetById(setId)
        : undefined;
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notice, setNotice] = useState<{
    message: string;
    kind: "success" | "info" | "error";
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAddToStudyList = (card: KanjiCard): StudyListResult => {
    const result = onAddToStudyList(card);
    const messages = {
      added: {
        message: "Kanji adicionado à lista de estudo.",
        kind: "success",
      },
      removed: {
        message: "Kanji removido da lista de estudo.",
        kind: "success",
      },
      duplicate: {
        message: "Este kanji já está na lista de estudo.",
        kind: "info",
      },
      error: {
        message: "Não foi possível salvar a lista de estudo.",
        kind: "error",
      },
    } as const;
    setNotice(messages[result]);
    window.setTimeout(() => setNotice(null), 2400);
    return result;
  };

  const handleToggleStudyList = (card: KanjiCard): StudyListResult => {
    const result = onToggleStudyList(card);
    const messages = {
      added: {
        message: "Kanji adicionado à lista de estudo.",
        kind: "success",
      },
      removed: {
        message: "Kanji removido da lista de estudo.",
        kind: "success",
      },
      duplicate: {
        message: "Este kanji já está na lista de estudo.",
        kind: "info",
      },
      error: {
        message: "Não foi possível salvar a lista de estudo.",
        kind: "error",
      },
    } as const;
    setNotice(messages[result]);
    window.setTimeout(() => setNotice(null), 2400);
    return result;
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const filteredCards = useMemo(() => {
    if (!set) {
      return [];
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return set.cards;
    }

    return set.cards.filter(
      (card) =>
        card.kanji.includes(normalizedQuery) ||
        card.romaji.toLowerCase().includes(normalizedQuery) ||
        card.translation.toLowerCase().includes(normalizedQuery),
    );
  }, [set, query]);

  if (!set) {
    return (
      <Navigate
        to='/modo/dicionario/conjunto'
        replace
      />
    );
  }

  return (
    <Layout
      title='Dicionário'
      subtitle={`(${set.label})`}
      showBack
      backTo='/modo/dicionario/conjunto'
      theme={theme}
      onToggleTheme={onToggleTheme}
      hideThemeToggle={isSearchOpen}
      headerAction={
        isSearchOpen ? (
          <form
            className={styles.searchForm}
            onSubmit={(event) => event.preventDefault()}>
            <button
              type='button'
              className={styles.closeSearchButton}
              onClick={() => setIsSearchOpen(false)}
              aria-label='Fechar busca'>
              ×
            </button>
            <input
              type='search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Buscar kanji'
              aria-label='Buscar kanji'
              ref={searchInputRef}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsSearchOpen(false);
                }
              }}
              className={styles.searchInput}
            />
          </form>
        ) : (
          <button
            type='button'
            className={styles.searchButton}
            onClick={() => setIsSearchOpen(true)}
            aria-label='Abrir busca'
            title='Buscar kanji'>
            <span
              className={styles.searchIcon}
              aria-hidden='true'
            />
          </button>
        )
      }>
      <div className={styles.scrollArea}>
        <KanjiGrid
          cards={filteredCards}
          columns={2}
          onSwipe={handleAddToStudyList}
          onToggleStudyList={handleToggleStudyList}
          studyCardIds={new Set(studyCards.map((card) => card.id))}
        />
      </div>
      {notice && (
        <p
          className={`${styles.notice} ${styles[notice.kind]}`}
          role='status'
          aria-live='polite'>
          {notice.message}
        </p>
      )}
    </Layout>
  );
}
