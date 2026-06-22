# MVP Build Plan

## Principle

Build the PLM in small, reviewable slices. MVP 0 is an internal product development workspace. Shopify write-sync comes later, after the local workflow is useful.

## Slice 1: Repository Foundation

- Add project metadata, ignore rules, architecture notes, and MVP plan.
- Define the product development status vocabulary from the handoff.
- Define deterministic launch readiness checks for development products.
- Define read-oriented Shopify scopes and app-level role permissions.
- Add the initial Prisma schema for MVP 0 domain models at a draft level.

## Slice 2: Shopify App Shell

- Add the Remix app shell, Shopify authentication, and Prisma client wiring.
- Store Shopify sessions through Prisma.
- Add protected routes and basic app navigation.
- Keep requested Shopify scopes read-only.

## Slice 3: Development Product Workspace

- Create and edit development products locally.
- Assign collection or season, category, owner, and supplier.
- Add variants with color and size.
- Track local product status through idea, development, review, and launch approval.

## Slice 4: Samples, Costing, and Decisions

- Add simple costing and margin fields.
- Record supplier basics and private supplier notes locally.
- Track sample rounds and fit comments.
- Capture product decisions and activity history.

## Slice 5: Readiness Workflow

- Run readiness checks whenever a development product changes.
- Show blocking readiness reasons in the product workspace.
- Track creative and commercial approvals.
- Let reviewers approve for launch only when readiness checks pass.
- Track who approved a product and when.

## Post-MVP: Shopify Write-Sync

Write-sync should be designed only after the read model and approval workflow are stable. The design should cover scopes, conflict handling, audit history, rollback behavior, and merchant confirmation before requesting write permissions.
