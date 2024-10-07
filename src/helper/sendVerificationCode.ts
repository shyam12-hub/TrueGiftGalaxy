import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationCode(
  username : string,
  email: string,
  otp: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "TrueGiftGalaxy <onboarding@resend.dev>",
      to: email,
      subject: "True Gift Galaxy | Verification Code",
      react: VerificationEmail({ username , otp }),
    });
    return { success: true, message: "Verification code send " };
  } catch {
    return { success: false, message: "Could not able send OTP" };
  }
}
