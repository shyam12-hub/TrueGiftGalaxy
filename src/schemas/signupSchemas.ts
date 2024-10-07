import { boolean, z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, { message: "Username must be at least 2 characters long" })
  .max(20, { message: "Username must not be more than 10 character long" });

export const signupValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email id" }),
  password: z.string().min(8, { message: "Password must be 8 character long" }),
  isSeller: boolean().default(false),
});
