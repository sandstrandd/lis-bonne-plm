import {
  type ProductDevelopmentStatus,
  parseProductDevelopmentStatus,
} from "./status";

export type ReadinessCheckKey =
  | "name"
  | "collectionSeason"
  | "category"
  | "owner"
  | "supplier"
  | "variants"
  | "costing"
  | "sample"
  | "creativeApproval"
  | "commercialApproval"
  | "workflowStatus";

export type ReadinessCheck = {
  key: ReadinessCheckKey;
  label: string;
  passed: boolean;
  blocking: boolean;
  message?: string;
};

export type ReadinessVariantInput = {
  color?: string | null;
  size?: string | null;
};

export type ReadinessCostingInput = {
  purchaseCostCents?: number | null;
  landedCostCents?: number | null;
  retailPriceCents?: number | null;
};

export type ReadinessApprovalInput = {
  type: "CREATIVE" | "COMMERCIAL";
  status: "PENDING" | "APPROVED" | "REJECTED" | "WAIVED";
};

export type DevelopmentProductReadinessInput = {
  title?: string | null;
  workingName?: string | null;
  collectionSeasonId?: string | null;
  category?: string | null;
  ownerId?: string | null;
  supplierId?: string | null;
  status?: ProductDevelopmentStatus | string | null;
  variants?: ReadinessVariantInput[];
  costing?: ReadinessCostingInput | null;
  sampleCount?: number | null;
  approvals?: ReadinessApprovalInput[];
};

export type ReadinessResult = {
  score: number;
  checks: ReadinessCheck[];
  blockingReasons: string[];
  canApproveForLaunch: boolean;
  recommendedStatus: ProductDevelopmentStatus;
};

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

function hasPositiveAmount(value: number | null | undefined): boolean {
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
  product: DevelopmentProductReadinessInput,
): ReadinessResult {
  const status = parseProductDevelopmentStatus(product.status);
  const variants = product.variants ?? [];
  const approvals = product.approvals ?? [];
  const hasApproval = (type: ReadinessApprovalInput["type"]) =>
    approvals.some(
      (approval) =>
        approval.type === type &&
        (approval.status === "APPROVED" || approval.status === "WAIVED"),
    );

  const checks: ReadinessCheck[] = [
    check(
      "name",
      "Name",
      hasText(product.title) || hasText(product.workingName),
      "Add a product title or working name.",
    ),
    check(
      "collectionSeason",
      "Collection or season",
      hasText(product.collectionSeasonId),
      "Assign a collection or season.",
    ),
    check("category", "Category", hasText(product.category), "Add a category."),
    check("owner", "Owner", hasText(product.ownerId), "Assign an owner."),
    check(
      "supplier",
      "Supplier",
      hasText(product.supplierId),
      "Assign a supplier.",
    ),
    check(
      "variants",
      "Variants",
      variants.length > 0 &&
        variants.every(
          (variant) => hasText(variant.color) && hasText(variant.size),
        ),
      "Add at least one variant with color and size.",
    ),
    check(
      "costing",
      "Costing",
      Boolean(
        product.costing &&
          hasPositiveAmount(product.costing.purchaseCostCents) &&
          hasPositiveAmount(product.costing.retailPriceCents),
      ),
      "Add purchase cost and retail price.",
    ),
    check(
      "sample",
      "Sample",
      (product.sampleCount ?? 0) > 0,
      "Record at least one sample round.",
    ),
    check(
      "creativeApproval",
      "Creative approval",
      hasApproval("CREATIVE"),
      "Capture creative approval.",
    ),
    check(
      "commercialApproval",
      "Commercial approval",
      hasApproval("COMMERCIAL"),
      "Capture commercial approval.",
    ),
    check(
      "workflowStatus",
      "Workflow status",
      status !== "DROPPED",
      "Move the product out of dropped status.",
    ),
  ];

  const passedCount = checks.filter((item) => item.passed).length;
  const blockingReasons = checks
    .filter((item) => item.blocking && !item.passed)
    .map((item) => item.message ?? item.label);
  const canApproveForLaunch = blockingReasons.length === 0;

  let recommendedStatus: ProductDevelopmentStatus = "IN_DEVELOPMENT";

  if (status === "DROPPED" || status === "SYNCED_TO_SHOPIFY") {
    recommendedStatus = status;
  } else if (canApproveForLaunch) {
    recommendedStatus = "APPROVED_FOR_LAUNCH";
  } else if (status === "REVIEW" || status === "APPROVED_FOR_LAUNCH") {
    recommendedStatus = "REVIEW";
  }

  return {
    score: Math.round((passedCount / checks.length) * 100),
    checks,
    blockingReasons,
    canApproveForLaunch,
    recommendedStatus,
  };
}
