import { z } from "zod";

export const verificationCodeValidation = z
  .string()
  .length(6, { message: "Invalid verification code" });
