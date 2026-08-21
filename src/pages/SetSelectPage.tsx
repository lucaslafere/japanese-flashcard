import { Link, Navigate, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { kanjiSets } from "../data/kanjiSets";
import type { Theme } from "../hooks/useTheme";
import styles from "./SetSelectPage.module.css";

interface SetSelectPageProps {
  theme: Theme;
  onToggleTheme: () => void;
  studyCardCount: number;
}

const modeLabels = {
  desafio: "Modo Desafio",
  dicionario: "Modo Dicionário",
} as const;

type AppMode = keyof typeof modeLabels;

function isValidMode(mode: string | undefined): mode is AppMode {
  return mode === "desafio" || mode === "dicionario";
}

export function SetSelectPage({
  theme,
  onToggleTheme,
  studyCardCount,
}: SetSelectPageProps) {
  const { mode } = useParams<{ mode: string }>();

  if (!isValidMode(mode)) {
    return (
      <Navigate
        to='/'
        replace
      />
    );
  }

  const modeLabel = modeLabels[mode];
  const basePath = mode === "desafio" ? "/desafio" : "/dicionario";

  return (
    <Layout
      title='Escolher Conjunto'
      subtitle={modeLabel}
      showBack
      backTo='/'
      theme={theme}
      onToggleTheme={onToggleTheme}>
      <div className={styles.list}>
        {[
          ...kanjiSets,
          {
            id: "study" as const,
            label: "Lista de Estudo",
            difficulty: "Personalizada",
            cards: Array.from({ length: studyCardCount }),
          },
        ].map((set) => (
          <Link
            key={set.id}
            to={`${basePath}/${set.id}`}
            className={styles.setButton}>
            <span className={styles.setLabel}>{set.label}</span>
            <span className={styles.setMeta}>
              {set.difficulty} · {set.cards.length} kanjis
            </span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
