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
import { ImageZoomButton } from "@/components/site/ImageZoom";
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
import { HomeStats } from "@/components/site/HomeStats";
import { OurStrengthsAccordion } from "@/components/site/OurStrengthsAccordion";
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
      <div
        className="mt-4 flex items-center justify-end gap-3"
        role="group"
        aria-label="Carousel controls"
      >
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
              <article
                key={article.slug}
                className="group flex w-[min(84vw,23rem)] shrink-0 flex-col overflow-hidden rounded-sm border border-brand/20 bg-pure-white shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-pure-white">
                  <Link
                    to="/resources/$slug"
                    params={{ slug: article.slug }}
                    tabIndex={duplicate ? -1 : undefined}
                    className="block h-full"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </Link>
                  {!duplicate && <ImageZoomButton src={article.image} alt={article.title} />}
                </div>
                <Link
                  to="/resources/$slug"
                  params={{ slug: article.slug }}
                  tabIndex={duplicate ? -1 : undefined}
                  className="flex flex-1 flex-col p-6"
                >
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
                </Link>
              </article>
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
          <Label className="mb-6 text-[#b9e5c3]">ARJUNA EXPORTS · INDIA</Label>
          <h1 id="home-hero-title" className="home-hero__title display">
            <span className="home-hero__title-line">From Coconut Husk</span>{" "}
            <span className="home-hero__title-line home-hero__title-line--accent">
              To Better Growing Media
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
        <ImageZoomButton
          src={heroPlantationWebp}
          alt="Coconut plantation and export operations"
          className="image-zoom-button--below-header"
        />
      </section>
      <HomeStats />
      <ContentTodo request="Confirm the export-market list before publishing country names." />
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
                <div className="relative aspect-[5/4] overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <ImageZoomButton src={s.image} alt={s.title} />
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

      <section className="process-preview-link bg-surface-teal-light text-body-text transition duration-300 hover:opacity-95">
        <div className="py-14 lg:py-20">
          <div className="container">
            <Reveal>
              <div>
                <Label className="mb-4 block">03 ? Transformation / Production</Label>
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
                    <Link
                      to="/process"
                      aria-label={`Explore ${s.title} in the full process`}
                      className="absolute inset-0 z-[3] focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-aqua"
                    />
                    <ImageZoomButton src={s.image} alt={s.title} />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-36 bg-gradient-to-t from-brand-deep/95 via-brand-deep/60 to-transparent"
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
              <Link
                to="/process"
                className="process-preview-cta inline-flex min-h-[52px] items-center gap-3 rounded-sm bg-[var(--brand-green)] px-7 text-[14px] font-semibold uppercase tracking-[0.06em] text-pure-white transition-colors duration-300 hover:bg-[#1B5E20] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                Explore the full process
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className="bg-ivory py-20 lg:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <Reveal>
            <ChapterHeading label="05 ? Applications" lines={["Solutions Across", "Industries"]} />
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
                <ImageZoomButton src={solution.image} alt={solution.alt} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <OurStrengthsAccordion label="06 — Our Unique Values" />

      <CustomerJourney />

      <section className="bg-offwhite py-20 lg:py-24">
        <div className="container">
          <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-brand">08 — Resources</Label>
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
