CREATE TYPE order_status AS ENUM (
  'placed',
  'confirmed',
  'preparing',
  'picked_up',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
  'disputed'
);

CREATE TABLE orders (
  order_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  user_id uuid NOT NULL,
  store_id uuid NOT NULL,
  delivery_person_id uuid NULL,
  status order_status NOT NULL,
  total_cents bigint NOT NULL CHECK (total_cents >= 0),
  currency char(3) NOT NULL CHECK (currency = upper(currency)),
  ship_address_ref text NULL,
  payment_token_ref text NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (created_at, order_id)
) PARTITION BY RANGE (created_at);

CREATE TABLE order_items (
  order_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  line_no integer NOT NULL CHECK (line_no > 0),
  user_id uuid NOT NULL,
  store_id uuid NOT NULL,
  item_id uuid NOT NULL,
  name_snapshot text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price_cents bigint NOT NULL CHECK (price_cents >= 0),
  currency char(3) NOT NULL CHECK (currency = upper(currency)),
  PRIMARY KEY (created_at, order_id, line_no),
  FOREIGN KEY (created_at, order_id) REFERENCES orders (created_at, order_id) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);

CREATE TABLE order_events (
  order_id uuid NOT NULL,
  created_at timestamptz NOT NULL,
  seq integer NOT NULL CHECK (seq > 0),
  event_type text NOT NULL,
  actor_id uuid NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (created_at, order_id, seq),
  FOREIGN KEY (created_at, order_id) REFERENCES orders (created_at, order_id) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);

CREATE INDEX idx_orders_user_history
  ON orders (user_id, created_at DESC, order_id DESC);

CREATE INDEX idx_orders_store_history
  ON orders (store_id, created_at DESC, order_id DESC);

CREATE INDEX idx_orders_store_active
  ON orders (store_id, status, created_at DESC, order_id DESC)
  WHERE status IN ('placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery');

CREATE INDEX idx_order_items_detail
  ON order_items (created_at, order_id, line_no);

CREATE INDEX idx_order_events_detail
  ON order_events (created_at, order_id, seq);

CREATE OR REPLACE FUNCTION ensure_order_history_monthly_partitions(
  start_month date,
  month_count integer
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  partition_start date;
  partition_end date;
  suffix text;
BEGIN
  IF month_count < 1 THEN
    RAISE EXCEPTION 'month_count must be positive';
  END IF;

  FOR month_offset IN 0..(month_count - 1) LOOP
    partition_start := (date_trunc('month', start_month)::date + (month_offset || ' months')::interval)::date;
    partition_end := (partition_start + interval '1 month')::date;
    suffix := to_char(partition_start, 'YYYY_MM');

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
      'orders_' || suffix,
      partition_start,
      partition_end
    );

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF order_items FOR VALUES FROM (%L) TO (%L)',
      'order_items_' || suffix,
      partition_start,
      partition_end
    );

    EXECUTE format(
      'CREATE TABLE IF NOT EXISTS %I PARTITION OF order_events FOR VALUES FROM (%L) TO (%L)',
      'order_events_' || suffix,
      partition_start,
      partition_end
    );
  END LOOP;
END;
$$;

SELECT ensure_order_history_monthly_partitions(
  (date_trunc('month', now()) - interval '1 month')::date,
  15
);
