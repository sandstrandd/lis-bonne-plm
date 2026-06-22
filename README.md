# Lis Bonne PLM

Lis Bonne PLM is the foundation for a lightweight, Shopify-native product development workspace for Lis Bonne Atelier. Shopify remains the commerce system; this app owns pre-commerce product development, approvals, samples, costing, and launch readiness.

## Current Scope

- Shopify Remix app foundation with Prisma-backed persistence.
- Product development status vocabulary for idea, development, review, approval, Shopify draft creation, and dropped states.
- Launch readiness helpers for deciding whether a development product can be approved for launch.
- Server-side permission constants for app roles and read-only Shopify scopes.
- Draft-level Prisma models for MVP 0: seasons, suppliers, development products, variants, costing, samples, fit comments, decisions, approvals, and activity logs.

Shopify product write-sync is intentionally out of scope for this foundation.

## Getting Started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create `.env` and set local environment values.

   At minimum, set `DATABASE_URL` for Prisma. For local SQLite development:

   ```sh
   DATABASE_URL="file:./dev.sqlite"
   ```

3. Generate the Prisma client:

   ```sh
   npm run db:generate
   ```

4. Create the local database:

   ```sh
   npm run db:migrate
   ```

## Project Structure

- `app/domain/status.ts`: product development status constants and helpers.
- `app/domain/readiness.ts`: launch readiness scoring and recommendations.
- `app/lib/permissions.server.ts`: app roles, permissions, and required Shopify scopes.
- `docs/MVP_BUILD_PLAN.md`: small, reviewable MVP milestones.
- `docs/ARCHITECTURE.md`: system boundaries and data model notes.
- `prisma/schema.prisma`: initial persistence model.

## Development Notes

- Keep Shopify writes behind a future explicit design step.
- Prefer small domain helpers with deterministic inputs and outputs.
- Never send costing, supplier private notes, sample notes, fit comments, approval comments, or private product decisions to Shopify.
