"use client";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // Assuming you are using lucide-react for icons

function ResendOtp({ email }: { email: string }) {
  const { toast } = useToast();
  const [seconds, setSeconds] = useState(60);
  const [isResendOtp, setIsResendOtp] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // This tracks if the component is mounted

  // This will only run once the component has mounted (on the client)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1); // Decrement seconds every second
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [isMounted, seconds]);

  const resendOtpHandler = async () => {
    if (seconds === 0 && !isResendOtp) {
      setIsResendOtp(true); // Start OTP resend process
      try {
        const response = await axios.post("/api/resendOtp", {
          email: email,
        });
        if (response.data.success) {
          toast({
            description: response.data.message,
          });
        } else {
          toast({
            title: "Could not resend OTP",
            variant: "destructive",
          });
        }
      } catch (e: any) {
        console.log("Error sending OTP: ", e.message);
        toast({
          title: "Error sending OTP",
          variant: "destructive",
        });
      } finally {
        setIsResendOtp(false); // End OTP resend process
        setSeconds(60); // Reset the countdown timer
      }
    }
  };

  // Return nothing on the server to avoid mismatch between SSR and hydration
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex gap-2 items-center">
      {/* Countdown Timer */}
      <p className="text-gray-400">{seconds > 0 ? seconds : "0"}</p>

      {/* Resend OTP Link */}
      <button
        onClick={resendOtpHandler}
        disabled={seconds > 0 || isResendOtp}
        aria-disabled={seconds > 0 || isResendOtp}
        className={`cursor-pointer ${
          seconds > 0 || isResendOtp ? "text-gray-600" : "text-black"
        }`}
        style={{ pointerEvents: seconds > 0 || isResendOtp ? "none" : "auto" }}
      >
        {isResendOtp ? <Loader2 className="animate-spin" /> : "Resend"}
      </button>
    </div>
  );
}

export default ResendOtp;
