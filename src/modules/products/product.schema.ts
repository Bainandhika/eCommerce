import z from "zod";

export const ProductSchema = z.object({
  product_id: z.string(),
  name: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  quantity: z.number().optional().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CreateProductSchema = ProductSchema.omit({
  product_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateProductSchema = ProductSchema.partial().omit({
  product_id: true,
  created_at: true,
  updated_at: true,
});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
