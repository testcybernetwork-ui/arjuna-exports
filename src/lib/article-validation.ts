import type { PostInput } from "@/server/blog-db.server";

const contentTypes = ["Resource guide", "Comparison", "Technical note", "Case study"];

export function parseArticleInput(value: unknown): PostInput | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (
    ["title", "slug", "excerpt", "content", "tag", "contentType", "imageAlt"].some(
      (key) => typeof data[key] !== "string",
    )
  )
    return null;
  if (typeof data["title"] !== "string" || !data["title"].trim() || data["title"].length > 120)
    return null;
  if (typeof data["slug"] !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data["slug"]))
    return null;
  if (
    typeof data["excerpt"] !== "string" ||
    !data["excerpt"].trim() ||
    data["excerpt"].length > 250
  )
    return null;
  if (typeof data["content"] !== "string" || data["content"].length > 1_000_000) return null;
  if (typeof data["tag"] !== "string" || !data["tag"].trim() || data["tag"].length > 120)
    return null;
  if (typeof data["contentType"] !== "string" || !contentTypes.includes(data["contentType"]))
    return null;
  if (
    typeof data["imageAlt"] !== "string" ||
    !data["imageAlt"].trim() ||
    data["imageAlt"].length > 250
  )
    return null;
  if (typeof data["coverImage"] !== "string") return null;
  if (
    !/^\/(?:api\/uploads\/blog\/[a-f0-9-]+\.(?:jpg|jpeg|png|webp)|blog-covers\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp))$/i.test(
      data["coverImage"],
    )
  )
    return null;
  if (data["status"] !== "draft" && data["status"] !== "published") return null;
  if (typeof data["metaTitle"] !== "string" || data["metaTitle"].length > 60) return null;
  if (typeof data["metaDescription"] !== "string" || data["metaDescription"].length > 160)
    return null;
  if (typeof data["publishedAt"] !== "string" || !Number.isFinite(Date.parse(data["publishedAt"])))
    return null;
  if (
    data["readTime"] !== undefined &&
    (typeof data["readTime"] !== "string" || data["readTime"].length > 40)
  )
    return null;
  return data as unknown as PostInput;
}
