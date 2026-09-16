import { Armchair, ShoppingBag, Sparkles, Watch } from "lucide-react";
import type { Product } from "@/data/products";
import styles from "./products.module.css";

export function ProductIcon({ category }: { category: Product["category"] }) {
  const Icon = {
    "Home & Living": Armchair,
    Accessories: ShoppingBag,
    "Beauty & Care": Sparkles,
    Electronics: Watch,
  }[category];
  return (
    <span className={styles.productIcon} data-category={category}>
      <Icon aria-hidden="true" />
    </span>
  );
}
