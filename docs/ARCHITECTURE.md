# Architecture

## System Boundary

Lis Bonne PLM is a Shopify embedded app backed by Remix and Prisma. The app stores a local PLM workspace for pre-commerce product development: ideas, variants, costing, supplier context, samples, fit comments, decisions, approvals, and launch readiness.

The foundation does not mutate Shopify product data.

## Major Parts

- Shopify Admin: merchant entry point.
- Remix app: authenticated UI, route actions, and server loaders.
- Domain helpers: status and readiness logic that can be tested without Shopify.
- Prisma database: Shopify sessions plus MVP 0 PLM records.
- Permissions layer: read-only Shopify scopes and app role permissions.

## Data Flow

1. A merchant opens the embedded Shopify app.
2. Shopify authentication creates or refreshes a local session.
3. Users create and manage development products locally.
4. Readiness checks evaluate local product development records.
5. Reviewers manage local approvals without writing back to Shopify.

## Product Lifecycle

Development products use the handoff status vocabulary:

- `IDEA`: early product idea.
- `IN_DEVELOPMENT`: active development work.
- `REVIEW`: ready for creative and commercial review.
- `APPROVED_FOR_LAUNCH`: approved locally for launch.
- `SYNCED_TO_SHOPIFY`: Shopify draft created or updated in a later phase.
- `DROPPED`: removed from active development.

## Readiness

Readiness is deterministic and based on local PLM data. A product can be approved for launch when it has a name, collection or season, category, owner, supplier, variants with color and size, costing, a sample, and creative and commercial approvals.

The readiness helper returns a score, failed blocking reasons, and a recommended next status. It does not call Shopify and does not persist by itself.

## Permissions

The foundation requests only read-oriented Shopify scopes. App roles are separate from Shopify scopes:

- `owner`: can manage settings and local PLM records.
- `editor`: can update local PLM records and run readiness checks.
- `viewer`: can inspect PLM records and readiness results.

Future Shopify write-sync must introduce new scopes through a dedicated design and review step.

## Persistence

The initial Prisma schema stores:

- Shopify sessions required by the embedded app.
- Shops, users, collection seasons, and suppliers.
- Development products and variants.
- Product costing, sample rounds, fit comments, decisions, approvals, and activity logs.

Sensitive PLM data remains local. Costing, supplier private notes, sample notes, fit comments, approval comments, and private product decisions must never be sent to Shopify.
