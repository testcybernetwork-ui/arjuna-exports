import { Link } from "@tanstack/react-router";
import {
  Arrow,
  Breadcrumbs,
  ContentTodo,
  Label,
  PrimaryButton,
  Reveal,
  TextLink,
} from "./primitives";
import { FeatureGrid, ImageSlot, SpecTable } from "./ProductDetailComponents";
import type { Product } from "@/lib/site-data";
import type { ProductVariantDetails } from "@/lib/product-variants";

type Props = {
  product: Product;
  variant: ProductVariantDetails;
  siblingVariants: ProductVariantDetails[];
  features: string[];
};

const looseFillApplications: Record<string, string[]> = {
  "100-coco-coir": [
    "Greenhouse cultivation",
    "Nurseries",
    "Container gardening",
    "A wide range of crops",
  ],
  "70-coco-coir-30-perlite": [
    "Greenhouse growing",
    "Nursery production",
    "Container cultivation",
    "Well-aerated growing media",
  ],
  "70-coco-coir-30-husk-chips": [
    "Greenhouse cultivation",
    "Container growing",
    "Crops requiring an airy, free-draining substrate",
  ],
};

export function ProductVariantPage({ product, variant, siblingVariants, features }: Props) {
  const isGrowBag = product.slug === "coco-coir-grow-bags";
  const applications = variant.applications ?? looseFillApplications[variant.slug] ?? [];
  const path = `/products/${product.slug}/${variant.slug}`;
  const details = [
    {
      label: "Product details",
      rows: variant.specifications.map((spec) => ({
        label: spec.label,
        values: [spec.value],
      })),
    },
  ];

  return (
    <>
      <section className="bg-surface-cream pt-24 pb-16 lg:pt-28 lg:pb-24">
        <div className="container">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: product.name, to: "/products/$slug", params: { slug: product.slug } },
              { label: variant.label },
            ]}
          />
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <Label className="text-brand">{product.name}</Label>
              <h1 className="display mt-5 text-h1 leading-heading text-heading">{variant.title}</h1>
              <p className="mt-6 max-w-[65ch] text-base leading-body text-body-text">
                {variant.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <PrimaryButton
                  to="/contact"
                  search={{ product: product.slug, variant: variant.slug, request: "quote" }}
                  aria-label={`Request a quote for ${variant.title}`}
                >
                  Request a quote
                </PrimaryButton>
                <PrimaryButton
                  to="/contact"
                  search={{ product: product.slug, variant: variant.slug, request: "sample" }}
                  aria-label={`Request a sample of ${variant.title}`}
                  className="border border-brand bg-transparent text-brand shadow-none hover:bg-brand hover:text-pure-white"
                >
                  Request a sample
                </PrimaryButton>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {variant.imageTodos.map((todo, index) => (
                <div key={todo}>
                  <div className="aspect-[4/5] overflow-hidden rounded-sm border border-brand/15 bg-surface-cream">
                    <ImageSlot todo={todo} className="h-full w-full" />
                  </div>
                  {isGrowBag && (
                    <p className="mt-3 text-sm font-semibold text-brand-deep">
                      {index === 0 ? "UV Stabilized Plastic" : "Non-Woven Fabric"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-pure-white py-14 lg:py-24" aria-labelledby="variant-overview-title">
        <div className="container grid gap-8 lg:grid-cols-[.35fr_.65fr] lg:gap-16">
          <div>
            <Label className="text-brand">02 — Overview</Label>
            <h2 id="variant-overview-title" className="display mt-4 text-h2 text-heading">
              Product overview
            </h2>
          </div>
          <p className="max-w-[65ch] text-base leading-body text-body-text">
            {variant.description}
          </p>
        </div>
      </section>

      <section className="bg-surface-cream py-14 lg:py-24" aria-labelledby="variant-benefits-title">
        <div className="container">
          <Label className="text-brand">03 — Key Benefits</Label>
          <h2 id="variant-benefits-title" className="display mt-4 text-h2 text-heading">
            Key benefits
          </h2>
          <div className="mt-8">
            <FeatureGrid features={features} />
          </div>
        </div>
      </section>

      <section
        className="bg-pure-white py-14 lg:py-24"
        aria-labelledby="variant-specifications-title"
      >
        <div className="container">
          <Label className="text-brand">04 — Technical Specifications</Label>
          <h2 id="variant-specifications-title" className="display mt-4 text-h2 text-heading">
            Technical specifications
          </h2>
          <div className="mt-8">
            <SpecTable
              title={`${variant.title} technical specifications`}
              columns={["Value"]}
              sections={details}
            />
          </div>
          <p className="mt-4 text-sm leading-body text-text-muted">
            Values shown are typical and can be adjusted to customer order specifications.
          </p>
          <Link
            to="/contact"
            search={{ product: product.slug, variant: variant.slug, request: "quote" }}
            className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            Request technical sheet <Arrow />
          </Link>
          <ContentTodo
            request={`Supply an approved downloadable specification sheet for ${variant.title}.`}
          />
        </div>
      </section>

      {variant.packaging ? (
        <section
          className="bg-surface-cream py-14 lg:py-24"
          aria-labelledby="variant-packing-title"
        >
          <div className="container">
            <Label className="text-brand">05 — Packing &amp; Logistics</Label>
            <h2 id="variant-packing-title" className="display mt-4 text-h2 text-heading">
              Packing &amp; logistics
            </h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <article className="rounded-sm border border-brand/15 bg-pure-white p-6">
                <h3 className="display text-h3 text-brand-deep">Packaging</h3>
                <p className="mt-4 text-base leading-body text-body-text">{variant.packaging}</p>
              </article>
              <article className="rounded-sm border border-brand/15 bg-pure-white p-6">
                <h3 className="display text-h3 text-brand-deep">Container loading</h3>
                <dl className="mt-4 divide-y divide-brand/10">
                  {variant.containerLoading?.map((row) => (
                    <div key={row.label} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
                      <dt className="text-sm font-semibold text-brand">{row.label}</dt>
                      <dd className="text-sm leading-body text-body-text">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </div>
          </div>
        </section>
      ) : (
        <ContentTodo request="Supply packing and container-loading information for 50L Loose Fill Bags." />
      )}

      <section
        className="bg-pure-white py-14 lg:py-24"
        aria-labelledby="variant-applications-title"
      >
        <div className="container">
          <Label className="text-brand">06 — Applications</Label>
          <h2 id="variant-applications-title" className="display mt-4 text-h2 text-heading">
            Suitable applications
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <li
                key={application}
                className="rounded-sm border border-brand/15 bg-surface-cream px-5 py-4 text-sm font-medium leading-body text-body-text"
              >
                {application}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="bg-brand-deep py-14 text-pure-white lg:py-20"
        aria-labelledby="variant-cta-title"
      >
        <div className="container flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Label className="text-brand-soft">07 — Request a quote</Label>
            <h2 id="variant-cta-title" className="display mt-4 text-h2 text-pure-white">
              {isGrowBag
                ? "Need a specific grow bag size, expanded volume, coco peat blend, EC level, packaging format or container quantity?"
                : "Tell us about your product and order requirements."}
            </h2>
            {isGrowBag && (
              <p className="mt-4 max-w-[65ch] text-base leading-body text-pure-white">
                Request a customised quote.
              </p>
            )}
          </div>
          <PrimaryButton
            to="/contact"
            search={{ product: product.slug, variant: variant.slug, request: "quote" }}
            className="shrink-0"
          >
            Request a quote
          </PrimaryButton>
        </div>
      </section>

      <section className="bg-surface-cream py-14 lg:py-24" aria-labelledby="variant-related-title">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Label className="text-brand">08 — Related variants</Label>
              <h2 id="variant-related-title" className="display mt-4 text-h2 text-heading">
                Explore other options
              </h2>
            </div>
            <TextLink to="/products/$slug" params={{ slug: product.slug }} className="text-brand">
              All {product.name}
            </TextLink>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblingVariants
              .filter((sibling) => sibling.slug !== variant.slug)
              .map((sibling) => (
                <Link
                  key={sibling.slug}
                  to="/products/$slug/$variant"
                  params={{ slug: product.slug, variant: sibling.slug }}
                  className="flex min-h-16 items-center justify-between gap-4 rounded-sm border border-brand/15 bg-pure-white px-5 py-4 text-sm font-semibold text-brand-deep transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {sibling.label}
                  <Arrow />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
