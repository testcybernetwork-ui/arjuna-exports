import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Clock3, Facebook, Linkedin, Mail } from "lucide-react";
import { Breadcrumbs, Label, PrimaryButton, Reveal } from "@/components/site/primitives";
import { resourceArticles, resourceCategories } from "@/lib/resource-data";
import { legacyResourceSlugRedirects } from "@/lib/route-aliases";
import { pageMeta } from "@/components/site/PageHero";
import { ImageZoomButton } from "@/components/site/ImageZoom";

export const Route = createFileRoute("/resources_/$slug")({
  loader: ({ params }) => {
    const canonicalSlug = legacyResourceSlugRedirects[params.slug];
    if (canonicalSlug) {
      throw redirect({
        to: "/resources/$slug",
        params: { slug: canonicalSlug },
        statusCode: 301,
      });
    }
    const article = resourceArticles.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return {
      article,
      related: resourceArticles.filter((item) => item.slug !== article.slug).slice(0, 3),
    };
  },
  head: ({ loaderData }) =>
    pageMeta(
      loaderData?.article.title ?? "Resources",
      loaderData?.article.excerpt ?? "Practical coco coir knowledge from Arjuna Exports.",
      loaderData?.article.slug ? `/resources/${loaderData.article.slug}` : "/resources",
      loaderData?.article.image,
    ),
  component: ArticleDetail,
});

const ribbonStyles = [
  "bg-earth-brown text-pure-white",
  "bg-botanical text-brand-deep",
  "bg-[#f39a3c] text-charcoal",
  "bg-brand-soft text-brand-deep",
];

function ArticleDetail() {
  const { article, related } = Route.useLoaderData();
  const categories = resourceCategories
    .filter((category) => category !== "All")
    .map((name) => ({
      name,
      image: resourceArticles.find((item) => item.category === name)?.image ?? article.image,
    }));

  return (
    <article className="bg-offwhite pb-20 pt-24 sm:pt-28">
      <div className="container grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: "Home", to: "/" },
              { label: "Resources", to: "/resources" },
              { label: article.title },
            ]}
          />
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-5">
              <Link
                to="/resources"
                className="resource-ribbon inline-flex min-h-10 items-center bg-[#f39a3c] py-2 pl-4 pr-10 text-xs font-bold uppercase tracking-[.06em] text-charcoal transition-opacity hover:opacity-80"
              >
                {article.category}
              </Link>
              <span className="bg-surface-teal-dark px-5 py-3 text-xs font-bold uppercase tracking-[.06em] text-pure-white">
                Resource guide
              </span>
            </div>
            <h1 className="display mt-9 max-w-5xl text-[clamp(2.5rem,4.5vw,4rem)] uppercase leading-[1.02] text-brand-deep">
              {article.title}
            </h1>
            <div className="mt-9 flex flex-wrap items-center justify-between gap-6 border-b border-charcoal/15 pb-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal/65">
                <Clock3 className="h-4 w-4" strokeWidth={1.8} aria-hidden />
                Reading time: {article.read}
              </span>
              <div
                className="flex items-center gap-5 text-brand-deep"
                aria-label="Share this article"
              >
                <a
                  href="https://www.facebook.com/"
                  aria-label="Share on Facebook"
                  className="transition-colors hover:text-brand"
                >
                  <Facebook className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  aria-label="Share on LinkedIn"
                  className="transition-colors hover:text-brand"
                >
                  <Linkedin className="h-5 w-5" aria-hidden />
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(article.title)}`}
                  aria-label="Share by email"
                  className="transition-colors hover:text-brand"
                >
                  <Mail className="h-5 w-5" aria-hidden />
                </a>
              </div>
            </div>
            <p className="mt-7 max-w-4xl text-lg font-semibold leading-relaxed text-brand-deep sm:text-xl">
              {article.excerpt}
            </p>
          </Reveal>

          {article.image && (
            <Reveal className="mt-10">
              <div className="relative aspect-[16/8] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <ImageZoomButton src={article.image} alt={article.title} />
                <span className="absolute bottom-4 left-4 bg-offwhite px-3 py-2 text-xs font-bold uppercase tracking-[.08em] text-brand-deep shadow-sm sm:bottom-6 sm:left-6">
                  {article.category}
                </span>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-10 max-w-4xl">
            <div className="article-body">
              <p>{article.introduction}</p>
              {article.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p className="whitespace-pre-line">{section.body}</p>
                </section>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-12 flex flex-col items-start justify-between gap-7 border-t border-charcoal/20 pt-9 sm:flex-row sm:items-center">
            <div>
              <Label className="text-brand">Technical note</Label>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-charcoal/65">
                Crop requirements vary. Confirm product and irrigation specifications through a
                local trial or with our technical team.
              </p>
            </div>
            <PrimaryButton to="/contact">Ask our team</PrimaryButton>
          </Reveal>
        </div>

        <aside className="border-t border-solid border-brand/45 pt-10 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <Reveal>
            <h2 className="display text-[clamp(2rem,3vw,3rem)] text-earth-brown">
              Explore by category
            </h2>
            <span className="mt-3 block h-0.5 w-full bg-botanical" aria-hidden />
            <nav className="mt-8 grid gap-5" aria-label="Resource categories">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to="/resources"
                  search={{ category: category.name }}
                  className={`resource-ribbon group relative flex min-h-20 items-center py-3 pl-[5.5rem] pr-10 transition-transform hover:translate-x-1 ${ribbonStyles[index % ribbonStyles.length]}`}
                >
                  <span className="absolute left-0 top-1/2 h-[4.65rem] w-[4.65rem] -translate-y-1/2 overflow-hidden rounded-full border-4 border-current/25 bg-offwhite">
                    <img
                      src={category.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </span>
                  <span className="text-sm font-bold uppercase leading-snug">{category.name}</span>
                </Link>
              ))}
            </nav>
          </Reveal>

          <Reveal className="mt-14">
            <h2 className="display text-3xl uppercase text-earth-brown sm:text-4xl">
              Latest articles
            </h2>
            <span className="mt-3 block h-0.5 w-full bg-botanical" aria-hidden />
            <div className="mt-8 grid gap-8">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/resources/$slug"
                  params={{ slug: item.slug }}
                  className="group grid grid-cols-[112px_1fr] gap-4"
                >
                  <div className="aspect-square overflow-hidden bg-brand-soft">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="min-w-0 py-1">
                    <span className="text-[10px] font-bold uppercase tracking-[.1em] text-brand">
                      {item.category}
                    </span>
                    <h3 className="display mt-2 text-xl leading-tight text-brand-deep transition-colors group-hover:text-brand">
                      {item.title}
                    </h3>
                    <span className="mt-2 block text-xs text-charcoal/55">{item.read}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </aside>
      </div>
    </article>
  );
}
