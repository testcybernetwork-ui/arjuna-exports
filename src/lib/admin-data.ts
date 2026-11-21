import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { currentAdmin } from "@/server/admin-auth.server";

export const hasAdminSession = createServerFn({ method: "GET" }).handler(async () =>
  Boolean(await currentAdmin(getRequest())),
);
