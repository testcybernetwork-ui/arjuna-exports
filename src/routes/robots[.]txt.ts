import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const host = new URL(request.url).hostname.toLowerCase();
        const preview = host.endsWith(".vercel.app");
        const content = preview
          ? "User-agent: *\nDisallow: /\n"
          : [
              "User-agent: *",
              "Allow: /",
              "Disallow: /admin",
              "",
              "Sitemap: https://www.arjunaexports.com/sitemap.xml",
              "",
            ].join("\n");

        return new Response(content, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=300",
          },
        });
      },
    },
  },
});
