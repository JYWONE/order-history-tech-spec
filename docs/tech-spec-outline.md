# Order History Lookup Tech Spec Outline

## Problem

We need a system that lets users, stores, and delivery people look up historical food orders at high volume.

## Success criteria

- Recent and historical order lookup is fast and reliable.
- Query paths are explicitly indexed and paginated.
- Authorization rules are enforced for each actor type.
- Storage lifecycle and retention expectations are documented.
- The system can scale from the current estimate without an early rewrite.

## Actors

- User: can view their own historical orders.
- Store: can view orders for stores they are authorized to manage.
- Delivery person: can view deliveries assigned to them, subject to retention and privacy rules.
- Support/admin: access requires audit logging and stricter controls.

## Core access patterns

- Lookup by `order_id`.
- User order history by `user_id`, time range, and optional filters.
- Store order history by `store_id`, time range, and optional filters.
- Delivery person history by `delivery_person_id`, time range, and optional filters.
- Recent order page for each actor.

## Candidate data model

- `active_orders`: in-flight orders with high update churn.
- `orders`: historical order headers/snapshots.
- `order_items`: order line items required for display; separately decide whether they are searchable.
- `order_events`: append-only lifecycle and audit events.

## Indexing direction

- `(user_id, created_at DESC, order_id DESC)`
- `(store_id, created_at DESC, order_id DESC)`
- `(delivery_person_id, created_at DESC, order_id DESC)`
- Direct lookup strategy for `order_id`
- Optional item-search indexes only after product confirmation.

## API constraints

- Require keyset pagination.
- Avoid unbounded "all history" queries.
- Prefer exact identifiers in API parameters.
- Treat natural-language lookup as an optional input layer that emits validated parameters, not SQL.

## Operational questions

- Retention period and deletion rules.
- Hot versus cold data SLA.
- Peak read QPS by actor type.
- Expected order lifecycle write amplification.
- Cache invalidation rules.
- Region, availability, and disaster recovery requirements.

## Validation plan

- Load-test representative reads and writes.
- Confirm partition pruning on historical lookups.
- Track slow queries and index hit rate.
- Test authorization boundaries for every actor type.
- Verify cache correctness on order creation and status updates.
