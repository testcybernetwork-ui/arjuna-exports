import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { currentAdmin, getCorsHeaders, verifyCsrf } from "@/server/admin-auth.server";

const TYPES = new Map([
  [
    "image/jpeg",
    { ext: "jpg", signature: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  ],
  [
    "image/png",
    {
      ext: "png",
      signature: (b: Buffer) =>
        b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    },
  ],
  [
    "image/webp",
    {
      ext: "webp",
      signature: (b: Buffer) =>
        b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
    },
  ],
]);

export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(request),
        });
      },
      POST: async ({ request }) => {
        const cors = getCorsHeaders(request);
        if (!verifyCsrf(request)) {
          return Response.json({ error: "Invalid request" }, { status: 403, headers: cors });
        }
        const admin = await currentAdmin(request);
        if (!admin) {
          return Response.json({ error: "Unauthorized" }, { status: 401, headers: cors });
        }
        const form = await request.formData().catch(() => null);
        const file = form?.get("file");
        if (!(file instanceof File) || file.size < 1 || file.size > 2 * 1024 * 1024) {
          return Response.json({ error: "Choose an image smaller than 2 MB." }, { status: 400, headers: cors });
        }
        const spec = TYPES.get(file.type);
        const bytes = Buffer.from(await file.arrayBuffer());
        if (!spec || !spec.signature(bytes)) {
          return Response.json({ error: "Use a valid JPG, PNG, or WebP image." }, { status: 400, headers: cors });
        }
        const filename = `${randomUUID()}.${spec.ext}`;
        const directory = path.resolve(
          process.env.BLOG_DATA_DIR || path.join(process.cwd(), "data"),
          "uploads",
          "blog",
        );
        await mkdir(directory, { recursive: true });
        await writeFile(path.join(directory, filename), bytes, { flag: "wx" });
        return Response.json({ url: `/api/uploads/blog/${filename}` }, { status: 201, headers: cors });
      },
    },
  },
});
