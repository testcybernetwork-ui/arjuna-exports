import type { ReactNode } from "react";
import { Label, Reveal } from "./primitives";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  titleClassName = "",
  introClassName = "",
  gridClassName = "lg:grid-cols-[1.2fr_.8fr]",
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  image?: string;
  titleClassName?: string;
  introClassName?: string;
  gridClassName?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-surface-teal-light pt-12 text-body-text lg:pt-14">
      <div
        className={cn(
          "container relative z-10 grid min-h-[260px] items-end gap-6 py-8 lg:min-h-[280px] lg:grid-cols-[1.2fr_.8fr] lg:gap-12 lg:py-9",
          gridClassName,
        )}
      >
        <Reveal>
          <Label className="mb-6 text-brand">{eyebrow}</Label>
          <h1
            className={cn(
              "display max-w-[21ch] text-h1 text-body-text",
              titleClassName,
            )}
          >
            {title}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p
            className={cn(
              "max-w-[46ch] text-body leading-body text-body-text lg:justify-self-end",
              introClassName,
            )}
          >
            {intro}
          </p>
        </Reveal>
      </div>
      {image && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-30 slow-zoom"
          style={{
            backgroundImage: `linear-gradient(to right, var(--surface-teal-light), color-mix(in oklab, var(--surface-teal-light) 84%, transparent), color-mix(in oklab, var(--brand) 35%, transparent)), url(${image})`,
          }}
        />
      )}
    </section>
  );
}

export const pageMeta = (title: string, description: string) => ({
  meta: [
    { title: `${title} | Arjuna Exports` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Arjuna Exports` },
    { property: "og:description", content: description },
  ],
});
