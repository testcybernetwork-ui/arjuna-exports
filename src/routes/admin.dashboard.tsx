import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { adminRequest } from "@/lib/admin-api";
import { AdminNav } from "@/components/admin/AdminNav";
import { normalizeDashboardSummary, type DashboardSummary } from "@/lib/dashboard-summary";

export function DashboardErrorFallback({ error, reset }: { error: unknown; reset?: () => void }) {
  return (
    <main className="min-h-screen bg-offwhite px-4 pb-20 pt-24 text-body-text">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <div className="mt-9 rounded-md border border-red-200 bg-red-50 p-6 text-red-900">
          <h2 className="display text-2xl font-bold">Dashboard Error</h2>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred while rendering the dashboard."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                if (reset) reset();
                else window.location.reload();
              }}
              className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Try Again
            </button>
            <Link
              to="/admin/articles"
              className="rounded border border-charcoal/20 bg-white px-4 py-2 text-sm font-semibold text-charcoal hover:bg-gray-50"
            >
              Go to Articles
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  errorComponent: DashboardErrorFallback,
  component: DashboardPage,
});

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminRequest("/api/admin/summary");
      if (!response.ok) {
        let msg = `Could not load dashboard (status: ${response.status})`;
        try {
          const errData = (await response.json()) as { error?: string };
          if (errData?.error) msg = errData.error;
        } catch {
          // ignore json parsing errors on non-ok status
        }
        throw new Error(msg);
      }
      const data: unknown = await response.json();
      setSummary(normalizeDashboardSummary(data));
    } catch (cause: unknown) {
      setError(cause instanceof Error ? cause.message : "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const { total = 0, published = 0, drafts = 0, recent = [] } = summary ?? {};

  return (
    <main className="min-h-screen bg-offwhite px-4 pb-20 pt-24 text-body-text">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <header className="mt-9 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="micro-label text-brand">Arjuna Exports · Private</p>
            <h1 className="display mt-2 text-4xl">Dashboard</h1>
          </div>
          <Link
            to="/admin/articles/new"
            className="rounded bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            + Add New Article
          </Link>
        </header>

        {error && (
          <div
            role="alert"
            className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => void loadSummary()}
              className="rounded bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        <section aria-label="Article summary" className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Total Articles", loading && !summary ? "—" : total],
            ["Published", loading && !summary ? "—" : published],
            ["Drafts", loading && !summary ? "—" : drafts],
          ].map(([label, value]) => (
            <article key={label} className="rounded-md border border-charcoal/15 bg-white p-6">
              <p className="text-sm text-charcoal/65">{label}</p>
              <p className="display mt-2 text-4xl">{value}</p>
            </article>
          ))}
        </section>

        <section className="mt-9 rounded-md border border-charcoal/15 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="display text-2xl">Recent Articles</h2>
            <Link to="/admin/articles" className="text-sm text-brand underline">
              All articles
            </Link>
          </div>

          {loading && !summary ? (
            <p className="py-8 text-center text-sm text-charcoal/60">Loading recent articles…</p>
          ) : (
            <div className="mt-4 divide-y divide-charcoal/10">
              {recent.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-semibold">{article.title}</p>
                    <p className="mt-1 text-xs text-charcoal/60">
                      {article.status === "published" ? "Published" : "Draft"}
                    </p>
                  </div>
                  <Link
                    to="/admin/articles/$id/edit"
                    params={{ id: article.id }}
                    className="text-sm text-brand underline"
                  >
                    Edit
                  </Link>
                </div>
              ))}
              {recent.length === 0 && (
                <p className="py-6 text-sm text-charcoal/60">No articles yet.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
