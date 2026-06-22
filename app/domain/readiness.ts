import {
  type ProductStatus,
  parseProductStatus,
} from "./status";

export type ReadinessCheckKey =
  | "title"
  | "vendor"
  | "productType"
  | "description"
  | "variants"
  | "variantSkus"
  | "variantPrices"
  | "media"
  | "workflowStatus";

export type ReadinessCheck = {
  key: ReadinessCheckKey;
  label: string;
  passed: boolean;
  blocking: boolean;
  message?: string;
};

export type ReadinessVariantInput = {
  sku?: string | null;
  priceCents?: number | null;
};

export type ReadinessMediaInput = {
  url?: string | null;
  alt?: string | null;
};

export type ReadinessProductInput = {
  title?: string | null;
  vendor?: string | null;
  productType?: string | null;
  descriptionHtml?: string | null;
  status?: ProductStatus | string | null;
  variants?: ReadinessVariantInput[];
  media?: ReadinessMediaInput[];
};

export type ReadinessResult = {
  score: number;
  checks: ReadinessCheck[];
  blockingReasons: string[];
  canEnterReview: boolean;
  recommendedStatus: ProductStatus;
};

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function hasPositivePrice(value: number | null | undefined): boolean {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function check(
  key: ReadinessCheckKey,
  label: string,
  passed: boolean,
  message: string,
): ReadinessCheck {
  return {
    key,
    label,
    passed,
    blocking: true,
    message: passed ? undefined : message,
  };
}

export function evaluateProductReadiness(
  product: ReadinessProductInput,
): ReadinessResult {
  const status = parseProductStatus(product.status);
  const variants = product.variants ?? [];
  const media = product.media ?? [];

  const checks: ReadinessCheck[] = [
    check("title", "Title", hasText(product.title), "Add a product title."),
    check("vendor", "Vendor", hasText(product.vendor), "Add a vendor."),
    check(
      "productType",
      "Product type",
      hasText(product.productType),
      "Add a product type.",
    ),
    check(
      "description",
      "Description",
      hasText(product.descriptionHtml),
      "Add a product description.",
    ),
    check(
      "variants",
      "Variants",
      variants.length > 0,
      "Add at least one variant.",
    ),
    check(
      "variantSkus",
      "Variant SKUs",
      variants.length > 0 && variants.every((variant) => hasText(variant.sku)),
      "Add SKUs to every variant.",
    ),
    check(
      "variantPrices",
      "Variant prices",
      variants.length > 0 &&
        variants.every((variant) => hasPositivePrice(variant.priceCents)),
      "Add prices to every variant.",
    ),
    check(
      "media",
      "Media",
      media.some((item) => hasText(item.url)),
      "Add at least one product media item.",
    ),
    check(
      "workflowStatus",
      "Workflow status",
      status !== "BLOCKED" && status !== "ARCHIVED",
      "Move the product out of blocked or archived status.",
    ),
  ];

  const passedCount = checks.filter((item) => item.passed).length;
  const blockingReasons = checks
    .filter((item) => item.blocking && !item.passed)
    .map((item) => item.message ?? item.label);
  const canEnterReview = blockingReasons.length === 0;

  let recommendedStatus: ProductStatus = "NEEDS_CONTENT";

  if (status === "BLOCKED" || status === "ARCHIVED" || status === "APPROVED") {
    recommendedStatus = status;
  } else if (canEnterReview) {
    recommendedStatus = "READY_FOR_REVIEW";
  }

  return {
    score: Math.round((passedCount / checks.length) * 100),
    checks,
    blockingReasons,
    canEnterReview,
    recommendedStatus,
  };
}
