export const PRODUCT_STATUSES = [
  "DRAFT",
  "NEEDS_CONTENT",
  "READY_FOR_REVIEW",
  "APPROVED",
  "BLOCKED",
  "ARCHIVED",
] as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const DEFAULT_PRODUCT_STATUS: ProductStatus = "DRAFT";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  DRAFT: "Draft",
  NEEDS_CONTENT: "Needs content",
  READY_FOR_REVIEW: "Ready for review",
  APPROVED: "Approved",
  BLOCKED: "Blocked",
  ARCHIVED: "Archived",
};

export const ACTIVE_PRODUCT_STATUSES: readonly ProductStatus[] = [
  "DRAFT",
  "NEEDS_CONTENT",
  "READY_FOR_REVIEW",
  "APPROVED",
  "BLOCKED",
] as const;

export const REVIEWABLE_PRODUCT_STATUSES: readonly ProductStatus[] = [
  "READY_FOR_REVIEW",
  "APPROVED",
] as const;

export function isProductStatus(value: unknown): value is ProductStatus {
  return (
    typeof value === "string" &&
    PRODUCT_STATUSES.includes(value as ProductStatus)
  );
}

export function parseProductStatus(
  value: unknown,
  fallback: ProductStatus = DEFAULT_PRODUCT_STATUS,
): ProductStatus {
  return isProductStatus(value) ? value : fallback;
}

export function isActiveProductStatus(status: ProductStatus): boolean {
  return ACTIVE_PRODUCT_STATUSES.includes(status);
}

export function isReviewableProductStatus(status: ProductStatus): boolean {
  return REVIEWABLE_PRODUCT_STATUSES.includes(status);
}

export function statusNeedsAttention(status: ProductStatus): boolean {
  return status === "NEEDS_CONTENT" || status === "BLOCKED";
}
