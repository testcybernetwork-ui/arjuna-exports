import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true }, appType: "custom" });
try {
  const { resourceArticles } = await vite.ssrLoadModule("/src/lib/resource-data.ts");
  const output = path.resolve("src/lib/legacy-resource-articles.json");
  const coverDirectory = path.resolve("public/blog-covers");
  await mkdir(coverDirectory, { recursive: true });
  for (const article of resourceArticles) {
    const extension = path.extname(article.image) || ".jpg";
    const coverName = `resource-${article.slug}${extension}`;
    const imagePath = path.resolve(article.image.replace(/^\/src\//, "src/"));
    const assetDirectory = `${path.resolve("src/assets")}${path.sep}`;
    if (!imagePath.startsWith(assetDirectory)) throw new Error("Unexpected resource image path.");
    await copyFile(imagePath, path.join(coverDirectory, coverName));
    article.image = `/blog-covers/${coverName}`;
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(resourceArticles, null, 2)}\n`, "utf8");
  process.stdout.write(`Exported ${resourceArticles.length} existing resource articles.\n`);
} finally {
  await vite.close();
}
