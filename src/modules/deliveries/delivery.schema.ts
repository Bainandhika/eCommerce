import z from "zod";

export const DeliverySchema = z.object({
  delivery_id: z.uuid(),
  order_id: z.uuid({ message: "Order ID must be a valid UUID" }),
  courier_id: z.uuid({ message: "Order ID must be a valid UUID" }),
  pick_up_date: z.iso.datetime().nullable(),
  delivered_date: z.iso.datetime().nullable(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
});

export const CreateDeliverySchema = DeliverySchema.omit({
  delivery_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateDeliverySchema = DeliverySchema.partial().omit({
  delivery_id: true,
  created_at: true,
  updated_at: true,
});

export type Delivery = z.infer<typeof DeliverySchema>;
export type CreateDeliveryInput = z.infer<typeof CreateDeliverySchema>;
export type UpdateDeliveryInput = z.infer<typeof UpdateDeliverySchema>;
