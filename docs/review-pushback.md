# Initial Review Pushback

## Summary

The proposed Postgres-plus-partitioning direction is plausible, but the design is not ready as a final tech spec. It starts with stack choices before pinning down the product query contract, retention policy, permission model, and latency targets.

## Main concerns

1. Capacity math needs correction.
   - `10M orders/week` is about `16.5 orders/sec` average, not `165 orders/sec`.
   - Total write volume must include order items, status changes, payments, refunds, courier updates, and audit events.

2. Active order count is likely understated.
   - Active rows equal order rate times order lifetime.
   - At `16.5 orders/sec` and a 45-minute active window, average active orders are roughly `45k`, before peak multipliers.

3. Delivery person lookup is missing.
   - The original requirement includes users, stores, and delivery people.
   - The spec needs a delivery-person access pattern and index.

4. Natural-language lookup is premature.
   - NL can be a later input layer over exact validated parameters.
   - It should not drive the initial storage design.

5. Direct `order_id` lookup needs a clear strategy.
   - Partitioned tables complicate global uniqueness and direct ID lookup.
   - The API should define whether callers always provide a time hint or whether a separate lookup path is needed.

6. Date bounds must be part of the query contract.
   - Monthly partitions work best when queries are time-bounded.
   - The API should prevent unbounded scans across all history.

7. Store-name resolution is underspecified.
   - Store names are not globally unique.
   - Historical lookups should prefer exact IDs, with UI disambiguation when names are used.

8. Cache should not be the primary performance plan.
   - Redis can help recent pages and dashboards.
   - Arbitrary historical lookup must still be efficient from the source of truth.

9. Order items are required for display.
   - Item search may be optional.
   - The `order_items` table itself is usually not optional.

10. Security and privacy rules are missing.
    - Define what each actor can see.
    - Include PII handling, audit logging, retention, deletion, and support/admin access.

## Questions to answer before build

- Who are all readers of historical order data?
- What exact filters are required for each reader?
- What are the p95 and p99 latency targets for recent and old history?
- How fresh must completed orders be in history?
- How long is data retained?
- Can users request deletion or anonymization?
- Do stores need dashboards and analytics, or only order lists?
- Does support need broad search by phone, email, address, payment, or refund?
- Is this single-region or multi-region?
- What is the expected peak read QPS by actor type?

## Recommendation

Use relational storage as the source of truth, but write the first tech spec around access patterns and constraints:

- Define exact actor permissions.
- Define query filters and required date bounds.
- Add indexes for user, store, delivery person, and order ID paths.
- Use keyset pagination only.
- Treat Redis as an optimization, not a correctness dependency.
- Defer natural-language lookup until the exact query service is proven.
