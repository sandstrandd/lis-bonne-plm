# MVP Build Plan

## Principle

Build the PLM in small, reviewable slices. The MVP should make imported product data easier to assess and approve before any Shopify write-sync exists.

## Slice 1: Repository Foundation

- Add project metadata, ignore rules, architecture notes, and MVP plan.
- Define the product lifecycle status vocabulary.
- Define deterministic readiness checks for product content quality.
- Define read-oriented Shopify scopes and app-level role permissions.
- Add the initial Prisma schema for Shopify sessions, local products, variants, and media.

## Slice 2: Shopify App Shell

- Add the Remix app shell, Shopify authentication, and Prisma client wiring.
- Store Shopify sessions through Prisma.
- Add protected routes and basic app navigation.
- Keep requested Shopify scopes read-only.

## Slice 3: Product Import Read Model

- Fetch products from Shopify using read scopes.
- Upsert imported products, variants, and media into local tables.
- Record import timestamps and source identifiers.
- Do not write product changes back to Shopify.

## Slice 4: PLM Workspace

- List local products with status, readiness score, and last-import time.
- Add product detail pages for reviewing content, variants, and media.
- Allow local status changes such as blocked, ready for review, approved, and archived.
- Preserve Shopify source data separately from local review decisions.

## Slice 5: Readiness Workflow

- Run readiness checks whenever a product is imported or edited locally.
- Show blocking readiness reasons in the product workspace.
- Let reviewers approve only products that satisfy the readiness checks.
- Track who approved a product and when.

## Post-MVP: Shopify Write-Sync

Write-sync should be designed only after the read model and approval workflow are stable. The design should cover scopes, conflict handling, audit history, rollback behavior, and merchant confirmation before requesting write permissions.
