import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/site-data";
import { Arrow } from "@/components/site/primitives";

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
        <div className="product-card__media">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="product-card__image"
          />
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
    <article className="product-card product-card--listing group">
      <div className="product-card__media">
        <span className="product-card__category micro-label">{product.category}</span>
        <Link {...productLink} aria-label={`View ${product.name}`}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="product-card__image"
          />
        </Link>
      </div>
      <div className="product-card__body">
        <div>
          <span className="micro-label text-brand">
            Product {String(index + 1).padStart(2, "0")}
          </span>
          <h2 className="display mt-4 text-charcoal">{product.name}</h2>
          <p className="mt-5 max-w-2xl font-display text-base leading-relaxed text-charcoal/68">
            {product.short}
          </p>
        </div>
        <div className="product-card__specs">
          {[
            ["Format", product.format],
            ["Application", product.application],
            [product.specs[0]?.label ?? "Specification", product.specs[0]?.value ?? "On request"],
          ].map(([label, value]) => (
            <div key={label} className="bg-surface-cream p-4">
              <span className="micro-label text-charcoal/70">{label}</span>
              <p className="mt-2 text-sm font-semibold leading-snug text-charcoal">{value}</p>
            </div>
          ))}
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
            search={{ product: product.slug }}
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
