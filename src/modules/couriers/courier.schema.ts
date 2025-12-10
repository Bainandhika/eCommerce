import z from "zod";

export const CourierSchema = z.object({
  courier_id: z.uuid(),
  name: z
    .string({
      message: "Name must be a string",
    })
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be 255 characters or less" }),
  is_available: z.enum(["0", "1"]),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
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
