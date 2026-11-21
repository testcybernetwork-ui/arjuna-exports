import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { currentAdmin } from "@/server/admin-auth.server";

const getPreviewArticle = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    if (!(await currentAdmin(getRequest()))) return null;
    const { findArticleById } = await import("@/server/blog-db.server");
    return findArticleById(id);
  });

export const Route = createFileRoute("/admin/articles/$id/preview")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  loader: async ({ params }) => {
    const article = await getPreviewArticle({ data: params.id });
    if (!article) throw notFound();
    return article;
  },
  component: PreviewArticle,
});

function PreviewArticle() {
  const article = Route.useLoaderData();
  return (
    <main className="bg-offwhite pb-20 pt-28">
      <article className="shell mx-auto max-w-4xl">
        <Link
          to="/admin/articles/$id/edit"
          params={{ id: article.id }}
          className="mb-8 inline-flex text-sm text-brand"
        >
          ← Return to editor
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
        <div className="mt-5 flex gap-6 text-sm text-charcoal/60">
          <time>
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
      </article>
    </main>
  );
}
