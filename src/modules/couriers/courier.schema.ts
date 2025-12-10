import z from "zod";

export const CourierSchema = z.object({
  courier_id: z.string(),
  name: z.string(),
  is_available: z.number().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CreateCourierSchema = CourierSchema.omit({
  courier_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateCourierSchema = CourierSchema.partial().omit({
  courier_id: true,
  created_at: true,
  updated_at: true,
});

export type Courier = z.infer<typeof CourierSchema>;
export type CreateCourierInput = z.infer<typeof CreateCourierSchema>;
export type UpdateCourierInput = z.infer<typeof UpdateCourierSchema>;
