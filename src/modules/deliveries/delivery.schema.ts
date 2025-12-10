import z from "zod";

export const DeliverySchema = z.object({
  delivery_id: z.string(),
  order_id: z.string().nullable(),
  courier_id: z.string().nullable(),
  pick_up_date: z.string().nullable(),
  delivered_date: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CreateDeliverySchema = DeliverySchema.omit({
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
