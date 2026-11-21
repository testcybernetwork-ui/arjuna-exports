import { CheckCircle2 } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpecRow = { label: string; values: string[] };
type SpecSection = { label?: string; rows: SpecRow[] };

export function ImageSlot({
  todo,
  className,
  caption,
}: {
  todo: string;
  className?: string;
  caption?: ReactNode;
}) {
  if (!import.meta.env.DEV) return null;

  return (
    <div role="img" aria-label={`TODO: ${todo}`} className={cn("image-slot", className)}>
      <span className="image-slot__label">TODO: {todo}</span>
      {caption && <span className="image-slot__caption">{caption}</span>}
    </div>
  );
}

export function SpecTable({
  title,
  columns,
  sections,
  className,
}: {
  title: string;
  columns: string[];
  sections: SpecSection[];
  className?: string;
}) {
  return (
    <div
      className={cn("overflow-x-auto rounded-sm border border-brand/15 bg-pure-white", className)}
      role="region"
      aria-label={title}
      tabIndex={0}
    >
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr className="bg-brand text-pure-white">
            <th scope="col" className="px-5 py-4 text-sm font-bold">
              Specification
            </th>
            {columns.map((column) => (
              <th scope="col" key={column} className="px-5 py-4 text-sm font-bold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sections.map((section, sectionIndex) => (
            <Fragment key={section.label ?? sectionIndex}>
              {section.label && (
                <tr className="bg-brand-soft">
                  <th
                    scope="rowgroup"
                    colSpan={columns.length + 1}
                    className="px-5 py-3 text-left text-sm font-bold text-brand-deep"
                  >
                    {section.label}
                  </th>
                </tr>
              )}
              {section.rows.map((row, rowIndex) => (
                <tr
                  key={row.label}
                  className={`border-t border-charcoal/10 ${
                    rowIndex % 2 === 0 ? "bg-pure-white" : "bg-surface-cream"
                  }`}
                >
                  <th scope="row" className="px-5 py-3 text-sm font-semibold text-charcoal">
                    {row.label}
                  </th>
                  {columns.map((column, columnIndex) => (
                    <td key={column} className="px-5 py-3 text-sm leading-body text-charcoal">
                      {row.values[columnIndex] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FeatureGrid({ features }: { features: string[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex min-h-20 items-center gap-3 rounded-sm border border-brand/15 bg-pure-white px-5 py-4"
        >
          <CheckCircle2
            aria-hidden="true"
            className="h-5 w-5 shrink-0 text-brand"
            strokeWidth={1.8}
          />
          <span className="text-sm font-semibold leading-relaxed text-brand-deep">{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export function PackingCard({
  title,
  description,
  image,
  alt,
  imageTodo,
}: {
  title: string;
  description?: string;
  image?: string;
  alt?: string;
  imageTodo: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-brand/15 bg-pure-white">
      <div className="aspect-[4/3] bg-surface-cream">
        {image ? (
          <img
            src={image}
            alt={alt ?? ""}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <ImageSlot todo={imageTodo} className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="display text-lg leading-heading text-brand-deep">{title}</h3>
        {description && <p className="mt-3 text-sm leading-body text-body-text">{description}</p>}
      </div>
    </article>
  );
}
