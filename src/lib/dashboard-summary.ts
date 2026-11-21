export type RecentArticle = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
};

export type DashboardSummary = {
  total: number;
  published: number;
  drafts: number;
  recent: RecentArticle[];
};

export function normalizeDashboardSummary(rawData: unknown): DashboardSummary {
  if (!rawData || typeof rawData !== "object") {
    return { total: 0, published: 0, drafts: 0, recent: [] };
  }

  const data = rawData as Record<string, unknown>;

  // Accept either `recent` or `articles` to tolerate API response variants
  const rawList = Array.isArray(data["recent"])
    ? data["recent"]
    : Array.isArray(data["articles"])
      ? data["articles"]
      : [];

  const recent: RecentArticle[] = rawList
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((item) => ({
      id: String(item["id"] ?? ""),
      title: String(item["title"] ?? "Untitled"),
      slug: String(item["slug"] ?? ""),
      status: item["status"] === "published" ? ("published" as const) : ("draft" as const),
    }));

  return {
    total: typeof data["total"] === "number" ? data["total"] : Number(data["total"]) || 0,
    published:
      typeof data["published"] === "number" ? data["published"] : Number(data["published"]) || 0,
    drafts: typeof data["drafts"] === "number" ? data["drafts"] : Number(data["drafts"]) || 0,
    recent,
  };
}
