export const orderStatuses = [
  "placed",
  "confirmed",
  "preparing",
  "picked_up",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "refunded",
  "disputed"
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const activeOrderStatuses = [
  "placed",
  "confirmed",
  "preparing",
  "picked_up",
  "out_for_delivery"
] as const satisfies readonly OrderStatus[];
