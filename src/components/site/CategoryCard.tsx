import type { ReactNode } from "react";

type CategoryCardProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
};

const cardClassName = (active = false) =>
  `absolute inset-0 flex min-h-11 w-full items-center justify-start gap-3 px-3 py-2 text-left text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
    active ? "ring-2 ring-brand/30 bg-brand-soft" : ""
  }`;

export function CategoryCard({ icon, label, onClick, active = false }: CategoryCardProps) {
  const content = (
    <>
      <span className="shrink-0 text-brand [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-2">
        {icon}
      </span>
      <span className="max-w-[100px] whitespace-pre-line text-xs leading-tight font-semibold uppercase tracking-[0.08em]">
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={cardClassName(active)}>
        {content}
      </button>
    );
  }

  return <div className={cardClassName(active)}>{content}</div>;
}
