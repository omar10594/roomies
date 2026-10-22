# Roomies

Small shared-rent app on Cloudflare Workers and D1. Existing PINs, screens, tenant URLs and rent calculations are preserved.

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

The official cf CLI deploys `cloudflare.config.ts`, including its custom domain. Authenticate with `npx cf auth login`, or privately provision `CLOUDFLARE_API_TOKEN` with Workers script/route edit and D1 access. Wrangler has a separate login for D1 tools. Credentials must never be committed.

Development uses isolated local D1 storage. Initialize it from `schema.sql` using Cloudflare's local database tools. Never run seeds/push against production. Historical Drizzle/Turso tools remain reference material; the migrated runtime uses the `DB` binding, with no Turso URL/token.

The TypeScript compiler is version 7; the separately aliased TypeScript 6 API supports ESLint tooling during Microsoft's transition.

## Production operations

- Worker: `roomies`; https://roomies.lopezlopez.com.mx.
- D1: `roomies`; binding: `DB`. Export privately before structural changes.
- CPU ceiling: 100 ms/request; subrequests: 20/request.
- Application/error logs persist; invocation logs and traces are disabled.
- No Durable Objects, queues, schedules, image service or cache database.
- Legacy cookie/PIN authorization limitations remain an accepted deferred issue; this migration does not redesign authentication.

The 2026-10-22 migration compared every table's contents with Turso using hashes, checked foreign keys and preserved all records. The original Vercel deployment and Turso database remain recovery references; Vercel Git auto-deploy is disconnected. Avoid writing to both databases after cutover.

The old CNAME is preserved as `_migration-rollback-roomies.lopezlopez.com.mx` (DNS only). Before rollback, export any new D1 writes privately, reattach the domain to the retained Vercel project, remove the Worker domain mapping, restore the CNAME name `roomies`, and verify Vercel. New D1 writes are not replicated back to Turso.

## Dependency audit

The migrated production dependency audit reports zero known vulnerabilities. The full development-tool audit still reports unpatched `braces` advisories in the latest Next ESLint/Vinext build graph. These are build-time tools; the affected packages were not found in the deployed Worker bundle. Build trusted source only, and do not describe the entire development graph as clean.
