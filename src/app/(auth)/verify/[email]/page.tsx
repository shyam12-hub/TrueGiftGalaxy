"use client";
import { z } from "zod";
import { verificationCodeValidation } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook
import ResendOtp from "../../../../../emails/ResendOtp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function Page() {
  const params = useParams<{ email: string }>();
  const encodedEmail = decodeURIComponent(params.email);
  const { toast }: { toast: (options: any) => void } = useToast(); // Define the type for toast
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(verificationCodeValidation),
    defaultValues: {
      verificationCode: "",
    },
  });

  async function submitOtp(data: z.infer<typeof verificationCodeValidation>) {
    try {
      const { verificationCode } = data;
      const response = await axios.post("/api/verify", {
        email: encodedEmail,
        verificationCode,
      });
      if (response.data.success) {
        toast({
          title: "Verification Successful",
          description: response.data.message,
        });
        router.replace("/sign-in");
      } else {
        toast({
          title: "Verification Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      console.log("Could not verify OTP");
      toast({
        title: "Could not verify OTP",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitOtp)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  <ResendOtp email={encodedEmail.toString()} />
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Verify</Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
