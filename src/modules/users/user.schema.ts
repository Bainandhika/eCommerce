import z from "zod";

export const UserSchema = z.object({
  user_id: z.string(),
  email: z.email(),
  password: z.string(),
  address: z.string().optional().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const CreateUserSchema = UserSchema.omit({
  user_id: true,
  created_at: true,
  updated_at: true,
});

export const UpdateUserSchema = UserSchema.partial().omit({
  user_id: true,
  created_at: true,
  updated_at: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
