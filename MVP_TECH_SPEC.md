# MVP Tech Spec: Order History Lookup

## 1. Scope and Actors

Read-optimized historical order lookup. Actors: customer and store owner/staff. Courier access is deferred, but `delivery_person_id` is kept on the data model to avoid a painful migration later.

Out of scope for MVP:

- Natural-language parsing
- Courier-facing queries and permissions
- Item search indexes
- Cold-tier archive
- Analytics or a columnar serving store

## 2. Query Contract

Every read is scoped server-side by the authenticated principal and is time-bounded.

| Caller | Query | Required filters | Optional filters |
| --- | --- | --- | --- |
| Customer | Their own history | `user_id` from auth, date window or latest page | `store_id`, `status` |
| Store | Their store history | `store_id` in auth scope, date window or latest page | `user_id`, `status` |
| Either | One order | `order_id` | None |

Rules:

- No unbounded "all orders ever" reads.
- If `from`/`to` are omitted, the API returns the latest page with a bounded recent lookback.
- Keyset pagination only: `(created_at, order_id) < (:cursor_created_at, :cursor_order_id)`.
- Offset pagination is not allowed.
- Store-name resolution is UI-only. The lookup engine accepts IDs.

## 3. Data Model

### `orders`

Header/snapshot table. One row per order. Status is updated in place.

Fields:

- `order_id` UUIDv7
- `created_at`
- `user_id`
- `store_id`
- `delivery_person_id NULL`
- `status`
- `total_cents`
- `currency`
- `ship_address_ref`
- `payment_token_ref`

The table is monthly range-partitioned on `created_at` with primary key `(created_at, order_id)`.

### `order_items`

Required for rendering order details. Item search is deferred.

Fields:

- `order_id`
- `created_at`
- `line_no`
- `item_id`
- `name_snapshot`
- `quantity`
- `price_cents`

### `order_events`

Append-only lifecycle and audit events.

Fields:

- `order_id`
- `created_at`
- `seq`
- `event_type`
- `actor_id`
- `payload`

## 4. Indexes

Required:

- `orders(user_id, created_at DESC, order_id DESC)`
- `orders(store_id, created_at DESC, order_id DESC)`
- `orders(store_id, status)` partial index for active status rows
- `order_items(created_at, order_id, line_no)`
- `order_events(created_at, order_id, seq)`

Deferred:

- `orders(delivery_person_id, created_at DESC, order_id DESC)`
- Item-search indexes

## 5. Permission and Data Policy

- The principal's `user_id` or `store_id` comes from auth claims, never from the request body.
- Customer reads are limited to their own rows.
- Store reads are limited to stores in their authorized store scope.
- Address and payment data are stored as tokenized references, not raw PII or PAN.
- Support/admin reads require audit logging before they are enabled.
- MVP retention assumption: online for two years. Deletion requests anonymize PII references while retaining required financial/event records.
- Completed orders appear in history immediately through in-place status updates.

## 6. Capacity

Assumption: `100M` orders/week.

- Average order rate: about `165 orders/sec`.
- Write amplification: header + items + lifecycle/payment events, roughly `2,000 writes/sec` average and `10k writes/sec` peak.
- Active rows: about `450k` average at a 45-minute active lifetime, with `1-2M` possible at meal peaks.
- Storage estimate: about `3.7KB/order`, roughly `370GB/week`, `4.8TB` for 90 days, and `19TB/year`.
- Peak read QPS is still unknown and drives replica count.

## 7. Stack

- API: TypeScript and Fastify
- DB: PostgreSQL-compatible schema, intended for Aurora PostgreSQL
- Partitions: monthly range partitions on `created_at`
- Pooling: PgBouncer in production
- Cache: Redis later for recent pages and dashboard summaries only
- CI/IaC: GitHub Actions and Terraform later

## 8. MVP Implementation Choices

- Courier access is deferred, but the column exists.
- Item search is deferred. Item details are still stored and returned for order detail.
- Local auth uses explicit development headers to simulate token claims. Production should replace this with verified JWT/session claims.
- Default latest-page reads are bounded by `LATEST_LOOKBACK_DAYS`.
