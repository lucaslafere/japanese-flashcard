import { Link, Navigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { kanjiSets } from '../data/kanjiSets';
import styles from './SetSelectPage.module.css';

const modeLabels = {
  desafio: 'Modo Desafio',
  dicionario: 'Modo Dicionário',
} as const;

type AppMode = keyof typeof modeLabels;

function isValidMode(mode: string | undefined): mode is AppMode {
  return mode === 'desafio' || mode === 'dicionario';
}

export function SetSelectPage() {
  const { mode } = useParams<{ mode: string }>();

  if (!isValidMode(mode)) {
    return <Navigate to="/" replace />;
  }

  const modeLabel = modeLabels[mode];
  const basePath = mode === 'desafio' ? '/desafio' : '/dicionario';

  return (
    <Layout
      title="Escolher Conjunto"
      subtitle={modeLabel}
      showBack
      backTo="/"
    >
      <div className={styles.list}>
        {kanjiSets.map((set) => (
          <Link
            key={set.id}
            to={`${basePath}/${set.id}`}
            className={styles.setButton}
          >
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
