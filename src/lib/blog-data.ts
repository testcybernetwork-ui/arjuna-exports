import { createServerFn } from "@tanstack/react-start";
import { findPublishedPost, listPublishedPosts } from "@/server/blog-db.server";

export const getPublishedPosts = createServerFn({ method: "GET" }).handler(async () =>
  listPublishedPosts(1, 100),
);

export const getPublishedPost = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => findPublishedPost(slug));
