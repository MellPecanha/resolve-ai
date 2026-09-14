import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-background-glow" />

      <section className="auth-container">
        <div className="auth-brand">
          <div className="brand-mark">
            ✓
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
    </main>
  );
}

export default AuthLayout;
