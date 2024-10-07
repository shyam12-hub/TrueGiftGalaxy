

import { z } from "zod";

export const verificationCodeValidation = z.object({
  verificationCode: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
