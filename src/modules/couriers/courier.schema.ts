import z from "zod";

export const CourierSchema = z.object({
  courier_id: z.string(),
  name: z.string(),
  is_available: z.number(),
});

export const CreateCourierSchema = CourierSchema

export const UpdateCourierSchema = CourierSchema.partial().omit({
  courier_id: true,
});

export type Courier = z.infer<typeof CourierSchema>;
export type CreateCourierInput = z.infer<typeof CreateCourierSchema>;
export type UpdateCourierInput = z.infer<typeof UpdateCourierSchema>;
