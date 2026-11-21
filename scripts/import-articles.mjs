import { copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import sanitizeHtml from "sanitize-html";

const dataDirectory = path.resolve(process.env.BLOG_DATA_DIR || "data");
const sourcePath = path.join(dataDirectory, "articles-import.json");
const database = new Database(path.join(dataDirectory, "blog.sqlite"));
const source = (await readFile(sourcePath, "utf8")).replace(/^\uFEFF/, "");
const articles = JSON.parse(source);
const publicDirectory = path.resolve("public/blog-covers");

async function copyCover(sourceRelativePath, publicPath) {
  const sourcePath = path.resolve(sourceRelativePath);
  const assetDirectory = path.resolve("src/assets") + path.sep;
  if (!sourcePath.startsWith(assetDirectory) || !publicPath.startsWith("/blog-covers/")) {
    throw new Error("Article cover paths must point to a site asset and /blog-covers/ URL.");
  }
  await mkdir(publicDirectory, { recursive: true });
  await copyFile(sourcePath, path.join(publicDirectory, path.basename(publicPath)));
}

const legacyCovers = [
  {
    slug: "circular-growing-with-coir",
    source: "src/assets/stage-coconut.jpg",
    publicPath: "/blog-covers/circular-growing-with-coir.jpg",
  },
  {
    slug: "coconut-husk-to-growing-media",
    source: "src/assets/stage-medium.jpg",
    publicPath: "/blog-covers/coconut-husk-to-growing-media.jpg",
  },
];

for (const article of articles) await copyCover(article.imageSource, article.coverImage);
for (const cover of legacyCovers) await copyCover(cover.source, cover.publicPath);

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const insert = database.prepare(`
  INSERT OR IGNORE INTO posts
    (id,title,slug,excerpt,content,coverImage,author,tags,status,createdAt,updatedAt,publishedAt)
  VALUES (?,?,?,?,?,?,NULL,?,'published',?,?,?)
`);
const updateCover = database.prepare("UPDATE posts SET coverImage=? WHERE slug=?");
const importArticles = database.transaction(() => {
  let added = 0;
  const now = new Date().toISOString();
  for (const article of articles) {
    let slug = slugify(article.title);
    const paragraphs = article.paragraphs.filter(({ text }) => text.trim());
    const excerptSource =
      paragraphs.find(({ text }) => text.length >= 70 && !/^reading time:/i.test(text))?.text ||
      article.title;
    const excerpt =
      excerptSource.length > 230 ? `${excerptSource.slice(0, 227).trim()}…` : excerptSource;

    let html = "";
    let inList = false;
    for (const paragraph of paragraphs) {
      const text = escapeHtml(paragraph.text);
      if (paragraph.bullet) {
        if (!inList) html += "<ul>";
        html += `<li>${text}</li>`;
        inList = true;
        continue;
      }
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const tag = paragraph.style === "Heading3" ? "h2" : "p";
      html += `<${tag}>${text}</${tag}>`;
    }
    if (inList) html += "</ul>";
    html = sanitizeHtml(html);

    const result = insert.run(
      randomUUID(),
      article.title,
      slug,
      excerpt,
      html,
      article.coverImage,
      JSON.stringify([article.category]),
      now,
      now,
      now,
    );
    if (result.changes) added += 1;
    else if (database.prepare("SELECT 1 FROM posts WHERE slug=?").get(slug)) {
      updateCover.run(article.coverImage, slug);
      console.log(`Skipped existing article: ${article.title}`);
    } else {
      let suffix = 2;
      while (database.prepare("SELECT 1 FROM posts WHERE slug=?").get(`${slug}-${suffix}`))
        suffix += 1;
      slug = `${slug}-${suffix}`;
      insert.run(
        randomUUID(),
        article.title,
        slug,
        excerpt,
        html,
        article.coverImage,
        JSON.stringify([article.category]),
        now,
        now,
        now,
      );
      added += 1;
    }
  }
  for (const cover of legacyCovers) updateCover.run(cover.publicPath, cover.slug);
  return added;
});

console.log(
  `Imported ${importArticles()} published articles (${articles.length} found in the source).`,
);
database.close();
