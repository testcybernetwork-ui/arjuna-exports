import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductVariantPage } from "@/components/site/ProductVariantPage";
import { pageMeta } from "@/components/site/PageHero";
import { findProductVariant, productVariantGroups } from "@/lib/product-variants";
import { products } from "@/lib/site-data";

export const Route = createFileRoute("/products/$slug/$variant")({
  loader: ({ params }) => {
    const product = products.find((entry) => entry.slug === params.slug);
    const variant = findProductVariant(params.slug, params.variant);
    const group = productVariantGroups[params.slug as keyof typeof productVariantGroups];

    if (!product || !variant || !group) throw notFound();

    const { industrySolutions, ...serializableProduct } = product;
    return {
      product: serializableProduct,
      variant,
      variants: group.variants,
      features: group.features,
    };
  },
  head: ({ loaderData, params }) => {
    const canonical = `/products/${params.slug}/${params.variant}`;
    return pageMeta(
      loaderData?.variant.title ?? "Product variant",
      loaderData?.variant.description ?? "Product specifications from Arjuna Exports.",
      canonical,
    );
  },
  component: ProductVariantRoute,
});

function ProductVariantRoute() {
  const { product, variant, variants, features } = Route.useLoaderData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: variant.title,
            description: variant.description,
            url: `https://www.arjunaexports.com/products/${product.slug}/${variant.slug}`,
            brand: { "@type": "Brand", name: "Arjuna Exports" },
            category: product.category,
            additionalProperty: variant.specifications.map((specification) => ({
              "@type": "PropertyValue",
              name: specification.label,
              value: specification.value,
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
      <ProductVariantPage
        product={product}
        variant={variant}
        siblingVariants={variants}
        features={features}
      />
    </>
  );
}
