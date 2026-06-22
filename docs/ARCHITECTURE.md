# Architecture

## System Boundary

Lis Bonne PLM is a Shopify embedded app backed by Remix and Prisma. The app stores a local PLM read model for imported Shopify products, then layers review status and readiness decisions on top of that local model.

The foundation does not mutate Shopify product data.

## Major Parts

- Shopify Admin: merchant entry point and source of product catalog data.
- Remix app: authenticated UI, route actions, and server loaders.
- Domain helpers: status and readiness logic that can be tested without Shopify.
- Prisma database: Shopify sessions plus local product, variant, and media records.
- Permissions layer: read-only Shopify scopes and app role permissions.

## Data Flow

1. A merchant opens the embedded Shopify app.
2. Shopify authentication creates or refreshes a local session.
3. Future import jobs read products from Shopify and upsert them into local tables.
4. Readiness checks evaluate local product records.
5. Reviewers manage local PLM status without writing back to Shopify.

## Product Lifecycle

Products use a small lifecycle vocabulary:

- `DRAFT`: imported or locally created, not yet assessed.
- `NEEDS_CONTENT`: missing required content for review.
- `READY_FOR_REVIEW`: passes readiness checks and can be reviewed.
- `APPROVED`: approved inside the PLM.
- `BLOCKED`: intentionally paused until a blocker is resolved.
- `ARCHIVED`: hidden from active PLM workflows.

## Readiness

Readiness is deterministic and based on product content. A product can enter review when it has a usable title, vendor, product type, description, at least one variant, SKU coverage, pricing coverage, and at least one media item.

The readiness helper returns a score, failed blocking reasons, and a recommended next status. It does not call Shopify and does not persist by itself.

## Permissions

The foundation requests only read-oriented Shopify scopes. App roles are separate from Shopify scopes:

- `owner`: can manage settings and local product review state.
- `editor`: can update local product review state and run readiness checks.
- `viewer`: can inspect products and readiness results.

Future Shopify write-sync must introduce new scopes through a dedicated design and review step.

## Persistence

The initial Prisma schema stores:

- Shopify sessions required by the embedded app.
- Local products keyed by shop and optional Shopify product ID.
- Variants and media belonging to local products.
- Local PLM state such as readiness score, readiness issues, approval metadata, and timestamps.

Shopify source identifiers are stored separately from local PLM state so the app can reason about readiness and approval without mutating merchant catalog data.
