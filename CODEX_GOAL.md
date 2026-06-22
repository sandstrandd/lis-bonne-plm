# Codex goal: MVP 0 foundation for Lis Bonne PLM

## Mission

Build the first usable foundation of Lis Bonne PLM, a lightweight Shopify-native product development workspace for Lis Bonne Atelier.

Do not build a full PLM. Do not build Shopify write-sync yet. The goal is to create a clean, reviewable foundation for MVP 0: the internal product workspace.

## Product outcome

A small fashion team should be able to:

1. Create an internal product idea quickly.
2. See products in a simple pipeline.
3. Add collection, category, owner and status.
4. Define planned variants using Color and Size.
5. Add simple costing inputs and calculate margin.
6. Add sample rounds and fit comments.
7. Record important product decisions.
8. Request and record Creative approval and Commercial approval.
9. See launch readiness blockers and warnings.

## Hard boundaries

Do not implement Shopify product creation in this goal.

Do not implement:

- productCreate
- productVariantsBulkCreate
- metafieldsSet
- Shopify draft sync
- sync preview
- partial sync recovery
- live product updates
- inventory
- orders
- purchase orders
- supplier portal
- full tech pack
- DAM

## Architectural direction

Use a small, maintainable Shopify app foundation. Prefer TypeScript. Keep business logic in small testable modules rather than burying it in route handlers or UI components.

Recommended structure:

```text
app/
  domain/
    status.ts
    readiness.ts
  lib/
    permissions.server.ts
    money.ts
  models/
    development-product.server.ts
    collection-season.server.ts
    supplier.server.ts
  routes/
  components/
prisma/
  schema.prisma
docs/
  ARCHITECTURE.md
  MVP_BUILD_PLAN.md
```

If the actual Shopify app template uses a different folder convention, adapt the structure but keep the same separation of concerns.

## Required first deliverable

Create a PR or commit that adds repository foundation only:

- README.md
- .gitignore
- package.json
- docs/MVP_BUILD_PLAN.md
- docs/ARCHITECTURE.md
- prisma/schema.prisma
- app/domain/status.ts
- app/domain/readiness.ts
- app/lib/permissions.server.ts
- app/lib/money.ts

## Status model

Use this product development status model:

```ts
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
```

UI labels:

```ts
export const PRODUCT_DEVELOPMENT_STATUS_LABELS = {
  IDEA: "Idea",
  IN_DEVELOPMENT: "In development",
  REVIEW: "Review",
  APPROVED_FOR_LAUNCH: "Approved for launch",
  SYNCED_TO_SHOPIFY: "Shopify draft created",
  DROPPED: "Dropped",
} as const;
```

Never show `SYNCED_TO_SHOPIFY` as just "Synced".

## Initial readiness model

Create a readiness helper that returns:

```ts
type ReadinessSeverity = "warning" | "blocking";
type ReadinessSection =
  | "overview"
  | "variants"
  | "costing"
  | "samples"
  | "fit"
  | "approvals";

type ReadinessItem = {
  code: string;
  label: string;
  section: ReadinessSection;
  severity: ReadinessSeverity;
};

type LaunchReadinessResult = {
  status: "NOT_READY" | "READY_WITH_WARNINGS" | "READY";
  blockers: ReadinessItem[];
  warnings: ReadinessItem[];
};
```

Initial blockers:

- Missing public title
- No planned variants
- Planned variant missing SKU
- Missing target retail price
- Missing Creative approval
- Missing Commercial approval
- Unresolved blocking fit comment

Initial warnings:

- Missing public description
- Missing public image
- Missing supplier
- Sample approved with comments
- High severity unresolved fit comment

## Initial Prisma scope

The first schema should cover MVP 0 only:

- Shop
- User
- CollectionSeason
- Supplier
- DevelopmentProduct
- DevelopmentVariant
- ProductCosting
- ProductSample
- FitComment
- ProductDecision
- Approval
- ActivityLog

Keep the schema understandable. Do not over-model advanced commercial waivers, requirement waivers or Shopify sync runs yet.

## Safety requirements

Sensitive data must remain internal. Do not create any Shopify write payloads yet.

Future Shopify sync must never include:

- purchase cost
- landed cost
- margin
- supplier contact details
- supplier private notes
- sample notes
- fit comments
- approval comments
- commercial override reasons
- private product decisions

## Acceptance criteria

The first Codex output is acceptable if:

1. The repository has a coherent TypeScript project foundation.
2. The MVP 0 domain is documented.
3. The initial Prisma schema is present and readable.
4. Status helpers are small and testable.
5. Readiness helpers are small and testable.
6. Permission helpers distinguish at least ADMIN, PRODUCT_LEAD, CREATIVE_APPROVER and VIEWER.
7. No Shopify write-sync is implemented.
8. No secrets are committed.
9. The work is small enough to review in one PR.

## Development style

Prefer simple, explicit code.

Do not introduce abstractions before they are needed.

Do not build UI before the domain model and helper functions are clear.

Use comments only where business rules need explanation.

If uncertain, choose the smallest robust implementation and document the assumption.
