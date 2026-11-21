import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { adminRequest } from "@/lib/admin-api";
import { toast } from "sonner";
import { AdminNav } from "@/components/admin/AdminNav";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published";
  updatedAt: string;
  publishedAt: string | null;
  readTime: string;
  tag: string;
  coverImage: string | null;
};
type Result = {
  articles: Article[];
  total: number;
  page: number;
  pageCount: number;
  tags: string[];
};
const dateLabel = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })
    : "\u2014";

export function AdminDashboard() {
  const [result, setResult] = useState<Result>({
    articles: [],
    total: 0,
    page: 1,
    pageCount: 0,
    tags: [],
  });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("date");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, status, tag, sort, page: String(page) });
      const response = await adminRequest(`/api/admin/articles?${params}`);
      const data = (await response.json()) as Result & { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load articles.");
      setResult(data);
      setError("");
      setSelected([]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load articles.");
    } finally {
      setLoading(false);
    }
  }, [query, status, tag, sort, page]);
  useEffect(() => {
    void load();
  }, [load]);

  async function remove(article: Article) {
    if (!window.confirm("Are you sure you want to delete this article? This cannot be undone."))
      return;
    const response = await adminRequest(`/api/admin/articles/${encodeURIComponent(article.id)}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("Article deleted");
      await load();
    } else {
      toast.error("Could not delete article");
      setError("Could not delete this article.");
    }
  }
  async function toggle(article: Article) {
    const response = await adminRequest(
      `/api/admin/articles/${encodeURIComponent(article.id)}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: article.status === "published" ? "draft" : "published" }),
      },
    );
    if (response.ok) {
      toast.success(article.status === "published" ? "Article unpublished" : "Article published");
      await load();
    } else {
      toast.error("Could not update article");
      setError("Could not update this article.");
    }
  }
  async function bulk(action: "delete" | "published" | "draft") {
    if (!selected.length) return;
    if (
      action === "delete" &&
      !window.confirm("Are you sure you want to delete these articles? This cannot be undone.")
    )
      return;
    const response = await adminRequest("/api/admin/articles/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action }),
    });
    if (!response.ok) {
      toast.error("Could not apply bulk action");
      setError("Could not apply the bulk action.");
    } else {
      toast.success("Bulk action complete");
      await load();
    }
  }
  const selectedOnPage =
    result.articles.length > 0 && result.articles.every((article) => selected.includes(article.id));
  const toggleSelected = (id: string, checked: boolean) =>
    setSelected((ids) =>
      checked ? [...new Set([...ids, id])] : ids.filter((item) => item !== id),
    );
  const rowActions = (article: Article) => (
    <div className="flex flex-wrap gap-3 text-sm">
      {article.status === "published" ? (
        <a
          href={`/resources/articles/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          View
        </a>
      ) : (
        <a
          href={`/admin/articles/${article.id}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline"
        >
          Preview
        </a>
      )}
      <Link
        to="/admin/articles/$id/edit"
        params={{ id: article.id }}
        className="text-brand underline"
      >
        Edit
      </Link>
      <button onClick={() => void toggle(article)} className="text-brand underline">
        {article.status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button onClick={() => void remove(article)} className="text-red-700 underline">
        Delete
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-offwhite px-4 pb-20 pt-24 text-body-text">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <header className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="micro-label text-brand">Arjuna Exports · Private</p>
            <h1 className="display mt-2 text-4xl">Articles</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/articles/new"
              className="rounded bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              + Add New Article
            </Link>
          </div>
        </header>
        <section className="mt-9 rounded-md border border-charcoal/15 bg-white p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap gap-3">
            <label className="sr-only" htmlFor="article-search">
              Search articles
            </label>
            <input
              id="article-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search title or slug"
              className="min-w-56 flex-1 rounded border border-charcoal/20 px-3 py-2"
            />
            <label className="sr-only" htmlFor="article-status">
              Filter by status
            </label>
            <select
              id="article-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              className="rounded border border-charcoal/20 px-3 py-2"
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <label className="sr-only" htmlFor="article-tag">
              Filter by tag
            </label>
            <select
              id="article-tag"
              value={tag}
              onChange={(event) => {
                setTag(event.target.value);
                setPage(1);
              }}
              className="rounded border border-charcoal/20 px-3 py-2"
            >
              <option value="">All tags</option>
              {result.tags.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="article-sort">
              Sort articles
            </label>
            <select
              id="article-sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              className="rounded border border-charcoal/20 px-3 py-2"
            >
              <option value="date">Newest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
          {selected.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-sm">{selected.length} selected</span>
              <button
                onClick={() => void bulk("published")}
                className="rounded border px-3 py-2 text-sm"
              >
                Publish selected
              </button>
              <button
                onClick={() => void bulk("draft")}
                className="rounded border px-3 py-2 text-sm"
              >
                Unpublish selected
              </button>
              <button
                onClick={() => void bulk("delete")}
                className="rounded border border-red-200 px-3 py-2 text-sm text-red-700"
              >
                Delete selected
              </button>
            </div>
          )}
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-700">
              {error}
            </p>
          )}
          {loading ? (
            <p className="py-12 text-center">Loading articles…</p>
          ) : result.articles.length === 0 ? (
            <p className="py-12 text-center text-charcoal/60">
              No articles yet. Add your first article.
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-charcoal/15 text-charcoal/60">
                      <th className="p-3">
                        <input
                          aria-label="Select all on page"
                          type="checkbox"
                          checked={selectedOnPage}
                          onChange={(event) =>
                            setSelected(
                              event.target.checked
                                ? result.articles.map((article) => article.id)
                                : [],
                            )
                          }
                        />
                      </th>
                      <th className="p-3">Thumbnail</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Tag</th>
                      <th className="p-3">Published date</th>
                      <th className="p-3">Read time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.articles.map((article) => (
                      <tr key={article.id} className="border-b border-charcoal/10">
                        <td className="p-3">
                          <input
                            aria-label={`Select ${article.title}`}
                            type="checkbox"
                            checked={selected.includes(article.id)}
                            onChange={(event) => toggleSelected(article.id, event.target.checked)}
                          />
                        </td>
                        <td className="p-3">
                          {article.coverImage && (
                            <img
                              src={article.coverImage}
                              alt=""
                              className="h-12 w-16 rounded object-cover"
                            />
                          )}
                        </td>
                        <td className="p-3">
                          <strong>{article.title}</strong>
                          <div className="mt-1 text-xs text-charcoal/55">{article.slug}</div>
                        </td>
                        <td className="p-3">{article.tag}</td>
                        <td className="p-3">{dateLabel(article.publishedAt)}</td>
                        <td className="p-3">{article.readTime}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${article.status === "published" ? "bg-leaf/15 text-leaf" : "bg-earth-sand/40 text-charcoal"}`}
                          >
                            {article.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="p-3">{rowActions(article)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-4 md:hidden">
                {result.articles.map((article) => (
                  <article key={article.id} className="rounded border border-charcoal/15 p-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected.includes(article.id)}
                        onChange={(event) => toggleSelected(article.id, event.target.checked)}
                      />
                      Select article
                    </label>
                    {article.coverImage && (
                      <img
                        src={article.coverImage}
                        alt=""
                        className="mt-3 aspect-[16/10] w-full rounded object-cover"
                      />
                    )}
                    <h2 className="mt-3 font-semibold">{article.title}</h2>
                    <p className="mt-1 text-xs text-charcoal/60">
                      {article.tag} · {dateLabel(article.publishedAt)} · {article.readTime} ·{" "}
                      {article.status}
                    </p>
                    <div className="mt-3">{rowActions(article)}</div>
                  </article>
                ))}
              </div>
            </>
          )}
          <div className="mt-5 flex items-center justify-between text-sm">
            <span>{result.total} total articles</span>
            <div className="flex items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                Previous
              </button>
              <span>
                Page {result.page || page} of {Math.max(1, result.pageCount)}
              </span>
              <button
                disabled={page >= result.pageCount}
                onClick={() => setPage((value) => value + 1)}
                className="rounded border px-3 py-2 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
