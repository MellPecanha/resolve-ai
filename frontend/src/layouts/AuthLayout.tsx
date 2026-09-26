import type { ReactNode } from "react";

import ThemeToggle from "../components/ThemeToggle";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-background-glow" />
      <ThemeToggle className="theme-toggle-auth" />

      <section className="auth-container">
        <div className="auth-brand">
          <div className="brand-mark">
            <img
              className="brand-mark-image"
              src="/favicon.svg"
              alt=""
              aria-hidden="true"
            />
          </div>

          <span>
            resolve <strong>aí</strong>
          </span>
        </div>

        <div className="auth-card">
          {children}
        </div>

        <p className="auth-footer">
          Resolve Aí · Gestão de ocorrências
        </p>
      </section>
    </main >
  );
}

export default AuthLayout;
