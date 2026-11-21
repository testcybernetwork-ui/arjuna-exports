import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  img,
  industrySolutions,
  processStages,
  products,
  transformationStages,
} from "@/lib/site-data";
import { ProductCard } from "@/components/site/ProductCard";
import { pageMeta } from "@/components/site/PageHero";
import {
  ChapterHeading,
  ContentTodo,
  Label,
  PrimaryButton,
  Reveal,
  SecondaryButton,
  TextLink,
} from "@/components/site/primitives";
import { CustomerJourney } from "@/components/site/CustomerJourney";
import { resourceArticles, type ResourceArticle } from "@/lib/resource-data";
import logo from "@/assets/logo.svg";
import heroPlantationWebp from "@/assets/hero-plantation.webp";
import heroVideo from "@/assets/hero-video.mp4";

export const Route = createFileRoute("/")({
  loader: () => resourceArticles.slice(0, 8),
  head: () => {
    const metadata = pageMeta(
      "Coco Coir Growing Media",
      "Coconut-based growing media and coir products for professional growers and exporters.",
      "/",
      heroPlantationWebp,
    );
    return {
      ...metadata,
      links: [...metadata.links, { rel: "preload", as: "image", href: heroPlantationWebp }],
    };
  },
  component: Home,
});

function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollProducts = (direction: number) => {
    const card = trackRef.current?.querySelector(".product-card");
    const step = card ? card.getBoundingClientRect().width + 24 : 352;
    trackRef.current?.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <div className="mt-8" role="region" aria-label="Featured products">
      <div
        ref={trackRef}
        className="product-carousel-track flex items-stretch gap-6 overflow-x-auto pb-4"
      >
        {products.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index} variant="carousel" />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-3" role="group" aria-label="Carousel controls">
        <button
          type="button"
          className="product-carousel-arrow"
          onClick={() => scrollProducts(-1)}
          aria-label="Previous products"
        >
          ←
        </button>
        <button
          type="button"
          className="product-carousel-arrow"
          onClick={() => scrollProducts(1)}
          aria-label="Next products"
        >
          →
        </button>
      </div>
    </div>
  );
}

function ArticlesCarousel({ articles }: { articles: ResourceArticle[] }) {
  return (
    <div className="running-carousel mt-12" aria-label="Latest articles">
      <div className="running-carousel-track running-carousel-track--articles">
        {[false, true].map((duplicate) => (
          <div
            key={duplicate ? "articles-copy" : "articles"}
            className="flex gap-6 pr-6"
            aria-hidden={duplicate || undefined}
          >
            {articles.map((article) => (
              <Link
                key={article.slug}
                to="/resources/$slug"
                params={{ slug: article.slug }}
                tabIndex={duplicate ? -1 : undefined}
                className="group flex w-[min(84vw,23rem)] shrink-0 flex-col overflow-hidden rounded-sm border border-brand/20 bg-pure-white shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[16/10] overflow-hidden bg-brand-soft">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[.08em] text-brand">
                    <span className="line-clamp-1">{article.category}</span>
                    <span className="shrink-0 text-charcoal/55">{article.read}</span>
                  </div>
                  <h3 className="display mt-4 text-2xl leading-tight transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                  <span className="mt-auto pt-4 text-xs font-bold uppercase tracking-[.14em] text-brand">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const homeIndustrySolutions = [
  "Professional Horticulture",
  "Greenhouse Growers",
  "Plant Propagation",
  "Substrate Manufacturers",
].map((title) => industrySolutions.find((solution) => solution.title === title)!);

function Home() {
  const articles = Route.useLoaderData();
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [playHeroVideo, setPlayHeroVideo] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlaybackPreference = () => {
      const connection = (
        navigator as Navigator & {
          connection?: { effectiveType?: string; saveData?: boolean };
        }
      ).connection;
      const slowConnection =
        connection?.saveData ||
        connection?.effectiveType === "slow-2g" ||
        connection?.effectiveType === "2g";
      setPlayHeroVideo(window.innerWidth >= 768 && !reducedMotion.matches && !slowConnection);
    };

    updatePlaybackPreference();
    reducedMotion.addEventListener("change", updatePlaybackPreference);
    window.addEventListener("resize", updatePlaybackPreference, { passive: true });
    return () => {
      reducedMotion.removeEventListener("change", updatePlaybackPreference);
      window.removeEventListener("resize", updatePlaybackPreference);
    };
  }, []);

  const setHeroVideoSpeed = () => {
    if (heroVideoRef.current) heroVideoRef.current.playbackRate = 1 / 1.5;
  };

  return (
    <>
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="container home-hero__content">
          <Label className="mb-6 text-[#b9e5c3]">Arjuna Exports · India</Label>
          <h1 id="home-hero-title" className="home-hero__title display">
            <span className="home-hero__title-line">FROM THE COCONUT HUSK</span>
            <span className="home-hero__title-line home-hero__title-line--accent">
              TO BETTER GROWING MEDIA
            </span>
          </h1>
          <p>
            Premium coconut-based growing media for professional growers, commercial horticulture,
            and substrate businesses across global markets.
          </p>
          <div className="home-hero__actions">
            <PrimaryButton to="/contact">Request a quote</PrimaryButton>
            <SecondaryButton to="/products" onDark>
              Explore products
            </SecondaryButton>
          </div>
        </div>
        <div className="home-hero__image-wrap">
          <img
            src={heroPlantationWebp}
            alt="Coconut plantation and export operations"
            fetchPriority="high"
            decoding="async"
          />
          <video
            ref={heroVideoRef}
            className="home-hero__video motion-reduce:hidden"
            autoPlay={playHeroVideo}
            muted
            loop
            playsInline
            preload={playHeroVideo ? "metadata" : "none"}
            poster={heroPlantationWebp}
            aria-hidden="true"
            tabIndex={-1}
            onLoadedMetadata={setHeroVideoSpeed}
            onPlay={setHeroVideoSpeed}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <span className="home-hero__image-caption">Rooted in nature. Ready for the world.</span>
        </div>
      </section>
      <section className="hero-stats-strip" aria-label="Arjuna Exports at a glance">
        <div className="container hero-stats-strip__inner">
        {/* Column 1 — Established */}
        <div className="hero-stats-strip__col">
          <svg
            className="hero-stats-strip__icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 52V36l8-5v5l8-5v5l8-5v22H20Z"
              stroke="#0B4450"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M44 31V22h5v30"
              stroke="#0B4450"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect x="25" y="40" width="5" height="5" rx="0.5" stroke="#0B4450" strokeWidth="1.6" />
            <rect x="33" y="40" width="5" height="5" rx="0.5" stroke="#0B4450" strokeWidth="1.6" />
            <rect x="25" y="47" width="5" height="5" rx="0.5" stroke="#0B4450" strokeWidth="1.6" />
            <path
              d="M16 56c4-3 8-5 16-5s12 2 16 5"
              stroke="#0B4450"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M22 58c3-2 6-3 10-3s7 1 10 3"
              stroke="#0B4450"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="hero-stats-strip__number">2019</span>
          <span className="hero-stats-strip__label">Established</span>
        </div>

        {/* Column 2 — Product range */}
        <div className="hero-stats-strip__col">
          <svg
            className="hero-stats-strip__icon"
            viewBox="0 0 104 53"
            fill="#0B4450"
            fillRule="evenodd"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M2.0 24.0 L2.0 21.0 L3.0 21.0 L3.0 10.0 L4.0 10.0 L4.0 1.0 L8.0 1.0 L8.0 2.0 L12.0 2.0 L12.0 3.0 L17.0 3.0 L17.0 4.0 L22.0 4.0 L22.0 5.0 L26.0 5.0 L26.0 6.0 L29.0 6.0 L29.0 7.0 L34.0 7.0 L34.0 6.0 L38.0 6.0 L38.0 5.0 L43.0 5.0 L43.0 4.0 L46.0 4.0 L46.0 3.0 L50.0 3.0 L50.0 2.0 L61.0 2.0 L61.0 3.0 L64.0 3.0 L64.0 4.0 L67.0 4.0 L67.0 5.0 L71.0 5.0 L71.0 6.0 L74.0 6.0 L74.0 7.0 L75.0 7.0 L75.0 6.0 L77.0 6.0 L77.0 5.0 L80.0 5.0 L80.0 4.0 L84.0 4.0 L84.0 3.0 L88.0 3.0 L88.0 2.0 L94.0 2.0 L94.0 1.0 L101.0 1.0 L101.0 12.0 L102.0 12.0 L102.0 34.0 L103.0 34.0 L103.0 36.0 L91.0 36.0 L91.0 37.0 L81.0 37.0 L81.0 35.0 L79.0 35.0 L79.0 36.0 L77.0 36.0 L77.0 39.0 L76.0 39.0 L76.0 41.0 L72.0 41.0 L72.0 40.0 L71.0 40.0 L71.0 44.0 L70.0 44.0 L70.0 45.0 L69.0 45.0 L69.0 46.0 L66.0 46.0 L66.0 45.0 L63.0 45.0 L63.0 47.0 L62.0 47.0 L62.0 48.0 L59.0 48.0 L59.0 49.0 L58.0 49.0 L58.0 50.0 L57.0 50.0 L57.0 51.0 L54.0 51.0 L54.0 50.0 L51.0 50.0 L51.0 51.0 L49.0 51.0 L49.0 52.0 L47.0 52.0 L47.0 51.0 L45.0 51.0 L45.0 48.0 L44.0 48.0 L44.0 49.0 L41.0 49.0 L41.0 48.0 L40.0 48.0 L40.0 47.0 L39.0 47.0 L39.0 45.0 L37.0 45.0 L37.0 46.0 L36.0 46.0 L36.0 45.0 L34.0 45.0 L34.0 44.0 L33.0 44.0 L33.0 41.0 L29.0 41.0 L29.0 40.0 L28.0 40.0 L28.0 38.0 L27.0 38.0 L27.0 37.0 L26.0 37.0 L26.0 36.0 L24.0 36.0 L24.0 35.0 L23.0 35.0 L23.0 36.0 L20.0 36.0 L20.0 37.0 L14.0 37.0 L14.0 36.0 L3.0 36.0 L3.0 35.0 L1.0 35.0 L1.0 33.0 L2.0 33.0 L2.0 24.0 Z M47.0 7.0 L46.0 7.0 L46.0 8.0 L45.0 8.0 L45.0 9.0 L43.0 9.0 L43.0 11.0 L42.0 11.0 L42.0 12.0 L41.0 12.0 L41.0 13.0 L40.0 13.0 L40.0 14.0 L39.0 14.0 L39.0 16.0 L38.0 16.0 L38.0 20.0 L44.0 20.0 L44.0 19.0 L46.0 19.0 L46.0 18.0 L47.0 18.0 L47.0 17.0 L48.0 17.0 L48.0 16.0 L50.0 16.0 L50.0 15.0 L52.0 15.0 L52.0 14.0 L56.0 14.0 L56.0 15.0 L58.0 15.0 L58.0 16.0 L59.0 16.0 L59.0 17.0 L60.0 17.0 L60.0 18.0 L61.0 18.0 L61.0 19.0 L62.0 19.0 L62.0 20.0 L63.0 20.0 L63.0 22.0 L65.0 22.0 L65.0 23.0 L66.0 23.0 L66.0 24.0 L67.0 24.0 L67.0 25.0 L68.0 25.0 L68.0 26.0 L69.0 26.0 L69.0 27.0 L70.0 27.0 L70.0 28.0 L72.0 28.0 L72.0 29.0 L73.0 29.0 L73.0 30.0 L74.0 30.0 L74.0 31.0 L75.0 31.0 L75.0 32.0 L76.0 32.0 L76.0 33.0 L77.0 33.0 L77.0 34.0 L79.0 34.0 L79.0 33.0 L80.0 33.0 L80.0 32.0 L81.0 32.0 L81.0 31.0 L80.0 31.0 L80.0 26.0 L79.0 26.0 L79.0 20.0 L78.0 20.0 L78.0 16.0 L77.0 16.0 L77.0 12.0 L76.0 12.0 L76.0 9.0 L74.0 9.0 L74.0 8.0 L71.0 8.0 L71.0 7.0 L68.0 7.0 L68.0 6.0 L64.0 6.0 L64.0 5.0 L61.0 5.0 L61.0 4.0 L51.0 4.0 L51.0 5.0 L48.0 5.0 L48.0 6.0 L47.0 6.0 L47.0 7.0 Z M54.0 41.0 L54.0 42.0 L55.0 42.0 L55.0 44.0 L56.0 44.0 L56.0 45.0 L57.0 45.0 L57.0 46.0 L61.0 46.0 L61.0 42.0 L59.0 42.0 L59.0 41.0 L58.0 41.0 L58.0 40.0 L57.0 40.0 L57.0 39.0 L55.0 39.0 L55.0 38.0 L54.0 38.0 L54.0 37.0 L53.0 37.0 L53.0 36.0 L52.0 36.0 L52.0 34.0 L54.0 34.0 L54.0 35.0 L55.0 35.0 L55.0 36.0 L56.0 36.0 L56.0 37.0 L57.0 37.0 L57.0 38.0 L58.0 38.0 L58.0 39.0 L59.0 39.0 L59.0 40.0 L60.0 40.0 L60.0 41.0 L62.0 41.0 L62.0 42.0 L64.0 42.0 L64.0 43.0 L65.0 43.0 L65.0 44.0 L69.0 44.0 L69.0 40.0 L68.0 40.0 L68.0 38.0 L67.0 38.0 L67.0 37.0 L66.0 37.0 L66.0 36.0 L65.0 36.0 L65.0 35.0 L64.0 35.0 L64.0 34.0 L63.0 34.0 L63.0 33.0 L61.0 33.0 L61.0 32.0 L60.0 32.0 L60.0 31.0 L59.0 31.0 L59.0 30.0 L58.0 30.0 L58.0 29.0 L57.0 29.0 L57.0 28.0 L56.0 28.0 L56.0 27.0 L58.0 27.0 L58.0 28.0 L60.0 28.0 L60.0 29.0 L61.0 29.0 L61.0 30.0 L62.0 30.0 L62.0 31.0 L63.0 31.0 L63.0 32.0 L64.0 32.0 L64.0 33.0 L65.0 33.0 L65.0 34.0 L66.0 34.0 L66.0 35.0 L68.0 35.0 L68.0 36.0 L69.0 36.0 L69.0 37.0 L70.0 37.0 L70.0 38.0 L72.0 38.0 L72.0 39.0 L75.0 39.0 L75.0 36.0 L74.0 36.0 L74.0 34.0 L73.0 34.0 L73.0 33.0 L72.0 33.0 L72.0 32.0 L71.0 32.0 L71.0 30.0 L69.0 30.0 L69.0 29.0 L68.0 29.0 L68.0 28.0 L67.0 28.0 L67.0 27.0 L66.0 27.0 L66.0 26.0 L65.0 26.0 L65.0 25.0 L63.0 25.0 L63.0 24.0 L62.0 24.0 L62.0 23.0 L61.0 23.0 L61.0 22.0 L59.0 22.0 L59.0 21.0 L58.0 21.0 L58.0 20.0 L56.0 20.0 L56.0 19.0 L55.0 19.0 L55.0 18.0 L53.0 18.0 L53.0 17.0 L50.0 17.0 L50.0 18.0 L48.0 18.0 L48.0 19.0 L47.0 19.0 L47.0 20.0 L46.0 20.0 L46.0 21.0 L43.0 21.0 L43.0 22.0 L39.0 22.0 L39.0 21.0 L37.0 21.0 L37.0 20.0 L36.0 20.0 L36.0 16.0 L37.0 16.0 L37.0 14.0 L38.0 14.0 L38.0 13.0 L39.0 13.0 L39.0 12.0 L40.0 12.0 L40.0 10.0 L41.0 10.0 L41.0 9.0 L42.0 9.0 L42.0 8.0 L43.0 8.0 L43.0 7.0 L44.0 7.0 L44.0 6.0 L42.0 6.0 L42.0 7.0 L38.0 7.0 L38.0 8.0 L33.0 8.0 L33.0 9.0 L29.0 9.0 L29.0 13.0 L28.0 13.0 L28.0 16.0 L27.0 16.0 L27.0 19.0 L26.0 19.0 L26.0 23.0 L25.0 23.0 L25.0 28.0 L24.0 28.0 L24.0 32.0 L23.0 32.0 L23.0 33.0 L24.0 33.0 L24.0 34.0 L26.0 34.0 L26.0 35.0 L28.0 35.0 L28.0 33.0 L29.0 33.0 L29.0 32.0 L30.0 32.0 L30.0 31.0 L32.0 31.0 L32.0 30.0 L36.0 30.0 L36.0 31.0 L37.0 31.0 L37.0 32.0 L38.0 32.0 L38.0 33.0 L40.0 33.0 L40.0 32.0 L44.0 32.0 L44.0 33.0 L45.0 33.0 L45.0 34.0 L46.0 34.0 L46.0 37.0 L48.0 37.0 L48.0 36.0 L49.0 36.0 L49.0 37.0 L50.0 37.0 L50.0 38.0 L51.0 38.0 L51.0 41.0 L54.0 41.0 Z M48.0 43.0 L48.0 42.0 L49.0 42.0 L49.0 40.0 L50.0 40.0 L50.0 39.0 L49.0 39.0 L49.0 38.0 L47.0 38.0 L47.0 39.0 L45.0 39.0 L45.0 40.0 L44.0 40.0 L44.0 41.0 L43.0 41.0 L43.0 43.0 L42.0 43.0 L42.0 45.0 L41.0 45.0 L41.0 47.0 L44.0 47.0 L44.0 46.0 L45.0 46.0 L45.0 45.0 L47.0 45.0 L47.0 43.0 L48.0 43.0 Z M41.0 41.0 L41.0 40.0 L42.0 40.0 L42.0 39.0 L43.0 39.0 L43.0 37.0 L44.0 37.0 L44.0 35.0 L43.0 35.0 L43.0 34.0 L39.0 34.0 L39.0 35.0 L38.0 35.0 L38.0 37.0 L37.0 37.0 L37.0 38.0 L36.0 38.0 L36.0 39.0 L35.0 39.0 L35.0 43.0 L36.0 43.0 L36.0 44.0 L38.0 44.0 L38.0 43.0 L39.0 43.0 L39.0 42.0 L40.0 42.0 L40.0 41.0 L41.0 41.0 Z M54.0 48.0 L54.0 49.0 L57.0 49.0 L57.0 47.0 L54.0 47.0 L54.0 48.0 Z M30.0 40.0 L32.0 40.0 L32.0 39.0 L33.0 39.0 L33.0 38.0 L34.0 38.0 L34.0 37.0 L35.0 37.0 L35.0 36.0 L36.0 36.0 L36.0 32.0 L32.0 32.0 L32.0 33.0 L30.0 33.0 L30.0 35.0 L29.0 35.0 L29.0 38.0 L30.0 38.0 L30.0 40.0 Z M49.0 49.0 L51.0 49.0 L51.0 48.0 L52.0 48.0 L52.0 47.0 L53.0 47.0 L53.0 45.0 L54.0 45.0 L54.0 43.0 L51.0 43.0 L51.0 44.0 L49.0 44.0 L49.0 45.0 L48.0 45.0 L48.0 47.0 L47.0 47.0 L47.0 50.0 L49.0 50.0 L49.0 49.0 Z" />
          </svg>
          <span className="hero-stats-strip__number">4</span>
          <span className="hero-stats-strip__label">Products</span>
        </div>

        {/* Column 3 — Countries Served */}
        <div className="hero-stats-strip__col">
          <svg
            className="hero-stats-strip__icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="32" cy="32" r="18" stroke="#0B4450" strokeWidth="2.2" />
            <ellipse cx="32" cy="32" rx="9" ry="18" stroke="#0B4450" strokeWidth="1.6" />
            <path d="M14 32h36" stroke="#0B4450" strokeWidth="1.6" />
            <path d="M16 24c5 2 10 3 16 3s11-1 16-3" stroke="#0B4450" strokeWidth="1.4" />
            <path d="M16 40c5-2 10-3 16-3s11 1 16 3" stroke="#0B4450" strokeWidth="1.4" />
            <path d="M22 20l4-2 3 1-1 4 3 2-2 4-4 0-1 3-3-1-2-4 2-2z" fill="#A3C178" />
            <path d="M38 36l3-3 4 1 1 3-3 3-4-1z" fill="#A3C178" />
            <path d="M40 22l3-1 3 2 0 3-3 2-3-1z" fill="#E59872" />
            <path d="M36 28l2 1 1 3-2 2-3-1-1-2z" fill="#68A398" />
          </svg>
          <span className="hero-stats-strip__number">12 +</span>
          <span className="hero-stats-strip__label">Countries Served</span>
        </div>

        {/* Column 4 — Containers Shipped Annually */}
        <div className="hero-stats-strip__col">
          <svg
            className="hero-stats-strip__icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Container body */}
            <rect
              x="8"
              y="24"
              width="34"
              height="18"
              rx="1.5"
              fill="#D63230"
              stroke="#0B4450"
              strokeWidth="1.5"
            />
            {/* Container corrugation lines */}
            <path
              d="M14 24v18M19 24v18M24 24v18M29 24v18M34 24v18"
              stroke="#B52A28"
              strokeWidth="1"
            />
            {/* Cab */}
            <path
              d="M42 30h10l5 6v6H42V30z"
              fill="#6B8E23"
              stroke="#0B4450"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Cab window */}
            <rect
              x="48"
              y="32"
              width="6"
              height="5"
              rx="0.5"
              fill="#C8E6C0"
              stroke="#0B4450"
              strokeWidth="1"
            />
            {/* Chassis */}
            <rect x="6" y="42" width="53" height="4" rx="1" fill="#3A3A3A" />
            {/* Wheels */}
            <circle cx="18" cy="48" r="4.5" fill="#3A3A3A" stroke="#0B4450" strokeWidth="1.5" />
            <circle cx="18" cy="48" r="1.8" fill="#888" />
            <circle cx="48" cy="48" r="4.5" fill="#3A3A3A" stroke="#0B4450" strokeWidth="1.5" />
            <circle cx="48" cy="48" r="1.8" fill="#888" />
          </svg>
          <span className="hero-stats-strip__number">120 +</span>
          <span className="hero-stats-strip__label">Containers / year</span>
        </div>

        {/* Column 5 — MT Coco Peat Exported Annually */}
        <div className="hero-stats-strip__col">
          <svg
            className="hero-stats-strip__icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Arrow up */}
            <path
              d="M14 12v14M10 17l4-5 4 5"
              stroke="#0B4450"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Ship hull */}
            <path d="M18 38h28l-4 8H22l-4-8z" fill="#0B4450" />
            {/* Ship superstructure */}
            <rect x="24" y="26" width="8" height="12" rx="1" fill="#0B4450" />
            <rect x="34" y="30" width="6" height="8" rx="1" fill="#0B4450" />
            {/* Smokestack */}
            <rect x="27" y="20" width="3" height="6" rx="0.5" fill="#0B4450" />
            {/* Containers on deck */}
            <rect
              x="22"
              y="33"
              width="5"
              height="5"
              rx="0.5"
              fill="#D63230"
              stroke="#0B4450"
              strokeWidth="0.8"
            />
            <rect
              x="35"
              y="33"
              width="5"
              height="5"
              rx="0.5"
              fill="#6B8E23"
              stroke="#0B4450"
              strokeWidth="0.8"
            />
            {/* Water waves */}
            <path
              d="M8 50c4-3 8 3 12 0s8 3 12 0 8 3 12 0 8 3 12 0"
              stroke="#0B4450"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 55c4-3 8 3 12 0s8 3 12 0 8 3 12 0"
              stroke="#0B4450"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="hero-stats-strip__number">3000 +</span>
          <span className="hero-stats-strip__label">MT exported / year</span>
        </div>
        </div>
      </section>
      <ContentTodo request="Confirm the export-market list before publishing country names." />
      <section className="bg-surface-teal-light py-20 lg:py-28">
        <div className="container">
          <Reveal>
            <ChapterHeading
              label="01 — Our Products"
              lines={["Made for growers.", "Built for distance."]}
              action={
                <TextLink to="/products" className="section-heading__action shrink-0 text-brand">
                  View all products
                </TextLink>
              }
            />
          </Reveal>
          <Reveal>
            <ProductCarousel />
          </Reveal>
        </div>
      </section>

      <Link
        to="/process"
        aria-label="Explore the full process"
        className="process-preview-link block bg-surface-teal-light text-body-text transition duration-300 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        <section className="py-14 lg:py-20">
          <div className="container">
            <Reveal>
              <div>
                <Label className="mb-4 block">02 / Transformation</Label>
                <h2 className="display max-w-full text-[clamp(1.15rem,5.6vw,3.5rem)] leading-tight">
                  Natural Meets Precision
                </h2>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {processStages.slice(0, 9).map((s, i) => (
                <Fragment key={s.n}>
                  <Reveal
                    delay={(i % 3) * 70}
                    className={`${i === 3 || i === 7 ? "md:col-span-2" : ""} group relative min-h-[300px] overflow-hidden rounded-md`}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-brand-deep/95 via-brand-deep/60 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 z-[2] flex min-w-0 items-center gap-2 p-5 sm:p-6">
                      <span className="display shrink-0 text-[clamp(.9rem,2vw,1.5rem)] leading-none text-pure-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="process-preview-stage-title display min-w-0 text-[clamp(.8rem,1.6vw,1.3rem)] leading-tight">
                        {s.title}
                      </h3>
                    </div>
                  </Reveal>
                  {i === 6 && (
                    <div className="flex min-h-[180px] items-center justify-center rounded-md border border-[#20555A]/15 bg-pure-white/10 p-6 md:min-h-[300px] md:p-5">
                      <img
                        src={logo}
                        alt="Arjuna Exports"
                        width={1436}
                        height={328}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full max-w-[320px] object-contain"
                      />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            <div className="mt-8 flex justify-center sm:justify-end">
              <span className="process-preview-cta inline-flex min-h-[52px] items-center gap-3 rounded-sm bg-[var(--brand-green)] px-7 text-[14px] font-semibold uppercase tracking-[0.06em] text-pure-white transition-colors duration-300 hover:bg-[#1B5E20]">
                Explore the full process
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </section>
      </Link>
      <section className="bg-ivory py-12 sm:py-14 lg:py-16">
        <div className="container">
          <Reveal>
            <div>
              <Label className="mb-4 block">03 — The Material</Label>
              <h2 className="display max-w-full text-[clamp(0.8rem,3.6vw,3.5rem)] leading-tight">
                One Coconut World of Possibilities
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-px bg-charcoal/15 md:grid-cols-2 lg:grid-cols-4">
            {transformationStages.map((s, i) => (
              <Reveal
                key={s.n}
                delay={i * 80}
                className="group overflow-hidden rounded-md bg-ivory"
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span className="micro-label text-brand">{s.n}</span>
                  <h3 className="display mt-3 text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/65">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CustomerJourney />
      <section className="bg-ivory py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal>
            <ChapterHeading label="Our Solutions" lines={["Solutions Across", "Industries"]} />
            <p className="mt-8 max-w-[38ch] leading-relaxed text-charcoal/65">
              Coir-based products shaped for the needs of growers, manufacturers, retailers and
              landscape professionals.
            </p>
            <TextLink to="/applications" className="mt-8 text-brand">
              Explore all industries
            </TextLink>
          </Reveal>
          <div className="grid gap-px bg-charcoal/15 sm:grid-cols-2">
            {homeIndustrySolutions.map((solution, index) => (
              <Reveal key={solution.title} className="group relative min-h-72 overflow-hidden">
                <a
                  href={`/applications#${solution.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "")}`}
                  aria-label={`Explore ${solution.title} solutions`}
                  className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-aqua"
                >
                  <img
                    src={solution.image}
                    alt={solution.alt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 to-transparent transition-colors group-hover:from-brand-deep/95" />
                  <div className="absolute inset-x-0 bottom-0 p-7 text-pure-white">
                    <span className="micro-label text-aqua">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="display mt-2 text-3xl">{solution.title}</h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-offwhite py-20 lg:py-24">
        <div className="container">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-brand">Articles &amp; insights</Label>
              <h2 className="display mt-5 text-[clamp(2.25rem,3.8vw,3.75rem)]">
                Practical knowledge for better growing.
              </h2>
            </div>
            <TextLink to="/resources" className="shrink-0 text-brand">
              View all articles
            </TextLink>
          </Reveal>
          <Reveal>{articles.length > 0 && <ArticlesCarousel articles={articles} />}</Reveal>
        </div>
      </section>
    </>
  );
}
