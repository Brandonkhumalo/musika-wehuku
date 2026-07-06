import type { EggGrade, ProductType } from "@/lib/types";

export const PRODUCT_TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: "chick", label: "Day-old chicks" },
  { value: "egg", label: "Table eggs" },
];

export const EGG_GRADE_OPTIONS: { value: EggGrade; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "extra_large", label: "Extra large" },
];

export function unitLabel(productType: ProductType, quantity: number) {
  if (productType === "egg") return quantity === 1 ? "egg" : "eggs";
  return quantity === 1 ? "chick" : "chicks";
}

export function dateFieldLabel(productType: ProductType) {
  return productType === "egg" ? "Pack date" : "Hatch date";
}

export function priceFieldLabel(productType: ProductType) {
  return productType === "egg" ? "Price / egg" : "Price / chick";
}

export function productDisplayName(listing: { product_type: ProductType; breed: string }) {
  if (listing.breed) return listing.breed;
  return listing.product_type === "egg" ? "Table eggs" : "Day-old chicks";
}
