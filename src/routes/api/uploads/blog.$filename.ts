import { createFileRoute } from "@tanstack/react-router";
import { readFile } from "node:fs/promises";
import path from "node:path";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export const Route = createFileRoute("/api/uploads/blog/$filename")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!/^[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$/i.test(params.filename))
          return new Response("Not found", { status: 404 });
        const ext = path.extname(params.filename).slice(1).toLowerCase();
        const filename = path.resolve(
          process.env.BLOG_DATA_DIR || path.join(process.cwd(), "data"),
          "uploads",
          "blog",
          params.filename,
        );
        try {
          const bytes = await readFile(filename);
          return new Response(new Uint8Array(bytes), {
            headers: {
              "Content-Type": MIME[ext]!,
              "Cache-Control": "public, max-age=31536000, immutable",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
});
