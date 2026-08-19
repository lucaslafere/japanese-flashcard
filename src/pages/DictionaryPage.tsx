import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { KanjiGrid } from "../components/KanjiGrid";
import { Layout } from "../components/Layout";
import { getSetById } from "../data/kanjiSets";
import type { Theme } from "../hooks/useTheme";
import styles from "./DictionaryPage.module.css";

interface DictionaryPageProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function DictionaryPage({ theme, onToggleTheme }: DictionaryPageProps) {
  const { setId } = useParams<{ setId: string }>();
  const set = setId ? getSetById(setId) : undefined;
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
                if (event.key === 'Escape') {
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
        <KanjiGrid cards={filteredCards} columns={2} />
      </div>
    </Layout>
  );
}
