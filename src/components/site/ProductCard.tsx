import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/site-data";
import { Arrow } from "@/components/site/primitives";
import { ImageSlot } from "@/components/site/ProductDetailComponents";

type ProductCardProps = {
  product: Product;
  index: number;
  variant: "carousel" | "listing";
};

export function ProductCard({ product, index, variant }: ProductCardProps) {
  const productLink = {
    to: "/products/$slug" as const,
    params: { slug: product.slug },
  };

  if (variant === "carousel") {
    return (
      <Link {...productLink} className="product-card product-card--carousel group">
        <div className="product-card__media aspect-[4/5]">
          {product.imageTodo ? (
            <ImageSlot todo={product.imageTodo} className="h-full w-full" />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
              className="product-card__image h-full w-full object-cover"
            />
          )}
        </div>
        <div className="product-card__body">
          <span className="micro-label text-brand">
            {String(index + 1).padStart(2, "0")} / {product.category}
          </span>
          <h3 className="display mt-3">{product.name}</h3>
          <p className="mt-3 line-clamp-2 font-display text-sm leading-relaxed text-charcoal/70">
            {product.short}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="product-card product-card--listing group flex h-full flex-col overflow-hidden rounded-sm border border-brand/15 bg-pure-white shadow-[var(--shadow-card)]">
      <div className="product-card__media relative aspect-[4/5] overflow-hidden bg-surface-cream">
        <span className="product-card__category micro-label">{product.category}</span>
        <Link {...productLink} aria-label={`View ${product.name}`} className="block h-full">
          {product.imageTodo ? (
            <ImageSlot todo={product.imageTodo} className="h-full w-full" />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              width={600}
              height={750}
              loading="lazy"
              decoding="async"
              className="product-card__image h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Link>
      </div>
      <div className="product-card__body flex flex-1 flex-col p-5">
        <div className="flex-1">
          <span className="micro-label text-brand">
            Product {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="display mt-3 text-charcoal">{product.name}</h2>
          <p className="mt-3 line-clamp-2 max-w-[65ch] text-sm leading-body text-charcoal/68">
            {product.short}
          </p>
          <div className="product-card__specs mt-5 grid gap-2">
            {[
              ["Format", product.format],
              [product.specs[0]?.label ?? "Specification", product.specs[0]?.value ?? "On request"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-wrap items-baseline gap-2 border-b border-brand/10 py-2"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                  {label}
                </span>
                <p className="text-sm font-medium leading-snug text-charcoal">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="product-card__actions">
          <Link
            {...productLink}
            aria-label={`View ${product.name}`}
            className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.08em] text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            View product <Arrow className="group-hover:translate-x-1.5" />
          </Link>
          <Link
            to="/contact"
            search={{ product: product.slug, request: "quote" }}
            aria-label={`Request a quote for ${product.name}`}
            className="inline-flex min-h-11 items-center rounded-sm border border-brand px-4 text-sm font-semibold uppercase tracking-[0.04em] text-brand transition-colors hover:bg-brand hover:text-pure-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </article>
  );
}
