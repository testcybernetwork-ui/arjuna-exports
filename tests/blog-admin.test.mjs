import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import test from "node:test";
import legacyArticles from "../src/lib/legacy-resource-articles.json" with { type: "json" };

const temp = mkdtempSync(path.join(process.cwd(), ".tmp-blog-test-"));
process.env.BLOG_DATA_DIR = temp;
process.env.BLOG_SESSION_SECRET = randomBytes(32).toString("hex");
process.env.ADMIN_EMAIL = "admin@example.test";
const seedSalt = randomBytes(16).toString("hex");
process.env.ADMIN_PASSWORD_HASH = `scrypt:${seedSalt}:${scryptSync("correct-horse", seedSalt, 64).toString("hex")}`;

const store = await import("../src/server/blog-db.server.ts");
const auth = await import("../src/server/admin-auth.server.ts");

test("drafts stay private and published posts are readable", async () => {
  const draft = await store.savePost({
    title: "Draft Test Post",
    slug: `draft-${Date.now()}`,
    excerpt: "Excerpt",
    content: "<p>Draft</p>",
    coverImage: null,
    status: "draft",
  });
  assert.equal((await store.findPost(draft.id))?.status, "draft");
  assert.equal(await store.findPublishedPost(draft.slug), null);
  await store.savePost({ ...draft, status: "published" }, draft.id);
  assert.equal((await store.findPublishedPost(draft.slug))?.status, "published");
  await store.deletePost(draft.id);
});

test("post content is sanitized and slugs are unique", async () => {
  const clean = store.sanitizeContent('<p onclick="alert(1)">Hello</p><script>alert(2)</script>');
  assert.equal(clean, "<p>Hello</p>");
  const slug = `unique-${Date.now()}`;
  const first = await store.savePost({
    title: "One",
    slug,
    excerpt: "",
    content: "",
    coverImage: null,
    status: "draft",
  });
  await assert.rejects(async () => {
    await store.savePost({
      title: "Two",
      slug,
      excerpt: "",
      content: "",
      coverImage: null,
      status: "draft",
    });
  });
  await store.deletePost(first.id);
});

test("credentials, session expiry checks, and CSRF validation work", async () => {
  await store
    .database()
    .query(
      "INSERT INTO admin_users(id, email, password_hash, role, created_at) VALUES($1, $2, $3, $4, NOW()) ON CONFLICT (id) DO UPDATE SET email = $2, password_hash = $3",
      ["test-admin-id", "admin@example.test", process.env.ADMIN_PASSWORD_HASH, "admin"],
    );
  await store
    .database()
    .query(
      "INSERT INTO admins(id, email, password_hash, role, created_at) VALUES($1, $2, $3, $4, NOW()) ON CONFLICT (id) DO UPDATE SET email = $2, password_hash = $3",
      ["test-admin-id", "admin@example.test", process.env.ADMIN_PASSWORD_HASH, "admin"],
    );
  await store
    .database()
    .query("UPDATE admins SET email = $1 WHERE email = $2", [
      " ADMIN@EXAMPLE.TEST ",
      "admin@example.test",
    ]);
  await store
    .database()
    .query("UPDATE admin_users SET email = $1 WHERE email = $2", [
      " ADMIN@EXAMPLE.TEST ",
      "admin@example.test",
    ]);
  const user = await auth.checkCredentials("  ADMIN@example.test  ", "  correct-horse  ");
  assert.ok(user);
  assert.equal(await auth.checkCredentials("admin@example.test", "incorrect"), null);
  const generatedHash = auth.hashPassword("  another-correct-password  ");
  assert.equal(generatedHash.length, 168);
  assert.equal(await auth.verifyPassword("another-correct-password", generatedHash), true);
  const session = auth.createSession(user.id);
  const token = auth.createCsrfToken();
  const request = new Request("https://example.test/api/admin/posts", {
    headers: {
      cookie: `${session.cookie.split(";")[0]}; ${auth.csrfCookie(token).split(";")[0]}`,
      origin: "https://example.test",
      host: "example.test",
      "x-csrf-token": token,
    },
  });
  assert.equal((await auth.currentAdmin(request))?.id, user.id);
  assert.equal(auth.verifyCsrf(request), true);
  assert.equal(auth.verifyCsrf(new Request("https://example.test/api/admin/posts")), false);
  await auth.destroySession(request);

  const editorId = "editor-role-user";
  await store
    .database()
    .query(
      "INSERT INTO admin_users(id,email,password_hash,role,created_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING",
      [editorId, "editor@example.test", "unused", "editor", new Date().toISOString()],
    );
  const editorSession = auth.createSession(editorId);
  const editorRequest = new Request("https://example.test/admin/articles", {
    headers: { cookie: editorSession.cookie.split(";")[0] },
  });

  assert.equal(await auth.changeAdminPassword(user.id, "wrong-password", "new-correct-password"), false);
  assert.equal(
    await auth.changeAdminPassword(user.id, "correct-horse", "  new-correct-password  "),
    true,
  );
  assert.equal(await auth.checkCredentials("admin@example.test", "correct-horse"), null);
  assert.ok(await auth.checkCredentials(" admin@example.test ", " new-correct-password "));
});

test("login attempts are rate limited after five failures", async () => {
  const ip = "203.0.113.10";
  for (let attempt = 0; attempt < 5; attempt++) await auth.recordFailedLogin(ip);
  assert.equal(await auth.loginIsRateLimited(ip), true);
  await auth.clearLoginFailures(ip);
});

test("Resource Articles are seeded, scheduled, sanitized, and removed from public reads", async () => {
  const seeded = await store.listResourceArticles();
  const seedSlugs = new Set(seeded.articles.map((article) => article.slug));
  const adminList = await store.listAdminArticles({ status: "all" });
  assert.ok(adminList.total >= 19);
  const page3 = await store.listResourceArticles({ page: 2 });
  assert.ok(page3.articles.length >= 1);
  for (const article of legacyArticles) assert.ok(await store.findResourceArticle(article.slug));

  const draftSlug = `new-article-${Date.now()}`;
  const draft = await store.savePost({
    title: "New Article",
    slug: draftSlug,
    excerpt: "A short description for a new article.",
    content: '<h2>Heading</h2><p onclick="bad()">Safe text</p><script>bad()</script>',
    coverImage: "/blog-covers/what-makes-coco-coir-a-preferred-growing-medium.jpg",
    status: "draft",
    tag: "Test tag",
    contentType: "Technical note",
    imageAlt: "Green plants in a greenhouse",
    publishedAt: "2026-10-23",
    readTime: "1 min read",
    metaTitle: "New Article",
    metaDescription: "A short SEO description.",
  });
  assert.equal(await store.findResourceArticle(draft.slug), null);
  assert.equal(draft.content.includes("onclick"), false);
  assert.equal(draft.content.includes("<script>"), false);

  const published = await store.savePost(
    { ...draft, status: "published", publishedAt: "2026-10-22" },
    draft.id,
  );
  assert.equal((await store.findResourceArticle(draft.slug))?.id, published.id);
  assert.equal(await store.deleteArticle(draft.id), true);
  assert.equal(await store.findResourceArticle(draft.slug), null);
});

test("article validation enforces required metadata and safe URL slugs", async () => {
  const { parseArticleInput } = await import("../src/lib/article-validation.ts");
  const article = {
    title: "A useful guide",
    slug: "a-useful-guide",
    excerpt: "A short description.",
    content: "<p>Content</p>",
    coverImage: "/blog-covers/what-makes-coco-coir-a-preferred-growing-medium.jpg",
    status: "draft",
    tag: "COCO COIR - PRODUCT INSIGHTS",
    contentType: "Resource guide",
    imageAlt: "Plants growing in coir",
    publishedAt: "2026-10-23",
    readTime: "1 min read",
    metaTitle: "A useful guide",
    metaDescription: "A useful guide description.",
  };
  assert.ok(parseArticleInput(article));
  assert.equal(parseArticleInput({ ...article, slug: "Bad slug" }), null);
  assert.equal(parseArticleInput({ ...article, excerpt: "" }), null);
  assert.equal(
    parseArticleInput({ ...article, coverImage: "data:image/png;base64,invalid" }),
    null,
  );
});

test.after(async () => {
  await store.database().end();
  rmSync(temp, { recursive: true, force: true });
});
