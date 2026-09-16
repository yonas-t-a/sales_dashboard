export const productCategories = [
  "Home & Living",
  "Accessories",
  "Beauty & Care",
  "Electronics",
] as const;
export const productStatuses = ["Active", "Draft", "Archived"] as const;
export type Product = {
  id: string;
  name: string;
  sku: string;
  category: (typeof productCategories)[number];
  status: (typeof productStatuses)[number];
  priceCents: number;
  stock: number;
  description: string;
};
export const lowStockThreshold = 10;
export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Home Decor Range",
    sku: "HD-001",
    category: "Home & Living",
    status: "Active",
    priceCents: 8900,
    stock: 48,
    description:
      "A curated collection of decorative accents for everyday spaces.",
  },
  {
    id: "p2",
    name: "Disney Princess Pink Bag 18′",
    sku: "BG-018",
    category: "Accessories",
    status: "Active",
    priceCents: 4500,
    stock: 8,
    description: "Lightweight pink backpack with adjustable shoulder straps.",
  },
  {
    id: "p3",
    name: "Bathroom Essentials",
    sku: "BE-003",
    category: "Beauty & Care",
    status: "Active",
    priceCents: 3250,
    stock: 36,
    description: "Everyday bathroom accessories in a coordinated set.",
  },
  {
    id: "p4",
    name: "Apple Smartwatch",
    sku: "AW-004",
    category: "Electronics",
    status: "Active",
    priceCents: 29900,
    stock: 0,
    description: "Smartwatch for everyday activity tracking and notifications.",
  },
  {
    id: "p5",
    name: "Ceramic Table Lamp",
    sku: "HL-005",
    category: "Home & Living",
    status: "Active",
    priceCents: 6500,
    stock: 24,
    description: "Soft ambient lighting with a textured ceramic base.",
  },
  {
    id: "p6",
    name: "Wireless Headphones",
    sku: "EL-006",
    category: "Electronics",
    status: "Active",
    priceCents: 12900,
    stock: 6,
    description: "Over-ear headphones with wireless connectivity.",
  },
  {
    id: "p7",
    name: "Everyday Tote Bag",
    sku: "AC-007",
    category: "Accessories",
    status: "Active",
    priceCents: 2800,
    stock: 72,
    description: "Reusable canvas tote with a spacious main compartment.",
  },
  {
    id: "p8",
    name: "Botanical Hand Wash",
    sku: "BC-008",
    category: "Beauty & Care",
    status: "Active",
    priceCents: 1800,
    stock: 10,
    description: "Gentle hand wash with a fresh botanical fragrance.",
  },
  {
    id: "p9",
    name: "Linen Cushion Cover",
    sku: "HL-009",
    category: "Home & Living",
    status: "Draft",
    priceCents: 2400,
    stock: 30,
    description:
      "Neutral linen-blend cushion cover. Launch collection in preparation.",
  },
  {
    id: "p10",
    name: "Portable Bluetooth Speaker",
    sku: "EL-010",
    category: "Electronics",
    status: "Draft",
    priceCents: 5900,
    stock: 0,
    description: "Compact speaker for music on the go.",
  },
  {
    id: "p11",
    name: "Travel Organizer",
    sku: "AC-011",
    category: "Accessories",
    status: "Active",
    priceCents: 2200,
    stock: 18,
    description: "Keep small travel essentials neatly organized.",
  },
  {
    id: "p12",
    name: "Classic Desk Clock",
    sku: "HL-012",
    category: "Home & Living",
    status: "Archived",
    priceCents: 3500,
    stock: 4,
    description: "Previous-season analog desk clock.",
  },
];

export function stockLabel(stock: number) {
  return stock === 0
    ? "Out of stock"
    : stock <= lowStockThreshold
      ? "Low stock"
      : "In stock";
}
export function summarizeProducts(products: Product[]) {
  const active = products.filter((product) => product.status === "Active");
  return {
    total: products.filter((product) => product.status !== "Archived").length,
    active: active.length,
    low: active.filter(
      (product) => product.stock > 0 && product.stock <= lowStockThreshold,
    ).length,
    out: active.filter((product) => product.stock === 0).length,
  };
}
export function validateProduct(
  product: Product,
  products: Product[],
): string | null {
  if (!product.name.trim() || product.name.length > 100)
    return "Enter a product name between 1 and 100 characters.";
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{1,29}$/.test(product.sku))
    return "Use a SKU of 2–30 letters, numbers, hyphens, or underscores.";
  if (
    products.some(
      (existing) =>
        existing.id !== product.id &&
        existing.sku.toLowerCase() === product.sku.toLowerCase(),
    )
  )
    return "This SKU already exists. Use a unique SKU.";
  if (
    !productCategories.includes(product.category) ||
    !productStatuses.includes(product.status)
  )
    return "Choose a valid category and status.";
  if (
    !Number.isSafeInteger(product.priceCents) ||
    product.priceCents < 1 ||
    product.priceCents > 100000000
  )
    return "Enter a price between $0.01 and $1,000,000.";
  if (
    !Number.isSafeInteger(product.stock) ||
    product.stock < 0 ||
    product.stock > 1000000
  )
    return "Stock must be a whole number between 0 and 1,000,000.";
  if (product.description.length > 1000)
    return "Keep the description within 1,000 characters.";
  return null;
}
