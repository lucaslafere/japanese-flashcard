import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Theme } from "../hooks/useTheme";
import styles from "./Layout.module.css";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  footer?: ReactNode;
  theme: Theme;
  onToggleTheme: () => void;
  centered?: boolean;
}

export function Layout({
  children,
  title,
  subtitle,
  showBack = false,
  backTo = "/",
  footer,
  theme,
  onToggleTheme,
  centered = false,
}: LayoutProps) {
  return (
    <div className={`${styles.layout} ${centered ? styles.centered : ""}`}>
      <header className={styles.header}>
        <div className={styles.themeToggle}>
          <ThemeToggle
            theme={theme}
            onToggle={onToggleTheme}
          />
        </div>
        {showBack && (
          <Link
            to={backTo}
            className={styles.backButton}
            aria-label='Voltar'>
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
