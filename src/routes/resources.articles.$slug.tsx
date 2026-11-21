import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/articles/$slug")({
  loader: ({ params }) => {
    throw redirect({
      to: "/resources/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
