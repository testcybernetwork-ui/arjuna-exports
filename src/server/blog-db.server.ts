import "@tanstack/react-start/server-only";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { query, ensureSchema, getDbPool } from "./db.server.ts";

export type PostStatus = "draft" | "published";
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string | null;
  tags: string[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  tag: string;
  contentType: string;
  imageAlt: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  isArticle: number;
  legacySlug: string | null;
};

export type PostInput = Pick<
  BlogPost,
  "title" | "slug" | "excerpt" | "content" | "coverImage" | "status"
> &
  Partial<
    Pick<
      BlogPost,
      | "tag"
      | "contentType"
      | "imageAlt"
      | "readTime"
      | "metaTitle"
      | "metaDescription"
      | "publishedAt"
      | "isArticle"
      | "author"
      | "tags"
      | "legacySlug"
    >
  >;

export function blogDatabasePath(): string {
  return "Neon PostgreSQL (Cloud Managed)";
}

export function database() {
  return getDbPool();
}

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
      "pre",
      "code",
      "strong",
      "em",
      "u",
      "s",
      "a",
      "img",
      "br",
      "hr",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const LEGACY_SLUG_ALIASES: Record<string, string> = {
  "what-s-the-real-difference-between-coco-peat-coco-hush-chips-and-coco-fibre":
    "what-s-the-real-difference-between-coco-peat-coco-husk-chips-and-coco-fibre",
  "why-more-professional-growers-are-adding-coco-hush-chips-to-their-substrate-mix":
    "why-more-professional-growers-are-adding-coconut-husk-chips-to-their-substrate-mix",
  "coco-hush-chips-vs-perlite-vs-wood-bark-what-actually-performs-better":
    "husk-chips-vs-perlite-vs-wood-bark-what-actually-performs-better",
};

function mapRow(row: Record<string, unknown>): BlogPost {
  let tags: string[] = [];
  if (Array.isArray(row.tags)) {
    tags = row.tags as string[];
  } else if (typeof row.tags === "string") {
    try {
      tags = JSON.parse(row.tags);
    } catch {
      tags = [row.tags];
    }
  }

  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at || row.createdAt || new Date().toISOString());

  const updatedAt =
    row.updated_at instanceof Date
      ? row.updated_at.toISOString()
      : String(row.updated_at || row.updatedAt || createdAt);

  const publishedAt = row.published_at
    ? row.published_at instanceof Date
      ? row.published_at.toISOString()
      : String(row.published_at)
    : row.publishedAt
      ? String(row.publishedAt)
      : null;

  return {
    id: String(row.id),
    title: String(row.title || ""),
    slug: String(row.slug || ""),
    excerpt: String(row.excerpt || ""),
    content: String(row.content || ""),
    coverImage: (row.cover_image as string) ?? (row.coverImage as string) ?? null,
    author: (row.author as string) ?? null,
    tags,
    status: (row.status === "published" ? "published" : "draft") as PostStatus,
    createdAt,
    updatedAt,
    publishedAt,
    tag: String(row.tag || ""),
    contentType: String(row.content_type || row.contentType || "Resource guide"),
    imageAlt: String(row.image_alt || row.imageAlt || ""),
    readTime: String(row.read_time || row.readTime || ""),
    metaTitle: String(row.meta_title || row.metaTitle || ""),
    metaDescription: String(row.meta_description || row.metaDescription || ""),
    isArticle: Number(row.is_article ?? row.isArticle ?? 0),
    legacySlug: (row.legacy_slug as string) ?? (row.legacySlug as string) ?? null,
  };
}

let seedInitialized = false;

export async function ensureInitialPosts(): Promise<void> {
  if (seedInitialized) return;
  await ensureSchema();
  seedInitialized = true;

  try {
    const res = await query<{ count: string | number }>("SELECT COUNT(*) AS count FROM posts");
    const count = Number(res.rows[0]?.count || 0);
    if (count > 0) return;

    console.log("[neon-db] Seeding initial posts into Neon database...");
    const posts: Array<{
      id: string;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      coverImage: string | null;
      tags: string[];
      status: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      tag: string;
      contentType: string;
      imageAlt: string;
      readTime: string;
      metaTitle: string;
      metaDescription: string;
      isArticle: number;
    }> = [];

    const now = new Date().toISOString();

    // 1. Try legacy-content-export.json
    try {
      const legacyPath = path.resolve(process.cwd(), "data", "legacy-content-export.json");
      if (existsSync(legacyPath)) {
        const raw = readFileSync(legacyPath, "utf8").replace(/^\uFEFF/, "");
        const json = JSON.parse(raw);
        const rows = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
        for (const item of rows) {
          const title = String(item.title || "Untitled");
          const slug = String(item.slug || slugify(title));
          const excerpt = String(item.excerpt || "");
          const content =
            typeof item.content === "string" ? item.content : JSON.stringify(item.content);
          posts.push({
            id: String(item.id || randomUUID()),
            title,
            slug,
            excerpt,
            content: sanitizeContent(content),
            coverImage: null,
            tags: Array.isArray(item.tags) ? item.tags : ["Articles"],
            status: "published",
            createdAt: String(item.createdAt || now),
            updatedAt: String(item.updatedAt || now),
            publishedAt: String(item.publishedAt || now),
            tag: "Articles",
            contentType: "Resource guide",
            imageAlt: title,
            readTime: "5 min read",
            metaTitle: title,
            metaDescription: excerpt.slice(0, 160),
            isArticle: 1,
          });
        }
      }
    } catch (e) {
      console.warn("[neon-db] Could not read legacy content export:", e);
    }

    // 2. Try articles-import.json
    try {
      const importPath = path.resolve(process.cwd(), "data", "articles-import.json");
      if (existsSync(importPath)) {
        const raw = readFileSync(importPath, "utf8").replace(/^\uFEFF/, "");
        const items = JSON.parse(raw);
        for (const article of items) {
          const title = String(article.title || "");
          const slug = slugify(title);
          if (posts.some((p) => p.slug === slug)) continue;
          const paragraphs = (article.paragraphs || []).filter(
            (p: { text?: string }) => p.text && p.text.trim(),
          );
          const excerptSource =
            paragraphs.find(
              (p: { text: string }) => p.text.length >= 70 && !/^reading time:/i.test(p.text),
            )?.text || title;
          const excerpt =
            excerptSource.length > 230 ? `${excerptSource.slice(0, 227).trim()}…` : excerptSource;

          const html = paragraphs
            .map((p: { text: string; style?: string }) => {
              const tag = p.style === "Heading3" ? "h2" : "p";
              return `<${tag}>${sanitizeHtml(p.text)}</${tag}>`;
            })
            .join("\n");

          posts.push({
            id: randomUUID(),
            title,
            slug,
            excerpt,
            content: sanitizeContent(html),
            coverImage: article.coverImage || null,
            tags: [String(article.category || "Articles")],
            status: "published",
            createdAt: now,
            updatedAt: now,
            publishedAt: now,
            tag: String(article.category || "Articles"),
            contentType: "Resource guide",
            imageAlt: title,
            readTime: "4 min read",
            metaTitle: title,
            metaDescription: excerpt.slice(0, 160),
            isArticle: 1,
          });
        }
      }
    } catch (e) {
      console.warn("[neon-db] Could not read articles import:", e);
    }

    for (const post of posts) {
      await query(
        `INSERT INTO posts (
          id, title, slug, excerpt, content, cover_image, tags, status,
          created_at, updated_at, published_at, tag, content_type, image_alt,
          read_time, meta_title, meta_description, is_article
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
        ON CONFLICT (slug) DO NOTHING`,
        [
          post.id,
          post.title,
          post.slug,
          post.excerpt,
          post.content,
          post.coverImage,
          JSON.stringify(post.tags),
          post.status,
          post.createdAt,
          post.updatedAt,
          post.publishedAt,
          post.tag,
          post.contentType,
          post.imageAlt,
          post.readTime,
          post.metaTitle,
          post.metaDescription,
          post.isArticle,
        ],
      );
    }
    console.log(`[neon-db] Seeded ${posts.length} articles into Neon.`);
  } catch (err) {
    console.error("[neon-db] Error ensuring initial posts:", err);
  }
}

export async function listAdminArticles(
  options: {
    status?: "draft" | "published" | "all";
    query?: string;
    tag?: string;
    sort?: "date" | "title";
    page?: number;
    pageSize?: number;
  } = {},
): Promise<{
  articles: BlogPost[];
  total: number;
  page: number;
  pageCount: number;
  tags: string[];
}> {
  await ensureInitialPosts();
  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (options.status && options.status !== "all") {
    params.push(options.status);
    conditions.push(`status = $${params.length}`);
  }

  if (options.query && options.query.trim()) {
    params.push(`%${options.query.trim()}%`);
    conditions.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
  }

  if (options.tag && options.tag.trim()) {
    params.push(options.tag.trim());
    conditions.push(
      `(tag = $${params.length} OR tags::text ILIKE '%' || $${params.length} || '%')`,
    );
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderClause =
    options.sort === "title" ? "ORDER BY title ASC" : "ORDER BY created_at DESC, id DESC";

  // Total count
  const countRes = await query<{ count: string | number }>(
    `SELECT COUNT(*) AS count FROM posts ${whereClause}`,
    params,
  );
  const total = Number(countRes.rows[0]?.count || 0);

  // Paginated articles
  const listParams = [...params, pageSize, offset];
  const listRes = await query(
    `SELECT * FROM posts ${whereClause} ${orderClause} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    listParams,
  );

  const articles = listRes.rows.map(mapRow);
  const pageCount = Math.ceil(total / pageSize);
  const tags = await listArticleTags();

  return { articles, total, page, pageCount, tags };
}

export async function listResourceArticles(
  options: { page?: number; pageSize?: number; tag?: string; query?: string } = {},
): Promise<{
  articles: BlogPost[];
  total: number;
  page: number;
  pageCount: number;
}> {
  await ensureInitialPosts();
  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize || 12;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ["status = 'published'"];
  const params: unknown[] = [];

  if (options.query && options.query.trim()) {
    params.push(`%${options.query.trim()}%`);
    conditions.push(`(title ILIKE $${params.length} OR excerpt ILIKE $${params.length})`);
  }

  if (options.tag && options.tag.trim()) {
    params.push(options.tag.trim());
    conditions.push(
      `(tag = $${params.length} OR tags::text ILIKE '%' || $${params.length} || '%')`,
    );
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const countRes = await query<{ count: string | number }>(
    `SELECT COUNT(*) AS count FROM posts ${whereClause}`,
    params,
  );
  const total = Number(countRes.rows[0]?.count || 0);

  const listParams = [...params, pageSize, offset];
  const listRes = await query(
    `SELECT * FROM posts ${whereClause} ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    listParams,
  );

  return {
    articles: listRes.rows.map(mapRow),
    total,
    page,
    pageCount: Math.ceil(total / pageSize),
  };
}

export async function listPublishedPosts(page = 1, pageSize = 12) {
  const result = await listResourceArticles({ page, pageSize });
  return { posts: result.articles, ...result };
}

export async function listPosts(
  options: {
    status?: "draft" | "published" | "all";
    query?: string;
    page?: number;
    pageSize?: number;
  } = {},
) {
  const res = await listAdminArticles(options);
  return { posts: res.articles, ...res };
}

export async function findArticleById(id: string): Promise<BlogPost | null> {
  await ensureInitialPosts();
  const res = await query("SELECT * FROM posts WHERE id = $1", [id]);
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export async function findPost(id: string): Promise<BlogPost | null> {
  return findArticleById(id);
}

export async function findResourceArticle(slug: string): Promise<BlogPost | null> {
  await ensureInitialPosts();
  const normalized = slugify(slug);
  const alias = LEGACY_SLUG_ALIASES[normalized] || normalized;
  const res = await query(
    "SELECT * FROM posts WHERE (slug = $1 OR legacy_slug = $1 OR slug = $2 OR legacy_slug = $2) AND status = 'published' LIMIT 1",
    [normalized, alias],
  );
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export async function findPublishedPost(slug: string): Promise<BlogPost | null> {
  return findResourceArticle(slug);
}

export async function savePost(input: PostInput, id?: string): Promise<BlogPost> {
  await ensureInitialPosts();
  const targetId = id || randomUUID();
  const slug = slugify(input.slug || input.title);
  const title = input.title.trim();
  const excerpt = (input.excerpt || "").trim();
  const content = sanitizeContent(input.content || "");
  const coverImage = input.coverImage || null;
  const status: PostStatus = input.status === "published" ? "published" : "draft";
  const now = new Date();
  const publishedAt =
    status === "published" ? (input.publishedAt ? new Date(input.publishedAt) : now) : null;

  const tag = input.tag || "";
  const contentType = input.contentType || "Resource guide";
  const imageAlt = input.imageAlt || title;
  const readTime = input.readTime || "4 min read";
  const metaTitle = input.metaTitle || title;
  const metaDescription = input.metaDescription || excerpt.slice(0, 160);
  const isArticle = input.isArticle !== undefined ? Number(input.isArticle) : 1;
  const author = input.author || null;
  const tags = JSON.stringify(Array.isArray(input.tags) ? input.tags : [tag || "Articles"]);
  const legacySlug = input.legacySlug || null;

  const res = await query(
    `
    INSERT INTO posts (
      id, title, slug, excerpt, content, cover_image, author, tags, status,
      created_at, updated_at, published_at, tag, content_type, image_alt,
      read_time, meta_title, meta_description, is_article, legacy_slug
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      slug = EXCLUDED.slug,
      excerpt = EXCLUDED.excerpt,
      content = EXCLUDED.content,
      cover_image = EXCLUDED.cover_image,
      author = EXCLUDED.author,
      tags = EXCLUDED.tags,
      status = EXCLUDED.status,
      updated_at = EXCLUDED.updated_at,
      published_at = CASE
        WHEN EXCLUDED.status = 'published' AND posts.published_at IS NULL THEN EXCLUDED.published_at
        WHEN EXCLUDED.status = 'draft' THEN NULL
        ELSE posts.published_at
      END,
      tag = EXCLUDED.tag,
      content_type = EXCLUDED.content_type,
      image_alt = EXCLUDED.image_alt,
      read_time = EXCLUDED.read_time,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      is_article = EXCLUDED.is_article,
      legacy_slug = EXCLUDED.legacy_slug
    RETURNING *;
    `,
    [
      targetId,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      tags,
      status,
      now,
      now,
      publishedAt,
      tag,
      contentType,
      imageAlt,
      readTime,
      metaTitle,
      metaDescription,
      isArticle,
      legacySlug,
    ],
  );

  return mapRow(res.rows[0]);
}

export async function deleteArticle(id: string): Promise<boolean> {
  await ensureInitialPosts();
  const res = await query("DELETE FROM posts WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function deletePost(id: string): Promise<boolean> {
  return deleteArticle(id);
}

export async function updatePostStatus(id: string, status: PostStatus): Promise<BlogPost | null> {
  await ensureInitialPosts();
  const now = new Date();
  const publishedAt = status === "published" ? now : null;

  const res = await query(
    `UPDATE posts
     SET status = $1,
         published_at = CASE WHEN $1 = 'published' AND published_at IS NULL THEN $2 WHEN $1 = 'draft' THEN NULL ELSE published_at END,
         updated_at = $2
     WHERE id = $3
     RETURNING *`,
    [status, now, id],
  );
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export async function getAdminArticleSummary(): Promise<{
  total: number;
  published: number;
  drafts: number;
  articles: BlogPost[];
  recent: BlogPost[];
}> {
  await ensureInitialPosts();
  const totalRes = await query<{ count: string | number }>("SELECT COUNT(*) AS count FROM posts");
  const publishedRes = await query<{ count: string | number }>(
    "SELECT COUNT(*) AS count FROM posts WHERE status = 'published'",
  );
  const draftsRes = await query<{ count: string | number }>(
    "SELECT COUNT(*) AS count FROM posts WHERE status = 'draft'",
  );
  const recentRes = await query("SELECT * FROM posts ORDER BY created_at DESC LIMIT 5");

  const mappedRecent = recentRes.rows.map(mapRow);
  return {
    total: Number(totalRes.rows[0]?.count || 0),
    published: Number(publishedRes.rows[0]?.count || 0),
    drafts: Number(draftsRes.rows[0]?.count || 0),
    articles: mappedRecent,
    recent: mappedRecent,
  };
}

export async function listArticleTags(): Promise<string[]> {
  await ensureInitialPosts();
  try {
    const res = await query<{ tag: string }>(
      "SELECT DISTINCT tag FROM posts WHERE tag IS NOT NULL AND tag != '' ORDER BY tag ASC",
    );
    const tags = res.rows.map((r) => r.tag);
    if (!tags.includes("Articles")) tags.unshift("Articles");
    return Array.from(new Set(tags));
  } catch {
    return ["Articles"];
  }
}
