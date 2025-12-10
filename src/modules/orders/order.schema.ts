import z from "zod";

export const OrderSchema = z.object({
  order_id: z.string(),
  user_id: z.string().nullable(),
  product_id: z.string().nullable(),
  order_quantity: z.number().nullable(),
  status: z.enum(["PAID", "IN TRANSIT", "DELIVERED"]).nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CreateOrderSchema = OrderSchema.omit({
  created_at: true,
  updated_at: true,
});

export const UpdateOrderSchema = OrderSchema.partial().omit({
  order_id: true,
  created_at: true,
  updated_at: true,
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
