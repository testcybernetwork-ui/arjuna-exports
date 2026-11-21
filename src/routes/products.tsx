import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { img, productFilterGroups, products } from "@/lib/site-data";
import { PageHero, pageMeta } from "@/components/site/PageHero";
import { PrimaryButton, Reveal } from "@/components/site/primitives";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/products")({
  head: () =>
    pageMeta(
      "Products",
      "Explore Coco Peat Blocks, Coco Peat 650g Bricks, Coco Husk Chips and Coir Matting.",
      "/products",
    ),
  component: Products,
});
function Products() {
  const [filter, setFilter] = useState("All");
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeGroup = productFilterGroups.find((group) => group.label === filter);
  const shown =
    filter === "All"
      ? products
      : products.filter((product) => activeGroup?.productSlugs.includes(product.slug));
  if (pathname !== "/products" && pathname !== "/products/") return <Outlet />;
  return (
    <>
      <PageHero
        eyebrow="Product Range"
        title="Coco products for professional supply."
        intro="Compressed blocks, Coco Husk Chips and natural coir formats with clear specifications for export buyers."
        image={img.productBlock}
      />
      <section className="relative overflow-hidden bg-offwhite py-20 lg:py-24">
        <div className="container relative">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products">
            {[
              { label: "All", count: products.length },
              ...productFilterGroups.map((group) => ({
                label: group.label,
                count: group.productSlugs.length,
              })),
            ].map(({ label, count }) => (
              <button
                key={label}
                onClick={() => setFilter(label)}
                aria-pressed={filter === label}
                className={`min-h-12 rounded-sm border px-4 py-2.5 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${filter === label ? "border-brand bg-brand text-pure-white" : "border-charcoal/15 bg-ivory text-charcoal/70 hover:border-brand hover:text-brand"}`}
              >
                {label} <span className="ml-1">({count})</span>
              </button>
            ))}
          </div>
          <div className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 70} className="product-card-reveal">
                <ProductCard product={p} index={i} variant="listing" />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-6 border-t border-brand/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[65ch] text-base leading-body text-body-text">
              Need a specific size, EC level, packaging or container quantity? Request a customised
              quote.
            </p>
            <PrimaryButton to="/contact" className="shrink-0">
              Request a customised quote
            </PrimaryButton>
          </div>
        </div>
      </section>
    </>
  );
}
