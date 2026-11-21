import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Arrow } from "@/components/site/primitives";

const getResourceArticle = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const { findResourceArticle } = await import("@/server/blog-db.server");
    return findResourceArticle(slug);
  });

export const Route = createFileRoute("/resources/articles/$slug")({
  loader: async ({ params }) => {
    const article = await getResourceArticle({ data: params.slug });
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: article }) => ({
    meta: [
      { title: article?.metaTitle || article?.title || "Article | Arjuna Exports" },
      { name: "description", content: article?.metaDescription || article?.excerpt || "" },
      { property: "og:title", content: article?.metaTitle || article?.title || "" },
      { property: "og:description", content: article?.metaDescription || article?.excerpt || "" },
      { property: "og:image", content: article?.coverImage || "" },
      { property: "og:type", content: "article" },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const article = Route.useLoaderData();
  return (
    <main className="bg-offwhite pb-20 pt-28">
      <article className="shell mx-auto max-w-4xl">
        <Link
          to="/resources"
          className="mb-8 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand"
        >
          <Arrow className="rotate-180" /> Back to Resources
        </Link>
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.imageAlt}
            className="mb-8 aspect-[16/9] w-full rounded-md object-cover"
          />
        )}
        <p className="micro-label text-brand">{article.tag}</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-tight">
          {article.title}
        </h1>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal/60">
          <time dateTime={article.publishedAt || article.createdAt}>
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })}
          </time>
          <span>{article.readTime}</span>
        </div>
        <div className="article-body mt-10" dangerouslySetInnerHTML={{ __html: article.content }} />
        <Link
          to="/resources"
          className="mt-12 inline-flex items-center gap-3 border-b border-brand pb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand"
        >
          <Arrow className="rotate-180" /> Back to Resources
        </Link>
      </article>
    </main>
  );
}
