export const PRODUCT_DEVELOPMENT_STATUSES = [
  "IDEA",
  "IN_DEVELOPMENT",
  "REVIEW",
  "APPROVED_FOR_LAUNCH",
  "SYNCED_TO_SHOPIFY",
  "DROPPED",
] as const;

export type ProductDevelopmentStatus =
  (typeof PRODUCT_DEVELOPMENT_STATUSES)[number];

export const DEFAULT_PRODUCT_DEVELOPMENT_STATUS: ProductDevelopmentStatus =
  "IDEA";

export const PRODUCT_DEVELOPMENT_STATUS_LABELS: Record<
  ProductDevelopmentStatus,
  string
> = {
  IDEA: "Idea",
  IN_DEVELOPMENT: "In development",
  REVIEW: "Review",
  APPROVED_FOR_LAUNCH: "Approved for launch",
  SYNCED_TO_SHOPIFY: "Shopify draft created",
  DROPPED: "Dropped",
};

export const ACTIVE_PRODUCT_DEVELOPMENT_STATUSES: readonly ProductDevelopmentStatus[] = [
  "IDEA",
  "IN_DEVELOPMENT",
  "REVIEW",
  "APPROVED_FOR_LAUNCH",
] as const;

export const REVIEWABLE_PRODUCT_DEVELOPMENT_STATUSES: readonly ProductDevelopmentStatus[] = [
  "REVIEW",
  "APPROVED_FOR_LAUNCH",
] as const;

export function isProductDevelopmentStatus(
  value: unknown,
): value is ProductDevelopmentStatus {
  return (
    typeof value === "string" &&
    PRODUCT_DEVELOPMENT_STATUSES.includes(value as ProductDevelopmentStatus)
  );
}

export function parseProductDevelopmentStatus(
  value: unknown,
  fallback: ProductDevelopmentStatus = DEFAULT_PRODUCT_DEVELOPMENT_STATUS,
): ProductDevelopmentStatus {
  return isProductDevelopmentStatus(value) ? value : fallback;
}

export function isActiveProductDevelopmentStatus(
  status: ProductDevelopmentStatus,
): boolean {
  return ACTIVE_PRODUCT_DEVELOPMENT_STATUSES.includes(status);
}

export function isReviewableProductDevelopmentStatus(
  status: ProductDevelopmentStatus,
): boolean {
  return REVIEWABLE_PRODUCT_DEVELOPMENT_STATUSES.includes(status);
}

export function statusNeedsDevelopment(
  status: ProductDevelopmentStatus,
): boolean {
  return status === "IDEA" || status === "IN_DEVELOPMENT";
}
