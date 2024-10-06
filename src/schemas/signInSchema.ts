import { z } from "zod";

export const signInValidation = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(8, { message: "password must me 8 character long" }),
});
