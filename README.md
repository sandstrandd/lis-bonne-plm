# Lis Bonne PLM

Lis Bonne PLM is the foundation for a lightweight product lifecycle workspace for Shopify merchants. The first milestone keeps the app read-oriented: model products locally, evaluate readiness, and prepare review workflows before any Shopify write-sync is introduced.

## Current Scope

- Shopify Remix app foundation with Prisma-backed persistence.
- Product status vocabulary for draft, content, review, approval, blocked, and archived states.
- Readiness evaluation helpers for deciding whether a product can enter review.
- Server-side permission constants for app roles and read-only Shopify scopes.
- Architecture and MVP planning docs.

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

- `app/domain/status.ts`: product lifecycle status constants and helpers.
- `app/domain/readiness.ts`: product readiness scoring and recommendations.
- `app/lib/permissions.server.ts`: app roles, permissions, and required Shopify scopes.
- `docs/MVP_BUILD_PLAN.md`: small, reviewable MVP milestones.
- `docs/ARCHITECTURE.md`: system boundaries and data model notes.
- `prisma/schema.prisma`: initial persistence model.

## Development Notes

- Keep Shopify writes behind a future explicit design step.
- Prefer small domain helpers with deterministic inputs and outputs.
- Store imported Shopify identifiers separately from local review state so local PLM decisions can evolve without mutating Shopify data.
