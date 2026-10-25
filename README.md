# Roomies

Small shared-rent app on Cloudflare Workers and D1. Tenant URLs and rent calculations are preserved; individual tenant pages are public. Administration requires its own four-digit PIN.

## Development and deployment

Use Node >=24.22 (Node 26 is supported), then `npm ci`.

```sh
npm run dev                 # Vinext + local Cloudflare runtime, port 3000
npm run lint
npm run typecheck           # TypeScript 7 compiler
npm test
npm run build
npm run start
npm run deploy
```

The official cf CLI deploys `cloudflare.config.ts`, including its custom domain. Authenticate with `npx cf auth login`, or privately provision `CLOUDFLARE_API_TOKEN`. Deployment needs permission to edit this Worker and its domain routes, not database contents. Wrangler has a separate login for operator-controlled D1 changes. Credentials must never be committed.

Development uses isolated local D1 storage. Initialize it from `schema.sql` using Cloudflare's local database tools. Never reinitialize production. The runtime uses the `DB` binding, with no Turso URL/token. Old seed/push tools were removed.

The TypeScript compiler is version 7; the separately aliased TypeScript 6 API supports ESLint tooling during Microsoft's transition.

## Production operations

- Worker: `roomies`; https://roomies.lopezlopez.com.mx.
- D1: `roomies`; binding: `DB`. Review structural changes separately from deployments.
- CPU ceiling: 100 ms/request; subrequests: 20/request.
- Application/error logs persist; invocation logs and traces are disabled.
- No Durable Objects, queues, schedules, image service or cache database.
- Admin PIN: exactly four numeric characters, configurable in Settings, stored as a salted PBKDF2 hash. Existing PIN was preserved during migration.
- Sessions: random 256-bit credentials, only SHA-256 digests stored in D1, expire after 24 hours. Logout revokes its session; changing PIN revokes all sessions and renews the current one.
- All admin reads and mutations check authorization on the server. Login uses a native limit of five attempts/minute/IP; cookies are Secure, HttpOnly and SameSite=Strict.

The 2026-10-22 migration compared every table's contents with Turso using hashes, checked foreign keys and preserved all records. Vercel/Turso are retired; D1 is authoritative. Tenant PINs and their database column were removed on 2026-10-24. Business rows were preserved.

## Automatic deployment

GitHub Actions validates pull requests and publishes successful `main` pushes to Cloudflare. Manual runs are also available. The encrypted `CLOUDFLARE_API_TOKEN` repository secret is exposed only to the publish step. The account token is restricted to Roomies/Teacher Tools and the corresponding domains, expiring October 24, 2027; renew it privately before then. Workflow actions are pinned to reviewed commit revisions.

Database migrations are never run automatically by deployment. `migrations/0001-admin-sessions.sql` records the one-time schema change for the pre-session database; it is already applied in production. Converting an old plaintext PIN requires a private operator step using `hashPin`, coordinated with the authentication release; do not put PINs or hashes into migration files or command logs.

## Dependency audit

The full dependency graph, including development tools, reports zero known vulnerabilities as of 2026-10-24. CI audits every build; this is a dated registry result, not a guarantee against future advisories.
