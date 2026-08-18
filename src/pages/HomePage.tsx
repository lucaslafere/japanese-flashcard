import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Theme } from '../hooks/useTheme';
import styles from './HomePage.module.css';

interface HomePageProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function HomePage({ theme, onToggleTheme }: HomePageProps) {
  return (
    <Layout
      title="Aprender Japonês"
      footer={
        <div className={styles.footer}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      }
    >
      <div className={styles.actions}>
        <Link to="/modo/desafio/conjunto" className={styles.primaryButton}>
          <span className={styles.buttonIcon} aria-hidden="true">
            ★
          </span>
          <span>Modo Desafio</span>
        </Link>

        <Link to="/modo/dicionario/conjunto" className={styles.secondaryButton}>
          <span className={styles.buttonIcon} aria-hidden="true">
            📖
          </span>
          <span>Modo Dicionário</span>
        </Link>
      </div>
    </Layout>
  );
}
