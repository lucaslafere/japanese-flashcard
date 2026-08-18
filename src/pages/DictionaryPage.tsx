import { useMemo, useState } from "react";
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
      footer={
        <div className={styles.searchBar}>
          <input
            type='search'
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Buscar...'
            aria-label='Buscar kanji'
            className={styles.searchInput}
          />
        </div>
      }>
      <div className={styles.scrollArea}>
        <KanjiGrid cards={filteredCards} />
      </div>
    </Layout>
  );
}
