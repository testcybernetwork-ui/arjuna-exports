export type ProductVariantDetails = {
  slug: string;
  label: string;
  title: string;
  description: string;
  specifications: { label: string; value: string }[];
  imageTodos: string[];
  applications?: string[];
  packaging?: string;
  containerLoading?: { label: string; value: string }[];
};

const growBagSharedSpecifications = [
  { label: "Material composition", value: "100% COCO COIR" },
  { label: "Grow bag", value: "Non-Woven Fabric or UV Stabilised Plastic Bag" },
  { label: "Material type", value: "Double Washed to Remove Salts" },
  { label: "Moisture content", value: "Less than 15%" },
  { label: "pH value", value: "5.2 to 6.8" },
  { label: "Electrical Conductivity (mS/cm)", value: "Less than 0.5 mS/cm" },
  { label: "Test method", value: "1 : 1.5 Wet Extraction Method" },
  { label: "Grow bag type", value: "Open Top Grow bag" },
];

const growBagApplications = [
  "Tomato cultivation",
  "Bell pepper cultivation",
  "Cucumber cultivation",
  "Blueberries and soft fruits",
  "Greenhouse vegetables",
  "Hydroponic cultivation",
  "Drip irrigation systems",
  "Soilless growing systems",
  "Nursery production",
  "Professional horticulture",
];

const growBagPackaging =
  "Compressed coco coir substrate is available in UV-treated open-top plastic grow bags and non-woven fabric grow bags. Each bag is supplied to the specified dimensions and substrate volume. Export packaging, labelling, pallet configuration, and private-label options are customisable to meet your order requirements.";

const growBagContainerLoading = [
  { label: "Container type", value: "40 ft High Cube (40 ft HQ)" },
  {
    label: "Loading method",
    value: "Palletised or direct floor-loaded, depending on product configuration",
  },
  {
    label: "Quantity per container",
    value:
      "Final loading quantity may vary depending on grow bag dimensions, substrate blend, compressed volume, moisture level, packaging and pallet configuration. For an accurate loading estimate, please contact us with your product specifications and order requirements.",
  },
];

const growBagVariants: ProductVariantDetails[] = [
  {
    slug: "half-gallon",
    label: "Half Gallon",
    title: "Coco Coir Grow Bag - Half Gallon",
    description:
      "Half Gallon Coco Coir Grow Bags are made from premium natural coco coir, providing an ideal growing medium for propagation and young plants. With excellent water-holding capacity and uniform moisture distribution, they help maintain a balanced air-to-water ratio for healthy root development. The carefully processed coir blend offers good drainage, consistent structure, and easy hydration, supporting vigorous plant growth.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "1.9 L (0.5 US gal)" },
      { label: "Expanded dimensions", value: "10 × 10 × 19 cm" },
      { label: "No. of drain holes", value: "4" },
    ],
    imageTodos: [
      "Half Gallon grow bag made with UV-stabilised plastic",
      "Half Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
  {
    slug: "1-gallon",
    label: "1 Gallon",
    title: "Coco Coir Grow Bag - 1 Gallon",
    description:
      "1 Gallon Coco Coir Grow Bags are manufactured from premium natural coco coir, creating an excellent growing medium for propagation and professional horticulture. Their superior water-holding capacity and uniform moisture distribution help maintain optimal growing conditions for healthy root development. The specially processed coir blend provides balanced aeration, efficient drainage, and easy expansion, encouraging stronger and healthier plant growth.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "3.8 L (1 US gal)" },
      { label: "Expanded dimensions", value: "15 × 15 × 17 cm" },
      { label: "No. of drain holes", value: "4" },
    ],
    imageTodos: [
      "1 Gallon grow bag made with UV-stabilised plastic",
      "1 Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
  {
    slug: "1-2-gallon",
    label: "1.2 Gallon",
    title: "Coco Coir Grow Bag - 1.2 Gallon",
    description:
      "1.2 Gallon Coco Coir Grow Bags offer a versatile coco coir growing medium designed to support healthy plant establishment and root development. With excellent water retention and consistent moisture distribution, they help create a favourable balance between air and water within the growing medium. The carefully processed coir blend ensures good drainage, uniform expansion, and a suitable environment for vigorous plant growth.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "4.5 L (1.2 US gal)" },
      { label: "Expanded dimensions", value: "15 × 15 × 20 cm" },
      { label: "No. of drain holes", value: "4" },
    ],
    imageTodos: [
      "1.2 Gallon grow bag made with UV-stabilised plastic",
      "1.2 Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
  {
    slug: "1-7-gallon",
    label: "1.7 Gallon",
    title: "Coco Coir Grow Bag - 1.7 Gallon",
    description:
      "1.7 Gallon Coco Coir Grow Bags are produced using premium natural coco coir to provide a high-performance growing medium for greenhouse cultivation and professional horticulture. Their excellent water-holding capacity and uniform water distribution help maintain consistent moisture levels while supporting adequate root-zone aeration. The specially prepared coir blend offers efficient drainage and uniform expansion, promoting healthy root development and vigorous plant growth.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "6.5 L (1.7 US gal)" },
      { label: "Expanded dimensions", value: "18 × 18 × 20 cm" },
      { label: "No. of drain holes", value: "4" },
    ],
    imageTodos: [
      "1.7 Gallon grow bag made with UV-stabilised plastic",
      "1.7 Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
  {
    slug: "2-gallon",
    label: "2 Gallon",
    title: "Coco Coir Grow Bag - 2 Gallon",
    description:
      "2 Gallon Coco Coir Grow Bags are made from premium natural coco coir, offering a dependable growing medium for commercial greenhouse cultivation. Designed to provide excellent water retention and uniform moisture distribution, they help maintain an ideal balance of air and water around plant roots. The carefully processed coir blend supports effective drainage, consistent expansion, and healthy root development for strong and vigorous plant growth.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "7.6 L (2 US gal)" },
      { label: "Expanded dimensions", value: "20 × 20 × 19 cm" },
      { label: "No. of drain holes", value: "6" },
    ],
    imageTodos: [
      "2 Gallon grow bag made with UV-stabilised plastic",
      "2 Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
  {
    slug: "3-gallon",
    label: "3 Gallon",
    title: "Coco Coir Grow Bag - 3 Gallon",
    description:
      "3 Gallon Coco Coir Grow Bags provide a premium coco coir growing medium for professional growers seeking consistent performance in commercial cultivation. Their excellent water-holding capacity and uniform moisture distribution help create favourable conditions for root growth and plant establishment. The specially processed coir blend promotes balanced aeration, efficient drainage, and uniform expansion, supporting healthy roots and vigorous plant development.",
    specifications: [
      ...growBagSharedSpecifications,
      { label: "Capacity", value: "11.4 L (3 US gal)" },
      { label: "Expanded dimensions", value: "20 × 20 × 29 cm" },
      { label: "No. of drain holes", value: "6" },
    ],
    imageTodos: [
      "3 Gallon grow bag made with UV-stabilised plastic",
      "3 Gallon grow bag made with non-woven fabric",
    ],
    applications: growBagApplications,
    packaging: growBagPackaging,
    containerLoading: growBagContainerLoading,
  },
];

const looseFillFeatures = [
  "Premium Quality Substrate",
  "High Volume Expansion",
  "Compressed for Easy Handling",
  "Low EC/Stable pH",
  "Double Washed",
  "Biodegradable",
];

const looseFillCommonSpecifications = [
  { label: "Material grade", value: "Triple Washed to Remove Salts" },
  { label: "Outer bag", value: "PP Bag" },
  { label: "Bag capacity", value: "50 L" },
  { label: "Moisture content", value: "70%" },
  { label: "pH value", value: "5.5 to 6.8" },
  { label: "Electrical Conductivity (mS/cm)", value: "Less than 0.5 mS/cm" },
  { label: "Test method", value: "1: 1.5 Wet Extraction Method" },
  { label: "Bags per pallet", value: "90" },
  { label: "Bags per 40 ft HC container", value: "1,900" },
];

const looseFillVariants: ProductVariantDetails[] = [
  {
    slug: "100-coco-coir",
    label: "100% Coco Coir",
    title: "50L Loose Fill Bag - 100% Coco Coir",
    description:
      "Made from 100% natural coco coir, this loose-fill growing medium supports healthy root development and plant growth. Its moisture-retention properties help maintain consistent hydration while providing air space around the roots. Suitable for greenhouse cultivation, nurseries, container gardening, and a wide range of crops. A versatile coco coir substrate for professional growers seeking a lightweight, easy-to-use growing medium.",
    specifications: [
      { label: "Product", value: "50L Loose Fill Bag - 100% Coco Coir" },
      { label: "Material", value: "100% Coco Coir" },
      ...looseFillCommonSpecifications,
    ],
    imageTodos: [
      "50L Loose Fill Bag - 100% Coco Coir product image",
      "50L Loose Fill Bag - 100% Coco Coir packaging image",
    ],
  },
  {
    slug: "70-coco-coir-30-perlite",
    label: "70% Coco Coir / 30% Perlite",
    title: "50L Loose Fill Bag - 70% Coco Coir 30% Perlite",
    description:
      "A growing medium blend of 70% coco coir and 30% perlite, designed to support root-zone aeration and drainage. Coco coir helps retain moisture, while perlite creates air spaces within the substrate. Ideal for greenhouse growing, nursery production, and container cultivation where a well-aerated medium is required. A versatile coco coir and perlite substrate for a wide range of plants and growing applications.",
    specifications: [
      { label: "Product", value: "50L Loose Fill Bag - 70% Coco Coir 30% Perlite" },
      { label: "Material", value: "70% Coco Coir and 30% Perlite" },
      ...looseFillCommonSpecifications,
    ],
    imageTodos: [
      "50L Loose Fill Bag - 70% Coco Coir 30% Perlite product image",
      "50L Loose Fill Bag - 70% Coco Coir 30% Perlite packaging image",
    ],
  },
  {
    slug: "70-coco-coir-30-husk-chips",
    label: "70% Coco Coir / 30% Husk Chips",
    title: "50L Loose Fill Bag - 70% Coco Coir 30% Husk Chips",
    description:
      "A substrate blend of 70% coco coir and 30% coco husk chips, combining moisture retention with a coarser structure. Coco coir helps hold water, while husk chips promote air space and drainage around plant roots. Suitable for greenhouse cultivation, container growing, and crops that require an airy, free-draining substrate. A practical coco coir and husk chips growing medium for professional growers and horticultural applications.",
    specifications: [
      { label: "Product", value: "50L Loose Fill Bag - 70% Coco Coir 30% Husk Chips" },
      { label: "Material", value: "70% Coco Coir and 30% Coco Husk Chips" },
      ...looseFillCommonSpecifications,
    ],
    imageTodos: [
      "50L Loose Fill Bag - 70% Coco Coir 30% Husk Chips product image",
      "50L Loose Fill Bag - 70% Coco Coir 30% Husk Chips packaging image",
    ],
  },
];

export const productVariantGroups = {
  "coco-coir-grow-bags": {
    variants: growBagVariants,
    features: [
      "Premium Quality Substrate",
      "High Volume Expansion",
      "Compressed for Easy Handling",
      "Low EC/Stable pH",
      "Double Washed",
      "Biodegradable",
    ],
  },
  "loose-fill-bags": {
    variants: looseFillVariants,
    features: looseFillFeatures,
  },
} as const;

export function findProductVariant(productSlug: string, variantSlug: string) {
  return productVariantGroups[productSlug as keyof typeof productVariantGroups]?.variants.find(
    (variant) => variant.slug === variantSlug,
  );
}
