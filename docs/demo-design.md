# Demo Design — Self-Guided Order History Console

## Purpose

Turn the demo from a console that needs narration into a **self-guided systems demo**: an interviewer opens the URL and can test the design claims themselves — scoped lookup, bounded search, keyset pagination, partition routing, permission denials, and lookup latency — without editing UUIDs or being walked through it.

It should land for three personas:
- **Backend** — query contract, indexes, partitioning, auth scoping, pagination.
- **Product** — a usable order-history lookup tool that feels real.
- **Systems** — scale math, latency instrumentation, and honest benchmark boundaries.

## Canonical scale numbers (single source of truth — keep in sync with `MVP_TECH_SPEC.md` §6)

- Baseline: **10M orders/week**
- ~**16.5 orders/sec** avg (~80/sec at ~5× meal peaks)
- ~**200 writes/sec** avg after amplification (~1,000/sec peak)
- ~**45k active orders** average (rate × ~45 min lifetime)
- ~**129M orders** online at 90 days
- ~**480 GB** hot (90 days), ~**1.9 TB/year**
- Stress headroom: **100M/week (10×)** → ~165/sec, ~4.8 TB/90d; same strategy holds.

**Proof posture:** the demo proves the *access pattern* (the contract). p95/p99 at 100M+ rows requires a benchmark and is labeled **"benchmark pending"** — never claimed from the seeded DB.

## Three modes

### 1. Guided Demo (scenario presets)
One-click named scenarios; no UUID editing. A **"Request details" drawer** reveals the real headers/params/IDs so it stays technically honest. Named entities must map to seeded data.

| Button | Demonstrates | Underlying call |
|---|---|---|
| Customer · Ava Chen's May orders | scoped customer history, bounded window | `GET /v1/orders` (customer header, May from/to) |
| Store · Nori Thai – Midtown | store-scoped history across customers | `GET /v1/orders` (store header) |
| Security · cross-store access | IDOR denial (403 / empty) | store-A header requesting store-B's order |
| Pagination · page 2 | keyset cursor, no OFFSET | `GET /v1/orders …&cursor=…` |
| Direct lookup · order detail | UUIDv7 → month-partition routing | `GET /v1/orders/:id` |
| Guard · window too wide | 93-day bound enforced (400) | `GET /v1/orders` (18-month window) |
| Deferred · item search | 501 deferred-path | `GET /v1/orders?item_id=…` |

### 2. Timing Lab
Per request, show three layers so DB time is separable from network/cold-start:
- **Browser round trip** — client `performance.now()` around `fetch`
- **API handler time** — Fastify `onRequest`→`onSend` hook
- **DB lookup time** — wrap `db.query` in `repository.ts`

Plus: rows returned, cursor present, partition window used, index path (**from EXPLAIN, not a hardcoded string**). Honest framing line: *"DB was 12 ms; the rest was Render cold-start/network."*

### 3. Scale Math
A visible panel (not buried in README) with the canonical numbers above and the bound:
`Bounded by: actor scope + date window + partition pruning + composite index + cursor`
plus the proof posture: `contract proven / 100M-row benchmark pending`.

## Backend instrumentation (low-conflict; owned outside `demo.ts`)

- `meta: { lookupMs, queryPath, partitionWindow }` on list/detail responses (demo mode), measured around `db.query` in `repository.ts`. Optionally also `Server-Timing: db;dur=…`.
- `GET /v1/orders?_explain=true` (or sibling route) → runs the same SQL under `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`, returns the plan. Surface **Partitions Removed**, **Index Cond**, **Execution Time**.
- **Bulk seed:** parameterize `scripts/seed.ts` to insert ~500–1,000 orders for named entities (Ava Chen, Nori Thai – Midtown, Bean & Batch) across 3–4 months, so pruning + pagination are real and the cursor check goes green.

## Honesty rules (non-negotiable)

- **No silent live→sample swap.** On `200` with 0 rows, show "Live — 0 results". Sample mode only on network/non-200 failure or an explicit toggle.
- The source indicator must always agree with the JSON response pane.
- Scale claims labeled proven vs. benchmark-pending.

## Build sequence (priority)

0. Lock **10M** everywhere — **done**.
1. **Bulk-seed Render** with named entities. *(biggest cascade: live data, green cursor check, real `lookupMs`)*
2. **Fix the silent live→sample swap** (honest empty state).
3. **Named scenario buttons + Request-details drawer** (incl. security deny + cursor page-2).
4. **Timing Lab** — backend `meta.lookupMs` + 3-layer client display.
5. **`?_explain=true` endpoint + EXPLAIN panel** (proves index + pruning).
6. **Scale Math panel** (canonical numbers + proof posture).
7. *(if time)* guided walkthrough. *(post-interview)* benchmark report page at 100M+ rows.

## Ownership / coordination

- **Backend** (seed params, `meta.lookupMs`, `_explain` endpoint): handled outside `demo.ts` to avoid collisions.
- **Frontend** (`demo.ts` modes/presets/panels): Codex owns `demo.ts`.
- **Shared contract:** the response `meta` shape and the named-entity IDs emitted by the seed — both sides must agree on these.

## Out of scope (now)

Real auth (verified JWT), courier paths, NL parsing, item search, analytics, cold-tier, full p95/p99 benchmark.
