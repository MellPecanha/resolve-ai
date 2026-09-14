import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "analysis"
  | "attendance"
  | "resolved"
  | "cancelled";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
}

function Badge({
  children,
  variant = "default",
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}

export default Badge;
