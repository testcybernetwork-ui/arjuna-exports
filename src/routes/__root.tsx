import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  type ErrorComponentProps,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "../components/site/Header";
import { Footer } from "../components/site/Footer";
import { ImageZoomProvider } from "../components/site/ImageZoom";
import brandLogo from "@/assets/logo.svg?url";
import displayFont from "../BowlbyOne-Regular.ttf";

const siteOrigin = "https://www.arjunaexports.com";
const organizationStructuredData = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteOrigin}/#organization`,
  name: "Arjuna Exports",
  url: `${siteOrigin}/`,
  logo: new URL(brandLogo, siteOrigin).toString(),
  email: "info@arjunaexports.com",
  telephone: ["+919629874555", "+914288250125"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "1/140-12, GM Complex, Opposite TMB Bank",
    addressLocality: "Kumaramangalam",
    addressRegion: "Tamil Nadu",
    postalCode: "637205",
    addressCountry: "IN",
  },
}).replace(/</g, "\\u003c");

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-green-hover active:bg-primary-green-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    const message = error instanceof Error ? error.message : String(error ?? "");
    const isChunkError =
      message.includes("Failed to fetch dynamically imported module") ||
      message.includes("dynamically imported module") ||
      message.includes("Loading chunk") ||
      message.includes("Importing a module script failed");

    if (isChunkError && typeof window !== "undefined") {
      const storageKey = `chunk_reload_${window.location.pathname}`;
      const lastReload = sessionStorage.getItem(storageKey);
      if (!lastReload || Date.now() - Number(lastReload) > 10000) {
        sessionStorage.setItem(storageKey, String(Date.now()));
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              } else {
                router.invalidate();
                reset();
              }
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary-green px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-green-hover active:bg-primary-green-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arjuna Exports | Coco Growing Media from India" },
      {
        name: "description",
        content:
          "Coconut-based growing media, coir products and crop-specific substrates manufactured in Tamil Nadu and exported worldwide.",
      },
      { name: "author", content: "Arjuna Exports" },
      { property: "og:title", content: "Arjuna Exports" },
      {
        property: "og:description",
        content: "Growing beyond boundaries with coconut-based growing media.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      {
        rel: "preload",
        href: displayFont,
        as: "font",
        type: "font/ttf",
        crossOrigin: "anonymous",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationStructuredData }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    const handlePreloadError = () => {
      window.location.reload();
    };
    window.addEventListener("vite:preloadError", handlePreloadError);
    return () => window.removeEventListener("vite:preloadError", handlePreloadError);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ImageZoomProvider>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header overHero />
        <main id="main-content" tabIndex={-1} className="site-compact">
          <Outlet />
        </main>
        <Footer />
      </ImageZoomProvider>
    </QueryClientProvider>
  );
}
