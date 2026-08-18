import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  footer?: ReactNode;
}

export function Layout({
  children,
  title,
  subtitle,
  showBack = false,
  backTo = '/',
  footer,
}: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        {showBack && (
          <Link to={backTo} className={styles.backButton} aria-label="Voltar">
            ←
          </Link>
        )}
        {(title || subtitle) && (
          <div className={styles.headerText}>
            {title && <h1 className={styles.title}>{title}</h1>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        )}
      </header>

      <main className={styles.main}>{children}</main>

      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  );
}
