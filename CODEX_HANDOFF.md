# Codex handoff: Lis Bonne PLM

This file is the working handoff for Codex. Build the project in small, reviewable steps. Do not attempt to implement the full PLM at once.

## Goal

Build a lightweight, Shopify-native product development workspace for Lis Bonne Atelier.

The app should sit beside Shopify, preferably as an embedded Shopify Admin app. Shopify remains the commerce system for sellable products, variants, prices, inventory, checkout and orders. This app owns pre-commerce product development: product ideas, collection planning, variants, costing, supplier context, samples, fit comments, decisions and approvals.

## Core principle

PLM owns product development before launch. Shopify owns commerce after launch.

Never store sensitive PLM data in Shopify. Never send costing, supplier private notes, sample notes, fit comments, approval comments or private decisions to Shopify.

## MVP phases

### MVP 0: Internal product workspace

Build this first. No Shopify write-sync yet.

Includes:

- Shopify app foundation
- Database foundation
- Product pipeline
- Product creation
- Product detail workspace
- Collection and season
- Category and owner
- Variants with Color and Size
- Simple costing and margin
- Supplier basics
- Sample rounds
- Fit comments
- Product decisions
- Creative approval
- Commercial approval
- Launch readiness

Does not include:

- Shopify productCreate
- Shopify variant sync
- Metafields
- Partial sync recovery
- Live product updates

### MVP 1: Shopify draft create

Build only after MVP 0 is usable.

Includes:

- Sync preview
- Whitelisted Shopify payload
- Forbidden field guard
- Create Shopify Product as DRAFT
- Create variants
- Save Shopify Product GID
- Save Shopify Variant GIDs
- Minimal app-owned metafields
- Basic sync log

### MVP 2: Robust sync

Build only after MVP 1 works.

Includes:

- Update Shopify draft
- Conflict detection
- Sync runs and sync steps
- Partial sync recovery
- Idempotency
- Sync lock
- Redacted logs
- Shopify status blocked handling

## Final MVP status model

Use this status model for the product development workflow:

```ts
export type ProductDevelopmentStatus =
  | "IDEA"
  | "IN_DEVELOPMENT"
  | "REVIEW"
  | "APPROVED_FOR_LAUNCH"
  | "SYNCED_TO_SHOPIFY"
  | "DROPPED";
```

UI labels:

- IDEA: Idea
- IN_DEVELOPMENT: In development
- REVIEW: Review
- APPROVED_FOR_LAUNCH: Approved for launch
- SYNCED_TO_SHOPIFY: Shopify draft created
- DROPPED: Dropped

Important: `SYNCED_TO_SHOPIFY` must never be shown as just "Synced". It should say "Shopify draft created" or "Shopify draft updated".

## Domain models to introduce over time

MVP 0 core:

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

Later:

- CommercialApprovalSnapshot
- CommercialApprovalWaiver
- RequirementWaiver
- ShopifySyncRun
- ShopifySyncStep
- ShopifySyncSnapshot

## Safety rules

Never send these fields or concepts to Shopify:

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

Shopify sync must be built from an explicit whitelist. Never do this:

```ts
const payload = { ...developmentProduct };
```

## First Codex task

Start with repository foundation only.

Create or update:

- README.md
- package.json
- .gitignore
- docs/MVP_BUILD_PLAN.md
- docs/ARCHITECTURE.md
- app/domain/status.ts
- app/domain/readiness.ts
- app/lib/permissions.server.ts
- prisma/schema.prisma

Do not implement Shopify write-sync in the first task.

## First acceptance criteria

- The repository has a clear project structure.
- The MVP phases are documented.
- The initial Prisma schema captures MVP 0 models at a draft level.
- Status and readiness helpers exist as small, testable TypeScript modules.
- No secrets are committed.
- No Shopify product creation code exists yet.
