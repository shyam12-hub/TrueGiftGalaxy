import { z } from "zod";

export const shopInfoValidation = z.object({
  shopName: z.string(),
  shopPhoneNumber: z
    .string()
    .length(10, "Phone number must be exactly 10 digits"), // Validate as a string with exactly 10 digits
  shopAddress: z.string(),
  areaPinCode: z.string(),
  state: z.string(),
});
