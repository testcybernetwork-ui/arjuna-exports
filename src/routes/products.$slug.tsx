import {
  createFileRoute,
  Link,
  notFound,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Info, Layers3, PackageOpen, Settings, Sprout } from "lucide-react";
import { applications, img, products } from "@/lib/site-data";
import { legacyProductSlugRedirects } from "@/lib/route-aliases";
import { pageMeta } from "@/components/site/PageHero";
import { CategoryCard } from "@/components/site/CategoryCard";
import { CoirMattingFeatures } from "@/components/site/CoirMattingFeatures";
import {
  Arrow,
  Breadcrumbs,
  ContentTodo,
  Label,
  PrimaryButton,
  Reveal,
  SecondaryButton,
  TextLink,
} from "@/components/site/primitives";
import { FeatureGrid, ImageSlot } from "@/components/site/ProductDetailComponents";
import { ImageZoomButton } from "@/components/site/ImageZoom";
import { PointArt } from "@/components/site/PointArt";
import coconutIcon from "@/assets/coconut2.svg";
import coirMatPhoto1 from "@/assets/Product/4.coir mat/01.png";
import coirMatPhoto2 from "@/assets/Product/4.coir mat/02.png";
import coirMatPhoto3 from "@/assets/Product/4.coir mat/03.png";
import coirMatPhoto4 from "@/assets/Product/4.coir mat/04.png";
import coirMatPhoto5 from "@/assets/Product/4.coir mat/05.png";
import coirMatPhoto6 from "@/assets/Product/4.coir mat/06.png";
import coirPackingPhoto1 from "@/assets/Product/4.coir mat/Packing/01.png";
import coirPackingPhoto2 from "@/assets/Product/4.coir mat/Packing/02.png";
import coirPackingPhoto3 from "@/assets/Product/4.coir mat/Packing/03.png";
import coirPackingPhoto4 from "@/assets/Product/4.coir mat/Packing/04.png";
import coirApplicationStairs from "@/assets/Product/4.coir mat/Carpet Applications/Indoor or outdoor stairs.png";
import coirApplicationHallways from "@/assets/Product/4.coir mat/Carpet Applications/Residential hallways.png";
import coirApplicationGarden from "@/assets/Product/4.coir mat/Carpet Applications/Garden Pathways.png";
import coirApplicationFunction from "@/assets/Product/4.coir mat/Carpet Applications/Function Halls.png";
import coirApplicationWalkways from "@/assets/Product/4.coir mat/Carpet Applications/Stairs and Walkways.png";
import cocoBenefit1 from "@/assets/key benefits/1.png";
import cocoBenefit2 from "@/assets/key benefits/2.png";
import cocoBenefit3 from "@/assets/key benefits/3.png";
import cocoBenefit4 from "@/assets/key benefits/4.png";
import cocoBenefit5 from "@/assets/key benefits/5.png";
import cocoBenefit6 from "@/assets/key benefits/6.png";
import cocoBenefit7 from "@/assets/key benefits/7.png";
import cocoBenefit8 from "@/assets/key benefits/8.png";
import cocoBlockPhoto1 from "@/assets/Product/1.coco peat blocks/01.JPG";
import cocoBlockPhoto2 from "@/assets/Product/1.coco peat blocks/02.JPG";
import cocoBlockPhoto3 from "@/assets/Product/1.coco peat blocks/03.png";
import cocoBlockPhoto4 from "@/assets/Product/1.coco peat blocks/04.jpg";
import cocoBlockPhoto5 from "@/assets/Product/1.coco peat blocks/05.png";
import cocoBlockPhoto6 from "@/assets/Product/1.coco peat blocks/06.png";
import cocoBrickPhoto1 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/1.png";
import cocoBrickPhoto2 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/2.png";
import cocoBrickPhoto3 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/3.png";
import cocoBrickPhoto4 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/4.png";
import cocoBrickPhoto5 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/5.png";
import cocoBrickPhoto6 from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/6.png";
import cocoBrickPalletPhoto from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/Bulk Packing in Pallets.png";
import gramBrickIndividualPacking from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/Individual Plain  Packing.png";
import gramBrickCartonPacking from "@/assets/Product/2.coco peat 650  gram/02. Coco Peat 650Gram Bricks/Carton Box Packing.png";
import packingBulkPalletised from "@/assets/Product/packing/Bulk Palletised.png";
import packingPrivateLabel from "@/assets/Product/packing/Private Labelling.png";
import packingBundles from "@/assets/Product/packing/Bundler Pack 3S & 4S.png";
import packingBareBlocks from "@/assets/Product/packing/Bare Blocks - Direct Floor Loading.JPG";
import huskPhoto1 from "@/assets/Product/3.coco husk/01.png";
import huskPhoto2 from "@/assets/Product/3.coco husk/02.png";
import huskPhoto3 from "@/assets/Product/3.coco husk/03.png";
import huskPhoto4 from "@/assets/Product/3.coco husk/04.png";
import huskPhoto5 from "@/assets/Product/3.coco husk/05.png";
import huskPhoto6 from "@/assets/Product/3.coco husk/06.png";
import huskPrivateLabelPhoto from "@/assets/Product/3.coco husk/Packing/Individual Block Packing with Private Label.png";
import huskPalletPhoto from "@/assets/Product/3.coco husk/Packing/Bulk Packing in Pallets.png";
import huskFloorLoadingPhoto from "@/assets/Product/3.coco husk/Packing/Direct Floor Loading.png";
import animalBeddingPhoto from "@/assets/Product/3.coco husk/Application/01. Animal Bedding.jpg";
import mulchMediumPhoto from "@/assets/Product/3.coco husk/Application/02. Mulch Medium.jpg";
import orchidPlantingPhoto from "@/assets/Product/3.coco husk/Application/03. Orchid Planting.jpg";
import terrariumSubstratePhoto from "@/assets/Product/3.coco husk/Application/04. Terrarium Substrate.jpg";
import huskBenefit1 from "@/assets/Product/3.coco husk/key/1.png";
import huskBenefit2 from "@/assets/Product/3.coco husk/key/2.png";
import huskBenefit3 from "@/assets/Product/3.coco husk/key/3.png";
import huskBenefit4 from "@/assets/Product/3.coco husk/key/4.png";
import huskBenefit5 from "@/assets/Product/3.coco husk/key/5.png";
import huskBenefit6 from "@/assets/Product/3.coco husk/key/6.png";
import huskBenefit7 from "@/assets/Product/3.coco husk/key/7.png";
import huskBenefit8 from "@/assets/Product/3.coco husk/key/8.png";

type ProductGalleryPhoto = { image?: string; label: string; todo?: string };

const productGalleries: Record<string, ProductGalleryPhoto[]> = {
  "coco-peat-blocks": [
    { image: cocoBlockPhoto1, label: "Coco peat block stack" },
    { image: cocoBlockPhoto2, label: "Coco peat blocks at the production facility" },
    { image: cocoBlockPhoto4, label: "Coco peat blocks prepared for export" },
    { image: cocoBlockPhoto3, label: "Wrapped coco peat block pallets" },
    { image: cocoBlockPhoto5, label: "Coco peat blocks loaded for shipment" },
    { image: cocoBlockPhoto6, label: "Export-ready coco peat block shipment" },
  ],
  "coir-matting": [
    { todo: "Coir Matting product photo 1 from the client", label: "Coir Matting product photo 1" },
    { todo: "Coir Matting product photo 2 from the client", label: "Coir Matting product photo 2" },
    { todo: "Coir Matting product photo 3 from the client", label: "Coir Matting product photo 3" },
    { todo: "Coir Matting product photo 4 from the client", label: "Coir Matting product photo 4" },
    { todo: "Coir Matting product photo 5 from the client", label: "Coir Matting product photo 5" },
    { todo: "Coir Matting product photo 6 from the client", label: "Coir Matting product photo 6" },
  ],
  "coco-peat-650g-bricks": [
    { image: img.productCocoPeat650g, label: "Individually wrapped 650 gram coco peat brick" },
    { image: cocoBrickPhoto1, label: "Coco coir bricks stacked for product display" },
    { image: cocoBrickPhoto2, label: "Coco coir bricks loaded in an export container" },
    { image: cocoBrickPhoto3, label: "Individually packed 650 gram coco peat bricks" },
    { image: cocoBrickPhoto4, label: "Packed coco peat bricks ready for distribution" },
    { image: cocoBrickPalletPhoto, label: "Palletised coco peat bricks prepared for export" },
    { image: cocoBrickPhoto5, label: "650 gram coco peat bricks arranged for dispatch" },
  ],
  "coco-husk-chips": [
    { image: huskPhoto1, label: "Coco Husk Chips product pictures" },
    { image: huskPhoto2, label: "Coco Husk Chips blocks" },
    { image: huskPhoto3, label: "Coco Husk Chips block and loose chips" },
    { image: huskPhoto4, label: "Coco Husk Chips blocks in the warehouse" },
    { image: huskPhoto5, label: "Coco Husk Chips blocks stacked in the warehouse" },
    { image: huskPhoto6, label: "Palletised Coco Husk Chips blocks" },
  ],
};

const cocoPeatKeyFeatures = [
  { title: "Consistent Quality", image: cocoBenefit1 },
  { title: "High Volume Expansion", image: cocoBenefit2 },
  { title: "Excellent Water Retention", image: cocoBenefit3 },
  { title: "Double Washed", image: cocoBenefit4 },
  { title: "100% Natural", image: cocoBenefit5 },
  { title: "Biodegradable", image: cocoBenefit6 },
  { title: "Low EC/Stable pH", image: cocoBenefit7 },
  { title: "Easy Storage & Handling", image: cocoBenefit8 },
];

const gramBlockKeyFeatures = [
  { title: "Consistent Quality", image: cocoBenefit1 },
  { title: "Compact & Lightweight", image: cocoBenefit2 },
  { title: "Excellent Water Retention", image: cocoBenefit3 },
  { title: "Good Aeration and Drainage", image: cocoBenefit4 },
  { title: "100% Natural", image: cocoBenefit5 },
  { title: "Biodegradable", image: cocoBenefit6 },
  { title: "Low EC/Stable pH", image: cocoBenefit7 },
  { title: "Easy Storage & Handling", image: cocoBenefit8 },
];

const huskChipsKeyFeatures = [
  { title: "Consistent Quality", image: huskBenefit1 },
  { title: "Improves Aeration", image: huskBenefit2 },
  { title: "Excellent Moisture Retention", image: huskBenefit3 },
  { title: "4 to 20 mm Sieved", image: huskBenefit4 },
  { title: "100% Natural & Renewable", image: huskBenefit5 },
  { title: "Biodegradable", image: huskBenefit6 },
  { title: "Washed/Stable pH", image: huskBenefit7 },
  { title: "Compressed for Easy Handling", image: huskBenefit8 },
];

const packingOptions = [
  {
    number: "01",
    title: "Bare Blocks – Direct Floor Loading",
    description:
      "Blocks loaded directly into the container without pallets to maximize container utilization and cargo loading efficiency.",
    image: packingBareBlocks,
    alt: "Bare coco peat blocks stacked for direct floor loading",
  },
  {
    number: "02",
    title: "Bulk Palletised",
    description:
      "Compressed coco peat blocks stacked and securely palletised with stretch/shrink wrapping for efficient handling, storage, and container loading.",
    image: packingBulkPalletised,
    alt: "Coco peat blocks stacked and stretch wrapped on pallets",
  },
  {
    number: "03",
    title: "Bundle Pack – 3S/4S",
    description:
      "Blocks packed in customised bundles for easier handling, distribution, and retail or commercial applications.",
    image: packingBundles,
    alt: "Bundles of coco peat blocks loaded inside a container",
  },
  {
    number: "04",
    title: "Retail Pack with Private Labelling",
    description:
      "Customised individual block packaging with the buyer's brand, product information, specifications, and market requirements.",
    image: huskPrivateLabelPhoto,
    alt: "Coco peat blocks in branded retail packaging",
  },
];

const cocoPeatComparison = [
  { property: "Type", lowEc: "Coconut Peat", highEc: "Coconut Peat" },
  { property: "Form", lowEc: "Block", highEc: "Block" },
  { property: "Size", lowEc: "30 × 30 × 12 cm ± 15 cm", highEc: "30 × 30 × 12 cm ± 15 cm" },
  { property: "Moisture", lowEc: "Below 15%", highEc: "Below 15%" },
  { property: "EC", lowEc: "Below 0.5 µS/cm", highEc: "Above 1.5 µS/cm" },
  {
    property: "Weight",
    lowEc: "4.6 to 5 kg (± 200 grams)",
    highEc: "4.6 to 5 kg (± 200 grams)",
  },
  { property: "Compression", lowEc: "05:01", highEc: "05:01" },
  { property: "pH", lowEc: "5.2–6.8", highEc: "5.2–6.8" },
  {
    property: "Expansion Volume",
    lowEc: "15–16 litres per kg",
    highEc: "15–16 litres per kg",
  },
  { property: "Sand Ratio", lowEc: "Below 5%", highEc: "Below 5%" },
  { property: "Grade", lowEc: "Standard, Sieved", highEc: "Standard, Sieved" },
  { property: "Material", lowEc: "Natural Coir Pith", highEc: "Natural Coir Pith" },
  {
    property: "Usage",
    lowEc: "Potting mix suppliers, greenhouses, hydroponic growers, etc.",
    highEc: "Plant growing and animal bedding",
  },
  { property: "Colour", lowEc: "Natural Brown", highEc: "Natural Brown" },
  { property: "Features", lowEc: "Washed", highEc: "Unwashed" },
];

const cocoPeatTechnicalGroups = [
  {
    label: "Core Product",
    icon: <Layers3 />,
    rows: [
      { property: "Type", lowEc: "Coconut Peat", highEc: "Coconut Peat" },
      { property: "Form", lowEc: "Block", highEc: "Block" },
    ],
  },
  {
    label: "Physical Properties",
    icon: <PackageOpen />,
    rows: [
      {
        property: "Size (L x B x H)",
        lowEc: "30 x 30 x 10 to 12 cm",
        highEc: "30 x 30 x 10 to 12 cm",
      },
      { property: "Moisture", lowEc: "Below 15%", highEc: "Below 15%" },
      { property: "Weight", lowEc: "4.2 to 5.2 KGS", highEc: "4.2 to 5.2 KGS" },
      { property: "Compression", lowEc: "5:1", highEc: "5:1" },
      {
        property: "Electrical Conductivity (EC)",
        lowEc: "Below 0.5 mS/cm",
        highEc: "Above 1.5 mS/cm",
      },
      { property: "pH", lowEc: "5.2–6.8", highEc: "5.2–6.8" },
    ],
  },
  {
    label: "Growing Media Properties",
    icon: <Sprout />,
    rows: [
      {
        property: "Expansion Volume",
        lowEc: "16 Liters & above per KG",
        highEc: "15 Liters & above per KG",
      },
      { property: "Grade", lowEc: "6mm Sieved", highEc: "6mm Sieved" },
      { property: "Colour", lowEc: "Natural Brown", highEc: "Natural Brown" },
    ],
  },
  {
    label: "Processing & Application",
    icon: <Settings />,
    rows: [
      { property: "Material", lowEc: "100% Natural Coir Pith", highEc: "100% Natural Coir Pith" },
      { property: "Processing", lowEc: "Double Washed", highEc: "Unwashed" },
      {
        property: "Usage",
        lowEc: "Potting mix suppliers, greenhouses, hydroponic growers, etc.",
        highEc: "Plant growing and animal bedding",
      },
    ],
  },
];

const coirMattingSpecification = [
  { property: "Product Name", value: "Coir Matting (Carpet)" },
  { property: "Material", value: "100% Coconut Fibre" },
  { property: "Colour", value: "Natural Brown" },
  { property: "Weave Pattern", value: "Herringbone" },
  { property: "Technique", value: "Machine-made, full powerloom" },
  { property: "Mass per unit area", value: "2200 GSM" },
];

const coirMattingPacking = [
  {
    title: "Rolls wrapped in white or blue woven film",
    todo: "Coir Matting rolls wrapped in woven film photo from the client",
    alt: "Coir Matting roll packing photo",
  },
  {
    title: "Forklift handling",
    todo: "Coir Matting forklift handling photo from the client",
    alt: "Forklift handling Coir Matting rolls",
  },
  {
    title: "Container loading",
    todo: "Coir Matting container loading photo from the client",
    alt: "Coir Matting rolls being loaded into a container",
  },
  {
    title: "Container loading",
    todo: "Coir Matting container loading photo from the client",
    alt: "Coir Matting rolls loaded into a container",
  },
];

const coirMattingApplications = [
  {
    name: "Indoor & Outdoor Stairs",
    todo: "Coir Matting application photo: Indoor and Outdoor Stairs",
    alt: "Coir Matting used on indoor and outdoor stairs",
  },
  {
    name: "Residential Hallways",
    todo: "Coir Matting application photo: Residential Hallways",
    alt: "Coir Matting in a residential hallway",
  },
  {
    name: "Garden Pathways",
    todo: "Coir Matting application photo: Garden Pathways",
    alt: "Coir Matting along a garden pathway",
  },
  {
    name: "Function Halls",
    todo: "Coir Matting application photo: Function Halls",
    alt: "Coir Matting in a function hall",
  },
  {
    name: "Stairs and Walkways",
    todo: "Coir Matting application photo: Stairs and Walkways",
    alt: "Coir Matting on stairs and walkways",
  },
];

// TODO: confirm the µS/cm EC unit with the client; preserve the supplied unit until confirmed.
const gramBlockComparison = [
  { property: "Properties", gradeOne: "Low EC", gradeTwo: "Low EC" },
  { property: "Type", gradeOne: "Coco Coir Peat", gradeTwo: "Coco Coir Peat" },
  {
    property: "Form",
    gradeOne: "Bricks with Individual Packing",
    gradeTwo: "Bricks with Individual Packing",
  },
  { property: "Size", gradeOne: "18 × 10 × 8 cm", gradeTwo: "20 × 10 × 5 cm" },
  { property: "Moisture", gradeOne: "Below 15%", gradeTwo: "Below 15%" },
  { property: "EC", gradeOne: "Below 0.6 µS/cm", gradeTwo: "Above 1.5 µS/cm" },
  { property: "Weight", gradeOne: "630 to 660 Grams", gradeTwo: "650 Grams (+/- 50 Grams)" },
  { property: "Compression", gradeOne: "05:01", gradeTwo: "05:01" },
  { property: "pH", gradeOne: "5.2-6.8", gradeTwo: "5.2-6.8" },
  {
    property: "Expansion Volume",
    gradeOne: "10 to 11 liters per Piece",
    gradeTwo: "9 Liters & above per Piece",
  },
  { property: "Sand Ratio", gradeOne: "Below 3%", gradeTwo: "Below 5%" },
  { property: "Grade", gradeOne: "Standard, 6mm Sieved", gradeTwo: "Standard, 6mm Sieved" },
  { property: "Material", gradeOne: "Natural Coir Pith", gradeTwo: "Natural Coir Pith" },
  {
    property: "Usage",
    gradeOne: "Home Gardening, Potting Mix",
    gradeTwo: "Home Gardening, Potting Mix",
  },
  { property: "Colour", gradeOne: "Natural Brown", gradeTwo: "Natural Brown" },
  { property: "Features", gradeOne: "Washed", gradeTwo: "Unwashed" },
];

const gramBlockGroups = [
  { label: "Core Product", icon: <Layers3 />, rows: ["Properties", "Type", "Form"] },
  {
    label: "Physical Properties",
    icon: <PackageOpen />,
    rows: ["Size", "Moisture", "EC", "Weight", "Compression"],
  },
  {
    label: "Growing Media Properties",
    icon: <Sprout />,
    rows: ["pH", "Expansion Volume", "Sand Ratio", "Grade"],
  },
  {
    label: "Processing & Application",
    icon: <Settings />,
    rows: ["Material", "Usage", "Colour", "Features"],
  },
];

const gramBlockPackingOptions = [
  {
    number: "01",
    title: "Individual Plain Packing",
    description:
      "Each brick is individually shrink-wrapped in plain packaging without a label for convenient handling, storage, and retail distribution.",
    image: gramBrickIndividualPacking,
    alt: "Individually shrink-wrapped plain coco peat bricks",
  },
  {
    number: "02",
    title: "Bulk Packing in Pallets",
    description:
      "Individual bricks are shrink-wrapped with customer-specific labels, arranged in bulk on pallets, and securely strapped for efficient handling, storage, and transportation.",
    image: cocoBrickPalletPhoto,
    alt: "Palletised coco peat bricks wrapped for export",
  },
  {
    number: "03",
    title: "Carton Box Packing",
    description:
      "Individual bricks are shrink-wrapped with customer-specific labels, packed in corrugated cartons, and directly floor-loaded into a 40ft HC container for efficient space utilisation, product protection, and streamlined transportation and distribution.",
    image: gramBrickCartonPacking,
    alt: "650 gram coco peat bricks packed in a carton box",
  },
];

const huskChipsPackingOptions = [
  {
    title: "Individual Block Packing with Private Label",
    description:
      "Each block is individually shrink-wrapped with a customer-specific private label, offering customised branding for retail distribution and market requirements.",
    image: huskPrivateLabelPhoto,
    alt: "Individually packed coco husk chips with private label",
  },
  {
    title: "Bulk Packing in Pallets",
    description:
      "Blocks are stacked on pallets and securely strapped for convenient handling, efficient storage, and safe transportation.",
    image: huskPalletPhoto,
    alt: "Coco husk chips blocks stacked and strapped on pallets",
  },
  {
    title: "Direct Floor Loading",
    description:
      "Blocks are directly loaded onto the container floor without pallets, maximizing container space utilization and helping optimize shipping costs.",
    image: huskFloorLoadingPhoto,
    alt: "Blocks loaded directly onto the container floor",
  },
];

const huskChipsApplications = [
  { name: "Animal Bedding", image: animalBeddingPhoto },
  { name: "Mulch Medium", image: mulchMediumPhoto },
  { name: "Orchid Planting", image: orchidPlantingPhoto },
  { name: "Terrarium Substrate", image: terrariumSubstratePhoto },
];

const huskChipsSpecification = [
  {
    parameter: "Electrical Conductivity (EC)",
    value: "Low EC: ≤ 0.8 mS/cm (High EC: > 2.0 mS/cm)",
    downloadValue: "Low EC: ≤ 0.8 mS/cm (High EC: > 2.0 mS/cm)",
  },
  { parameter: "Colour", value: "Natural Brown", downloadValue: "Natural Brown" },
  { parameter: "Block Weight", value: "4 kg (± 200 g)", downloadValue: "4 kg (± 200 g)" },
  {
    parameter: "Expansion Volume (per kg)",
    value: "13–15 litres per kg",
    downloadValue: "13–15 litres per kg",
  },
  { parameter: "pH Level", value: "5.5–6.5", downloadValue: "5.5–6.5" },
  { parameter: "Moisture", value: "15–20%", downloadValue: "15–20%" },
  {
    parameter: "Block Size",
    value: "30 × 30 × 12 (± 2) cm",
    downloadValue: "30 × 30 × 12 (± 2) cm",
  },
  { parameter: "Compression Ratio", value: "5:1", downloadValue: "5:1" },
  { parameter: "Chips Size", value: "4–20 mm", downloadValue: "4–20 mm" },
  { parameter: "Sand / Impurities", value: "< 2%", downloadValue: "< 2%" },
];

function GalleryPhoto({
  photo,
  alt,
  className,
}: {
  photo: ProductGalleryPhoto;
  alt: string;
  className: string;
}) {
  if (!photo.image) {
    return <ImageSlot todo={photo.todo ?? alt} className={className} />;
  }
  return (
    <img
      src={photo.image}
      alt={alt}
      width={900}
      height={1100}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const canonicalSlug = legacyProductSlugRedirects[params.slug];
    if (canonicalSlug) {
      throw redirect({
        to: "/products/$slug",
        params: { slug: canonicalSlug },
        statusCode: 301,
      });
    }
    const product = products.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    const { industrySolutions, ...serializableProduct } = product;
    return serializableProduct;
  },
  head: ({ loaderData: product }) =>
    pageMeta(
      product?.name ?? "Product",
      product?.short ?? "Coco coir products from Arjuna Exports.",
      product ? `/products/${product.slug}` : "/products",
      product?.imageTodo ? undefined : product?.image,
    ),
  component: ProductDetail,
});
function ProductDetail() {
  const isVariantRoute = useRouterState({
    select: (state) => state.matches.some((match) => match.routeId === "/products/$slug/$variant"),
  });

  return isVariantRoute ? <Outlet /> : <ProductPageDetail />;
}

function ProductPageDetail() {
  const p = Route.useLoaderData();
  const isCocoPeatBlocks = p.slug === "coco-peat-blocks";
  const isCoirMatting = p.slug === "coir-matting";
  const isGramBlock = p.slug === "coco-peat-650g-bricks";
  const isHuskChips = p.slug === "coco-husk-chips";
  const hasVariants = Boolean(p.variantOptions?.length);
  const gallery = useMemo<ProductGalleryPhoto[]>(
    () =>
      (p.slug ? productGalleries[p.slug] : undefined) ??
      (p.imageTodo
        ? [{ todo: p.imageTodo, label: p.name }]
        : [
            { image: p.image, label: p.name },
            { image: img.stageMedium, label: "Prepared growing medium" },
            { image: img.processQuality, label: "Quality inspection" },
            { image: img.exportPort, label: "Export-ready shipment" },
          ]),
    [p.slug, p.imageTodo, p.name, p.image],
  );
  const [activePhoto, setActivePhoto] = useState<ProductGalleryPhoto>(
    gallery[0] ?? { image: p.image, label: p.name },
  );
  const [galleryPaused, setGalleryPaused] = useState(false);

  useEffect(() => {
    if (gallery[0]) {
      setActivePhoto(gallery[0]);
    }
  }, [gallery, p.slug]);

  useEffect(() => {
    if (gallery.length < 2 || galleryPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => {
      setActivePhoto((current) => {
        const currentIndex = gallery.findIndex(
          (photo) => photo.image === current?.image && photo.todo === current?.todo,
        );
        return gallery[(currentIndex + 1) % gallery.length] ?? current;
      });
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [gallery, galleryPaused]);

  const related = products.filter((product) => product.slug !== p.slug).slice(0, 3);
  const applicationVisuals = isHuskChips
    ? huskChipsApplications
    : (p.applications ?? []).map((name) => ({
        name,
        image: p.imageTodo
          ? undefined
          : (applications.find((application) => application.title === name)?.image ?? p.image),
        todo: p.imageTodo ? `${p.name} application photo: ${name}` : undefined,
      }));
  const isPackagingPhoto = activePhoto?.image
    ? [img.productCocoPeat5kg, img.productCocoPeat650g, img.productCocoHuskChips4kg].includes(
        activePhoto.image,
      )
    : false;
  const productStructuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.short,
    ...(!p.imageTodo && { image: new URL(p.image, "https://www.arjunaexports.com").toString() }),
    url: `https://www.arjunaexports.com/products/${p.slug}`,
    brand: { "@type": "Brand", name: "Arjuna Exports" },
    category: p.category,
    additionalProperty: p.specs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  }).replace(/</g, "\\u003c");
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productStructuredData }}
      />
      <section
        className={`relative overflow-hidden pt-20 lg:pt-[88px] ${isHuskChips ? "border-x-2 border-brand/20 bg-surface-teal-light" : isCoirMatting ? "bg-brand-soft" : "bg-ivory"}`}
      >
        <img
          src={coconutIcon}
          alt=""
          className="pointer-events-none absolute -right-24 top-24 hidden w-[340px] opacity-[0.05] lg:block"
          aria-hidden="true"
        />
        <div className="container py-8 lg:py-10">
          <Breadcrumbs
            className="mb-6"
            items={[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: p.name },
            ]}
          />
          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
            <div
              onMouseEnter={() => setGalleryPaused(true)}
              onMouseLeave={() => setGalleryPaused(false)}
              className="relative h-full min-h-[400px] w-full min-w-0 overflow-hidden rounded-md border border-brand/15 bg-pure-white shadow-[0_20px_60px_rgba(31,45,40,.12)] sm:min-h-[480px] lg:min-h-[540px]"
            >
              {isCocoPeatBlocks || isGramBlock || isHuskChips ? (
                <>
                  <div className="absolute inset-x-0 top-0 bottom-[84px] flex items-center justify-center bg-pure-white">
                    <GalleryPhoto
                      photo={activePhoto}
                      alt={activePhoto.label ?? p.name}
                      className="h-full w-full object-contain p-4 sm:p-6"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 overflow-x-auto bg-pure-white px-4 pb-4 pt-2 sm:px-5">
                    <div className="flex w-max gap-2">
                      {gallery.map((photo) => (
                        <button
                          key={photo.label}
                          type="button"
                          onClick={() => setActivePhoto(photo)}
                          aria-label={`Show ${photo.label}`}
                          aria-pressed={
                            activePhoto?.image === photo.image && activePhoto?.todo === photo.todo
                          }
                          className={`h-14 w-14 shrink-0 overflow-hidden rounded-sm border-2 bg-pure-white transition-opacity ${
                            activePhoto?.image === photo.image && activePhoto?.todo === photo.todo
                              ? "border-[#1B7F3B]"
                              : "border-brand/15 hover:opacity-70"
                          }`}
                        >
                          <GalleryPhoto
                            photo={photo}
                            alt=""
                            className="h-full w-full object-contain p-0.5"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : isPackagingPhoto ? (
                <div className="absolute inset-x-0 top-0 bottom-[84px] flex items-center justify-center bg-pure-white p-6 sm:p-8">
                  <GalleryPhoto
                    photo={activePhoto}
                    alt={activePhoto.label ?? p.name}
                    className="max-h-full w-auto max-w-full object-contain transition duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
                  />
                </div>
              ) : (
                <div className="absolute inset-x-0 top-0 bottom-[84px] flex items-center justify-center bg-pure-white p-4 sm:p-6">
                  <GalleryPhoto
                    photo={activePhoto}
                    alt={activePhoto.label ?? p.name}
                    className="max-h-full max-w-full object-contain transition duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                  />
                </div>
              )}
              {!isCocoPeatBlocks && !isGramBlock && !isHuskChips && (
                <div className="absolute inset-x-0 bottom-0 overflow-x-auto bg-pure-white px-4 pb-4 pt-2 sm:px-5">
                  <div className="flex w-max gap-2">
                    {gallery.map((photo) => {
                      return (
                        <button
                          key={photo.label}
                          type="button"
                          onClick={() => setActivePhoto(photo)}
                          aria-label={`Show ${photo.label}`}
                          aria-pressed={
                            activePhoto?.image === photo.image && activePhoto?.todo === photo.todo
                          }
                          className={`group relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border-2 bg-pure-white transition duration-300 ${
                            activePhoto?.image === photo.image && activePhoto?.todo === photo.todo
                              ? "border-aqua shadow-[0_0_0_3px_rgba(104,230,194,.18)]"
                              : "border-pure-white/30 opacity-75 hover:border-pure-white hover:opacity-100"
                          }`}
                        >
                          <GalleryPhoto
                            photo={photo}
                            alt=""
                            className="h-full w-full object-contain p-0.5"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {activePhoto.image && (
                <ImageZoomButton src={activePhoto.image} alt={activePhoto.label ?? p.name} />
              )}
            </div>
            <Reveal delay={100} className="flex h-full min-w-0 items-start py-0">
              <div className="w-full">
                {!isHuskChips && (
                  <Label className="text-brand">
                    {isGramBlock ? "ABOUT" : `${p.category} collection`}
                  </Label>
                )}
                <h1
                  className={`display mt-6 ${isCocoPeatBlocks || isGramBlock || isHuskChips || isCoirMatting ? "text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] whitespace-normal" : "max-w-[16ch] text-[clamp(2.5rem,4.2vw,4.5rem)] leading-[1.02]"}`}
                >
                  {p.name}
                </h1>
                <p
                  className={`mt-7 text-left text-charcoal/70 ${isCocoPeatBlocks || isGramBlock || isHuskChips || isCoirMatting ? "max-w-[560px] text-base font-normal leading-[1.7]" : "max-w-xl text-lg font-medium leading-relaxed"}`}
                >
                  {isHuskChips
                    ? "We supply premium Coco Husk Chips Blocks manufactured from natural coconut husk, compressed into compact blocks for efficient storage, transportation, and handling. When hydrated, the blocks expand into coco husk chips suitable for horticulture, potting mixes, and professional growing media applications."
                    : isGramBlock
                      ? "Arjuna Exports supplies premium 650g Coco Coir Bricks, manufactured from natural coconut husk fibres and processed into compact, lightweight blocks for convenient storage, transportation, and use. Once hydrated, these compressed coco coir bricks expand into a growing medium suitable for potting mixes, seed starting, nurseries, home gardening, and horticultural applications."
                      : isCocoPeatBlocks
                        ? "Coco Peat Blocks are manufactured from selected coconut husks, a natural by-product of the coconut and coir industry. The coir material is carefully washed, screened, graded, and compressed to produce consistent coco peat growing media. Our premium coco peat blocks are suitable for greenhouse cultivation, nurseries, potting mixes, and commercial horticulture. Available in washed, low EC, and customised specifications to meet specific growing requirements. Natural, renewable, and biodegradable, coco peat provides an efficient and sustainable growing medium for professional cultivation."
                        : isCoirMatting
                          ? "Made from 100% natural coir (coconut fibre), a by-product of coconut trees (Cocos nucifera), these carpets are completely biodegradable. Machine-woven from coir fibre yarn, they offer a perfect blend of sustainability and craftsmanship."
                          : p.short}
                </p>
                {isCoirMatting && (
                  <p className="mt-4 max-w-[560px] text-left text-base font-normal leading-[1.7] text-charcoal/70">
                    Coir Carpets are versatile and ideal for floor coverings in both indoor and
                    outdoor settings, including living rooms, hallways, staircases, cottages,
                    function halls, and exhibition centres. Their natural texture and resilience
                    make them suitable for both residential and commercial spaces.
                  </p>
                )}
                {isHuskChips && (
                  <p className="mt-4 max-w-[560px] text-left text-base font-normal leading-[1.7] text-charcoal/70">
                    Coco husk chips are valued for their ability to retain moisture while
                    maintaining air spaces within the growing medium, making them a useful component
                    in customised substrate blends. They can be used in potting mixes, nurseries,
                    greenhouse cultivation, and other horticultural applications, depending on the
                    required growing media specifications.
                  </p>
                )}
                {isGramBlock && (
                  <p className="mt-4 max-w-[560px] text-left text-base font-normal leading-[1.7] text-charcoal/70">
                    Our coco coir bricks offer excellent water retention, good aeration, and easy
                    handling, making them a practical choice for growers, garden centres,
                    distributors, and private-label brands. Available in customised specifications
                    to meet different application requirements, our 650 gram coco peat bricks
                    provide a convenient and space-efficient growing media solution for domestic and
                    international markets.
                  </p>
                )}
                {!isCocoPeatBlocks &&
                  !isGramBlock &&
                  !isHuskChips &&
                  !isCoirMatting &&
                  !hasVariants && (
                    <dl className="mt-10 grid gap-px overflow-hidden rounded-md border border-brand/15 bg-brand/15 sm:grid-cols-2">
                      <div className="bg-offwhite p-5 sm:p-6">
                        <dt className="micro-label text-brand">Available formats</dt>
                        <dd className="mt-3 text-sm font-semibold leading-relaxed">{p.format}</dd>
                      </div>
                      <div className="bg-offwhite p-5 sm:p-6">
                        <dt className="micro-label text-brand">Best suited for</dt>
                        <dd className="mt-3 text-sm font-semibold leading-relaxed">
                          {p.application}
                        </dd>
                      </div>
                    </dl>
                  )}
                <div
                  className={`${isCocoPeatBlocks || isGramBlock ? "mt-7" : "mt-9"} flex flex-wrap gap-3`}
                >
                  <Link
                    to="/contact"
                    search={{ product: p.slug, request: "quote" }}
                    aria-label={`Request a quote for ${p.name}`}
                    className="group inline-flex min-h-12 items-center gap-3 rounded-sm bg-primary-green px-6 text-sm font-semibold tracking-[0.04em] text-pure-white uppercase shadow-[var(--shadow-button)] transition-colors hover:bg-primary-green-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-green"
                  >
                    Request a quote <Arrow className="group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/contact"
                    search={{ product: p.slug, request: "sample" }}
                    aria-label={`Request a sample of ${p.name}`}
                    className="group inline-flex min-h-12 items-center gap-3 rounded-sm border border-brand px-6 text-sm font-semibold tracking-[0.04em] text-brand uppercase transition-colors hover:bg-brand hover:text-pure-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Request a sample <Arrow className="group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/contact"
                    search={{ product: p.slug, request: "quote" }}
                    className="group inline-flex min-h-12 items-center gap-3 rounded-sm border border-brand px-6 text-sm font-semibold tracking-[.04em] text-brand uppercase transition-colors hover:bg-brand hover:text-pure-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                  >
                    Request technical sheet <Arrow className="group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {hasVariants && (
        <section
          className="bg-surface-teal-light py-14 lg:py-20"
          aria-labelledby="variant-selector-title"
        >
          <div className="container">
            <Label className="text-brand">Choose a variant</Label>
            <h2 id="variant-selector-title" className="display mt-4 text-h2 text-heading">
              Available sizes and blends
            </h2>
            <nav
              className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              aria-label={`${p.name} variants`}
            >
              {p.variantOptions?.map((variant) => (
                <Link
                  key={variant.slug}
                  to="/products/$slug/$variant"
                  params={{ slug: p.slug, variant: variant.slug }}
                  className="flex min-h-12 items-center justify-between gap-4 rounded-sm border border-brand/20 bg-pure-white px-5 py-4 text-sm font-semibold text-brand-deep transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  {variant.label}
                  <Arrow />
                </Link>
              ))}
            </nav>
          </div>
        </section>
      )}

      {isHuskChips && (
        <section className="bg-ivory py-16 lg:py-20">
          <div className="container">
            <Reveal>
              <Label className="text-brand">KEY FEATURES</Label>
              <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)]">Key Features</h2>
            </Reveal>
            <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {huskChipsKeyFeatures.map(({ title, image }) => (
                <li
                  key={title}
                  className="relative flex min-h-36 items-center justify-center rounded-sm border border-brand/10 bg-pure-white p-3 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,70,65,.1)] sm:min-h-40"
                >
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="h-auto w-full max-w-[220px] object-contain"
                  />
                  <ImageZoomButton src={image} alt={title} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {!isCocoPeatBlocks &&
        !isGramBlock &&
        !isHuskChips &&
        !isCoirMatting &&
        !hasVariants &&
        p.overview && (
          <section className="bg-offwhite py-20 lg:py-28">
            <div className="container">
              <div className="grid gap-8 border-b border-brand/20 pb-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end lg:gap-16">
                <Reveal>
                  <Label className="text-brand">Product overview</Label>
                  <h2 className="display mt-6 max-w-[16ch] text-[clamp(2.25rem,4vw,4rem)]">
                    Engineered by nature. Refined for consistency.
                  </h2>
                </Reveal>
                <Reveal delay={100}>
                  <p className="text-left text-xl font-medium leading-[1.75] text-charcoal/75 lg:text-2xl">
                    {p.overview}
                  </p>
                </Reveal>
              </div>

              <Reveal delay={120} className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <figure className="group relative min-h-[380px] overflow-hidden rounded-md lg:min-h-[480px]">
                  <img
                    src={gallery[1]?.image ?? gallery[0]?.image}
                    alt={gallery[1]?.label ?? gallery[0]?.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <ImageZoomButton
                    src={gallery[1]?.image ?? gallery[0]?.image ?? p.image}
                    alt={gallery[1]?.label ?? gallery[0]?.label ?? p.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                  <figcaption className="micro-label absolute right-6 bottom-6 left-6 text-pure-white">
                    {gallery[1]?.label ?? gallery[0]?.label}
                  </figcaption>
                </figure>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:grid-rows-2">
                  {gallery.slice(2, 4).map((photo) => (
                    <figure
                      key={photo.label}
                      className="group relative min-h-[210px] overflow-hidden rounded-md"
                    >
                      <img
                        src={photo.image}
                        alt={photo.label}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      {photo.image && <ImageZoomButton src={photo.image} alt={photo.label} />}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                      <figcaption className="micro-label absolute right-5 bottom-5 left-5 text-pure-white">
                        {photo.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

      {!isHuskChips && !isCoirMatting && (
        <section className="bg-ivory py-16 lg:py-20">
          <div className="container">
            <Reveal>
              <div>
                <Label className="text-brand">KEY FEATURES</Label>
                <h2 className="display mt-5 text-[clamp(2rem,4vw,3.25rem)] leading-tight">
                  Key Features
                </h2>
              </div>
            </Reveal>

            {isCocoPeatBlocks || isGramBlock ? (
              <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {(isGramBlock ? gramBlockKeyFeatures : cocoPeatKeyFeatures).map(
                  ({ title, image }) => (
                    <li
                      key={title}
                      className="relative flex min-h-36 items-center justify-center rounded-sm border border-brand/10 bg-pure-white p-3 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,70,65,.1)] sm:min-h-40"
                    >
                      <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        className="h-auto w-full max-w-[220px] object-contain"
                      />
                      <ImageZoomButton src={image} alt={title} />
                    </li>
                  ),
                )}
              </ul>
            ) : hasVariants ? (
              <div className="mt-9">
                <FeatureGrid features={p.benefits} />
              </div>
            ) : (
              <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {p.benefits.map((benefit, index) => (
                  <li
                    key={benefit}
                    className="group flex min-h-36 flex-col items-center justify-center gap-4 rounded-sm border border-brand/10 bg-pure-white px-4 py-6 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(0,70,65,.1)]"
                  >
                    <PointArt index={index} className="h-12 w-12 shrink-0 text-brand" />
                    <span className="max-w-[26ch] text-base font-bold leading-snug text-brand">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {isCoirMatting && (
        <section className="bg-ivory py-14 lg:py-20">
          <div className="container">
            <div>
              <Label className="text-brand">STANDARD SIZES</Label>
              <ul className="mt-5 grid gap-3 text-sm font-semibold text-charcoal sm:grid-cols-2 lg:grid-cols-5">
                {[
                  "100 CM Wide x 50 Meter Length",
                  "120 CM Wide x 50 Meter Length",
                  "150 CM Wide x 50 Meter Length",
                  "180 CM Wide x 50 Meter Length",
                  "200 CM Wide x 50 Meter Length",
                ].map((size) => (
                  <li
                    key={size}
                    className="rounded-md border border-brand/15 bg-pure-white px-4 py-3"
                  >
                    {size}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {isCoirMatting && <CoirMattingFeatures />}

      <section
        className={`bg-brand-soft py-20 lg:py-28 ${isHuskChips ? "border-x-2 border-brand/20 bg-surface-teal-light" : ""}`}
      >
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <Label
                  className={
                    isCocoPeatBlocks || isGramBlock || isHuskChips ? "text-[#0B6B6B]" : "text-brand"
                  }
                >
                  {isCoirMatting
                    ? "PRODUCT SPECIFICATIONS"
                    : isCocoPeatBlocks || isGramBlock || isHuskChips
                      ? "TECHNICAL DATA"
                      : "Technical data"}
                </Label>
                <h2
                  className={`display ${isCocoPeatBlocks || isGramBlock || isHuskChips ? "mt-4 text-[clamp(1.4rem,3.5vw,2.5rem)] uppercase" : "mt-6 text-[clamp(2.25rem,3.5vw,3.75rem)]"}`}
                >
                  {isCoirMatting
                    ? "Product Specifications"
                    : isCocoPeatBlocks || isGramBlock || isHuskChips
                      ? "Product Technical Specifications"
                      : "Typical specification."}
                </h2>
              </div>
              {!isCocoPeatBlocks && !isGramBlock && (
                <span className="micro-label hidden text-charcoal/40 sm:block">
                  Subject to agreed order specification
                </span>
              )}
            </div>
            <div
              className={`mt-6 overflow-hidden rounded-md border border-brand/15 bg-pure-white ${isCocoPeatBlocks || isGramBlock || isCoirMatting ? "shadow-[0_12px_32px_rgba(31,45,40,.06)]" : "mt-10 shadow-[0_24px_80px_rgba(31,45,40,.08)]"}`}
            >
              {isCocoPeatBlocks ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-left text-[12px]">
                    <caption className="sr-only">
                      Product technical specifications for Coco Peat Blocks, including Low EC and
                      High EC options
                    </caption>
                    <thead>
                      <tr>
                        <th className="w-[18%] bg-brand" aria-label="Specification category" />
                        <th className="w-[19%] border-r border-pure-white/20 bg-brand px-4 py-3 text-left text-[11px] font-bold uppercase text-pure-white">
                          Parameter
                        </th>
                        <th className="w-[31.5%] border-r border-pure-white/20 bg-surface-teal-light px-4 py-3 text-center text-[11px] font-bold uppercase text-brand">
                          Low EC
                        </th>
                        <th className="w-[31.5%] bg-surface-teal-light px-4 py-3 text-center text-[11px] font-bold uppercase text-brand">
                          High EC
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cocoPeatTechnicalGroups.map((group) =>
                        group.rows.map((item, index) => (
                          <tr
                            key={`${group.label}-${item.property}`}
                            className={`${(index + group.rows.length) % 2 === 0 ? "bg-offwhite" : "bg-pure-white"}`}
                          >
                            {index === 0 && (
                              <th
                                rowSpan={group.rows.length}
                                className="relative border-r border-brand/10 bg-gradient-to-br from-[#e2f8f3] to-[#d1f2eb] p-0 text-center align-middle"
                              >
                                <CategoryCard
                                  icon={group.icon}
                                  label={
                                    group.label === "Core Product"
                                      ? "CORE\nPRODUCT"
                                      : group.label === "Physical Properties"
                                        ? "PHYSICAL\nPROPERTIES"
                                        : group.label === "Growing Media Properties"
                                          ? "GROWING\nMEDIA\nPROPERTIES"
                                          : "PROCESSING\n&\nAPPLICATION"
                                  }
                                />
                              </th>
                            )}
                            <th className="border-r border-charcoal/10 px-2 py-1.5 text-left text-[9px] font-bold text-charcoal">
                              {item.property}
                            </th>
                            <td className="border-r border-charcoal/10 px-2 py-1.5 text-[9px] font-semibold text-charcoal">
                              {item.lowEc}
                            </td>
                            <td className="px-2 py-1.5 text-[9px] font-semibold text-charcoal">
                              {item.highEc}
                            </td>
                          </tr>
                        )),
                      )}
                    </tbody>
                  </table>
                </div>
              ) : isGramBlock ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left text-[12px]">
                    <caption className="sr-only">
                      Coco Peat 650g Bricks Grade I and Grade II specification comparison
                    </caption>
                    <thead>
                      <tr>
                        <th className="w-[18%] bg-brand" aria-label="Specification category" />
                        <th className="w-[19%] border-r border-pure-white/20 bg-brand px-4 py-3 text-left text-[11px] font-bold uppercase text-pure-white">
                          Parameter
                        </th>
                        <th className="w-[31.5%] border-r border-pure-white/20 bg-brand px-3 py-3 text-center text-[12px] font-bold text-pure-white">
                          Coco Peat 650g Bricks - Grade I
                        </th>
                        <th className="w-[31.5%] bg-brand px-3 py-3 text-center text-[12px] font-bold text-pure-white">
                          Coco Peat 650g Bricks - Grade II
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gramBlockGroups.map((group) => {
                        const rows = group.rows.map((property) =>
                          gramBlockComparison.find((item) => item.property === property)!,
                        );
                        return rows.map((item, index) => (
                          <tr
                            key={`${group.label}-${item.property}`}
                            className={`${(index + rows.length) % 2 === 0 ? "bg-offwhite" : "bg-pure-white"}`}
                          >
                            {index === 0 && (
                              <th
                                rowSpan={rows.length}
                                className="relative border-r border-brand/10 bg-gradient-to-br from-[#e2f8f3] to-[#d1f2eb] p-0 text-center align-middle"
                              >
                                <CategoryCard
                                  icon={group.icon}
                                  label={
                                    group.label === "Core Product"
                                      ? "CORE\nPRODUCT"
                                      : group.label === "Physical Properties"
                                        ? "PHYSICAL\nPROPERTIES"
                                        : group.label === "Growing Media Properties"
                                          ? "GROWING\nMEDIA\nPROPERTIES"
                                          : "PROCESSING\n&\nAPPLICATION"
                                  }
                                />
                              </th>
                            )}
                            <th className="border-r border-charcoal/10 px-2 py-1.5 text-left text-[9px] font-bold text-charcoal">
                              {item.property}
                            </th>
                            <td className="border-r border-charcoal/10 px-2 py-1.5 text-[9px] font-semibold text-charcoal">
                              {item.gradeOne}
                            </td>
                            <td className="px-2 py-1.5 text-[9px] font-semibold text-charcoal">
                              {item.gradeTwo}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                  </table>
                </div>
              ) : isCoirMatting ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-left">
                    <caption className="sr-only">Coir Carpet Natural product specification</caption>
                    <thead>
                      <tr className="bg-brand text-pure-white">
                        <th className="w-1/2 border-r border-pure-white/20 px-6 py-3 text-center text-sm font-bold uppercase tracking-[.08em]">
                          Parameters
                        </th>
                        <th className="px-6 py-3 text-center text-sm font-bold uppercase tracking-[.08em]">
                          Values
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {coirMattingSpecification.map((item, index) => (
                        <tr
                          key={item.property}
                          className={`border-t border-charcoal/10 ${index % 2 === 0 ? "bg-pure-white" : "bg-offwhite"}`}
                        >
                          <th className="border-r border-charcoal/10 px-5 py-3 text-left text-sm font-bold text-charcoal">
                            {item.property}
                          </th>
                          <td className="px-5 py-3 text-left text-sm font-medium leading-relaxed text-charcoal">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isHuskChips ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] border-collapse text-left">
                    <caption className="sr-only">Coco Husk Chips technical specification</caption>
                    <thead>
                      <tr className="bg-brand-deep text-pure-white">
                        <th className="w-[12%] border-r border-pure-white/20 px-5 py-4 text-center text-sm font-bold uppercase tracking-[.08em]">
                          S.No
                        </th>
                        <th className="w-[48%] border-r border-pure-white/20 px-5 py-4 text-left text-sm font-bold uppercase tracking-[.08em]">
                          Parameters
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-bold uppercase tracking-[.08em]">
                          Low EC
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {huskChipsSpecification.map((item, index) => (
                        <tr
                          key={item.parameter}
                          className={`border-t border-charcoal/10 ${index % 2 === 0 ? "bg-pure-white" : "bg-offwhite"}`}
                        >
                          <td className="border-r border-charcoal/10 px-5 py-3 text-center text-sm font-bold text-brand">
                            {index + 1}
                          </td>
                          <th className="border-r border-charcoal/10 px-5 py-3 text-left text-sm font-bold text-charcoal">
                            {item.parameter}
                          </th>
                          <td className="px-5 py-3 text-left text-sm font-medium leading-relaxed text-charcoal">
                            {item.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <>
                  <div className="grid gap-px bg-charcoal/12 sm:grid-cols-3">
                    {p.specs.slice(0, 3).map((s) => (
                      <div key={s.label} className="bg-brand-deep p-6 text-pure-white">
                        <span className="micro-label text-aqua/80">{s.label}</span>
                        <strong className="mt-3 block text-2xl font-medium leading-tight">
                          {s.value}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <dl className="divide-y divide-charcoal/10 border-t border-charcoal/10">
                    {p.specs.slice(3).map((s) => (
                      <div
                        key={s.label}
                        className="grid gap-2 px-5 py-4 sm:grid-cols-[minmax(150px,.7fr)_1.3fr] sm:items-center sm:gap-8 sm:px-6"
                      >
                        <dt className="micro-label text-charcoal/50">{s.label}</dt>
                        <dd className="text-base font-semibold leading-snug text-charcoal sm:text-right">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
              <div
                className={`flex flex-col gap-3 border-t border-charcoal/10 bg-offwhite px-5 py-3 text-xs text-charcoal/70 sm:flex-row sm:items-center sm:justify-between ${isCocoPeatBlocks || isGramBlock || isHuskChips ? "" : "sm:py-4 sm:text-sm"}`}
              >
                <span className="flex items-center gap-2">
                  {(isCocoPeatBlocks || isGramBlock || isHuskChips) && (
                    <Info aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />
                  )}
                  {isHuskChips
                    ? "EC = Electrical Conductivity. Values shown are typical and can be adjusted to customer order specifications."
                    : "Values shown are typical and can be adjusted to customer order specifications."}
                </span>
                <Link
                  to="/contact"
                  search={{ product: p.slug, request: "quote" }}
                  className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  Request technical sheet <Arrow />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {(isCocoPeatBlocks || isGramBlock || isHuskChips || isCoirMatting) && (
        <section
          className={`py-12 lg:py-16 ${isHuskChips ? "border-x-2 border-brand/20 bg-surface-teal-light" : "bg-surface-cream"}`}
        >
          <div className="container">
            <div
              className={`mx-auto flex w-full flex-col ${isHuskChips ? "" : "xl:aspect-[16/9] xl:p-8"}`}
            >
              <Label className="mb-4 text-brand">
                {isCoirMatting ? "PACKING & LOGISTICS" : "PACKING OPTIONS"}
              </Label>
              <h2 className="display mb-7 whitespace-normal text-h2 leading-tight text-brand xl:whitespace-nowrap">
                {isCoirMatting ? "Packing & Logistics" : "Packing Options & Logistics"}
              </h2>
              <div
                className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${isGramBlock || isHuskChips ? "md:grid-cols-3" : "md:grid-cols-2 xl:min-h-0 xl:flex-1 xl:grid-cols-4"}`}
              >
                {(isCoirMatting
                  ? coirMattingPacking
                  : isHuskChips
                    ? huskChipsPackingOptions
                    : isGramBlock
                      ? gramBlockPackingOptions
                      : packingOptions
                ).map((option, index, options) => (
                  <article
                    key={option.title}
                    className={`flex flex-col border-brand/25 xl:h-full ${
                      index < options.length - 1 ? "border-b md:border-b-0 md:border-r" : ""
                    } ${index === 0 ? "md:border-r xl:border-r" : ""} ${
                      index === 2 ? "md:border-r-0 xl:border-r" : ""
                    }`}
                  >
                    {option.image ? (
                      <div className="relative h-56 w-full flex-none sm:h-64 xl:h-[56%]">
                        <img
                          src={option.image}
                          alt={option.alt}
                          width={600}
                          height={450}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full rounded-md object-cover"
                        />
                        <ImageZoomButton src={option.image} alt={option.alt} />
                      </div>
                    ) : (
                      <ImageSlot
                        todo={option.todo ?? `${p.name} packing image`}
                        className="h-56 w-full flex-none rounded-md sm:h-64 xl:h-[56%]"
                      />
                    )}
                    <div className="flex flex-1 flex-col px-5 py-5 xl:px-5 xl:py-4">
                      {Boolean(option.number && !isGramBlock && !isHuskChips) && (
                        <span className="text-[11px] font-bold tracking-[0.18em] text-brand">
                          {option.number}
                        </span>
                      )}
                      <h3
                        className={`display mt-3 min-h-[2.5em] text-h3 leading-tight text-brand ${isGramBlock || isHuskChips || isCoirMatting ? "text-center" : ""}`}
                      >
                        {option.title}
                      </h3>
                      {Boolean(option.description && !isCocoPeatBlocks) && (
                        <p className="mt-3 text-sm leading-body text-body-text">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {!isCoirMatting && (
        <section
          className={`bg-brand-soft py-20 lg:py-28 ${isHuskChips ? "border-x-2 border-brand/20 bg-surface-teal-light" : ""}`}
        >
          <div className="container">
            <Reveal>
              <Label className="text-brand">
                {isHuskChips ? "Applications Section" : "Applications"}
              </Label>
              {!isHuskChips && (
                <h2 className="display mt-6 text-[clamp(2.25rem,4vw,4rem)]">Where it performs.</h2>
              )}
            </Reveal>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {applicationVisuals.map((application, i) => (
                <Reveal
                  key={application.name}
                  delay={i * 70}
                  className={`group relative min-h-80 overflow-hidden ${isHuskChips ? "text-brand-deep" : ""}`}
                >
                  {application.image ? (
                    <>
                      <img
                        src={application.image}
                        alt={application.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <ImageZoomButton src={application.image} alt={application.name} />
                    </>
                  ) : (
                    <ImageSlot
                      todo={
                        ("todo" in application && application.todo) ||
                        `${p.name} application photo: ${application.name}`
                      }
                      className="absolute inset-0 h-full w-full"
                    />
                  )}
                  {application.image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-transparent to-transparent" />
                  )}
                  <div
                    className={`absolute inset-x-0 bottom-0 p-6 ${
                      application.image ? "text-pure-white" : "text-brand-deep"
                    }`}
                  >
                    {!isHuskChips && (
                      <span
                        className={`micro-label ${application.image ? "text-aqua" : "text-brand"}`}
                      >
                        Application
                      </span>
                    )}
                    <h3
                      className={`display mt-3 font-bold ${isHuskChips ? "text-2xl" : "text-3xl"}`}
                    >
                      {application.name}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {isCoirMatting && (
        <section className="bg-brand-soft py-14 lg:py-20">
          <div className="container">
            <Label className="text-brand">SUITABLE APPLICATIONS</Label>
            <h2 className="display mt-4 text-[clamp(2rem,4vw,3.25rem)]">Suitable Applications</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
              {coirMattingApplications.map((application) => (
                <figure key={application.name} className="overflow-hidden rounded-md bg-pure-white">
                  <ImageSlot todo={application.todo} className="aspect-[4/3] w-full" />
                  <figcaption className="px-3 py-3 text-center text-sm font-bold text-charcoal">
                    {application.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isCocoPeatBlocks && !isGramBlock && !isHuskChips && !isCoirMatting && !hasVariants && (
        <section className="grid bg-brand-deep text-pure-white lg:grid-cols-2">
          <div className="relative min-h-[440px] w-full">
            <img
              src={img.exportPort}
              alt="Export containers ready for shipping"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <ImageZoomButton src={img.exportPort} alt="Export containers ready for shipping" />
          </div>
          <div className="flex items-center px-6 py-16 sm:px-12 lg:p-16">
            <Reveal>
              <Label className="text-aqua">Packaging & shipping</Label>
              <h2 className="display mt-6 text-[clamp(2.25rem,4vw,4rem)]">
                Packed for the journey.
              </h2>
              <p className="mt-7 max-w-xl leading-relaxed text-pure-white/70">
                Compressed formats reduce transport volume. Private-label packaging and
                customer-configured loading are available in 20-foot and 40-foot full containers.
              </p>
              <SecondaryButton to="/contact" onDark className="mt-9">
                Discuss your shipment
              </SecondaryButton>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-offwhite py-20 lg:py-28">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Label className="text-brand">Related products</Label>
              <h2 className="display mt-6 text-[clamp(2.25rem,3.5vw,3.75rem)]">
                Continue exploring.
              </h2>
            </div>
            <TextLink to="/products" className="text-brand">
              View all products
            </TextLink>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {related.map((product, i) => (
              <Reveal key={product.slug} delay={i * 70} className="group">
                <div className="relative">
                  <a href={`/products/${product.slug}`} className="block">
                    <div
                      className={`aspect-[4/5] overflow-hidden rounded-md border border-brand/15 ${
                        product.imageTodo
                          ? "bg-brand-soft"
                          : "flex items-center justify-center bg-pure-white p-4"
                      }`}
                    >
                      {product.imageTodo ? (
                        <ImageSlot todo={product.imageTodo} className="h-full w-full" />
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="max-h-full w-auto max-w-full object-contain transition duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <span className="micro-label mt-6 block text-brand">{product.category}</span>
                    <h3 className="display mt-3 text-3xl transition-transform group-hover:-translate-y-1">
                      {product.name}
                    </h3>
                  </a>
                  {!product.imageTodo && <ImageZoomButton src={product.image} alt={product.name} />}
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-charcoal/20 pt-12 md:flex-row md:items-center">
            <h2 className="display max-w-2xl text-4xl">
              Need a crop-specific format or custom mix?
            </h2>
            <PrimaryButton to="/contact">Talk to our team</PrimaryButton>
          </div>
        </div>
      </section>
      <ContentTodo request="Confirm product-specific MOQ, lead times, export FAQ content and downloadable specification sheets." />
    </>
  );
}
