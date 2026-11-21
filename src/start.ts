import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

const previewNoIndexMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const host = getRequestHost().toLowerCase().split(":")[0] ?? "";
  if (!host.endsWith(".vercel.app")) return result;

  const response = result.response;
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return {
    ...result,
    response: new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    }),
  };
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, csrfMiddleware, previewNoIndexMiddleware],
}));
