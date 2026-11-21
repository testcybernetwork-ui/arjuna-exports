import Database from "better-sqlite3";
import sanitizeHtml from "sanitize-html";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.resolve(process.env.BLOG_DATA_DIR || path.join(root, "data"));
const source = path.resolve(process.argv[2] || path.join(dataDir, "legacy-content-export.json"));
const mediaDir = path.resolve(process.argv[3] || path.join(root, "..", "cms", "public", "uploads"));
const uploadsDir = path.join(dataDir, "uploads", "blog");
mkdirSync(dataDir, { recursive: true });
mkdirSync(uploadsDir, { recursive: true });

const db = new Database(path.join(dataDir, "blog.sqlite"));
db.exec(`CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '', coverImage TEXT,
  author TEXT, tags TEXT NOT NULL DEFAULT '[]', status TEXT NOT NULL CHECK(status IN ('draft','published')),
  createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, publishedAt TEXT
)`);

function escape(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );
}

function renderText(node) {
  let text = escape(node.text || "");
  for (const mark of node.bold ? ["bold"] : []) text = `<strong>${text}</strong>`;
  for (const mark of node.italic ? ["italic"] : []) text = `<em>${text}</em>`;
  for (const mark of node.underline ? ["underline"] : []) text = `<u>${text}</u>`;
  for (const mark of node.strikethrough ? ["strikethrough"] : []) text = `<s>${text}</s>`;
  for (const mark of node.code ? ["code"] : []) text = `<code>${text}</code>`;
  for (const mark of node.children ? [] : node.marks || []) {
    if (mark.type === "bold") text = `<strong>${text}</strong>`;
    if (mark.type === "italic") text = `<em>${text}</em>`;
    if (mark.type === "underline") text = `<u>${text}</u>`;
    if (mark.type === "strikethrough") text = `<s>${text}</s>`;
    if (mark.type === "code") text = `<code>${text}</code>`;
    if (mark.type === "link" && /^https?:|^mailto:/.test(mark.url || ""))
      text = `<a href="${escape(mark.url)}">${text}</a>`;
  }
  return text;
}

function renderNode(node) {
  if (node.type === "text") return renderText(node);
  const children = (node.children || []).map(renderNode).join("");
  if (node.type === "paragraph") return `<p>${children}</p>`;
  if (node.type === "heading")
    return `<h${Math.max(1, Math.min(3, Number(node.level) || 2))}>${children}</h${Math.max(1, Math.min(3, Number(node.level) || 2))}>`;
  if (node.type === "list")
    return node.format === "ordered" ? `<ol>${children}</ol>` : `<ul>${children}</ul>`;
  if (node.type === "list-item") return `<li>${children}</li>`;
  if (node.type === "quote") return `<blockquote>${children}</blockquote>`;
  if (node.type === "code") return `<pre><code>${children}</code></pre>`;
  if (node.type === "link" && /^https?:|^mailto:/.test(node.url || ""))
    return `<a href="${escape(node.url)}">${children}</a>`;
  if (node.type === "image")
    return `<img src="${escape(node.image?.url || node.url || "")}" alt="${escape(node.image?.alternativeText || "")}">`;
  return children;
}

const sourceData = JSON.parse(readFileSync(source, "utf8").replace(/^\uFEFF/, ""));
const rows = sourceData.data || sourceData;
const importPost = db.prepare(`INSERT OR IGNORE INTO posts
  (id,title,slug,excerpt,content,coverImage,author,tags,status,createdAt,updatedAt,publishedAt)
  VALUES(@id,@title,@slug,@excerpt,@content,@coverImage,@author,@tags,@status,@createdAt,@updatedAt,@publishedAt)`);
const transaction = db.transaction((items) => {
  for (const item of items) {
    let coverImage = null;
    const sourceUrl = item.cover?.url;
    if (sourceUrl) {
      const basename = path.basename(new URL(sourceUrl, "http://localhost").pathname);
      const ext = path.extname(basename).toLowerCase();
      if (
        [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext) &&
        existsSync(path.join(mediaDir, basename))
      ) {
        const filename = `${randomUUID()}${ext}`;
        copyFileSync(path.join(mediaDir, basename), path.join(uploadsDir, filename));
        coverImage = `/api/uploads/blog/${filename}`;
      }
    }
    const html = Array.isArray(item.content)
      ? item.content.map(renderNode).join("\n")
      : String(item.content || "");
    const content = sanitizeHtml(html, {
      allowedTags: [
        "p",
        "h1",
        "h2",
        "h3",
        "ul",
        "ol",
        "li",
        "strong",
        "em",
        "u",
        "s",
        "blockquote",
        "pre",
        "code",
        "a",
        "img",
        "hr",
        "br",
      ],
      allowedAttributes: { a: ["href", "rel"], img: ["src", "alt"] },
      allowedSchemes: ["http", "https", "mailto"],
      allowProtocolRelative: false,
    });
    const publishedAt = item.publishedAt || null;
    importPost.run({
      id: item.documentId || randomUUID(),
      title: item.title || "Untitled",
      slug: item.slug,
      excerpt: item.summary || item.excerpt || "",
      content,
      coverImage,
      author: item.author?.name || item.author || null,
      tags: JSON.stringify(item.tags || (item.category?.name ? [item.category.name] : [])),
      status: publishedAt ? "published" : "draft",
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      publishedAt,
    });
  }
});

transaction(rows);
console.log(
  `Imported ${rows.length} records from ${path.basename(source)} into ${path.join(dataDir, "blog.sqlite")}.`,
);
db.close();
