"use client";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInValidation } from "@/schemas/signInSchema";
import Link from "next/link";
import axios from "axios";
import { Gift, Home } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
function page() {
  const [email, setEmail] = useState("");
  const debouncedEmail = useDebounceCallback(setEmail, 500);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkEmailIsVerified = async () => {
      if (email) {
        setIsCheckingEmail(true);
        try {
          const response = await axios.post("/api/check-user-isVerifed", {
            email: email.trim(),
          });
          if (!response.data.success) {
            setMessage(response.data.message);
          }
          if (
            !response.data.success &&
            response.data.message === "You are not verified"
          ) {
            setIsVerified(false);
            setMessage(response.data.message);
          } else {
            setIsVerified(true);
            setMessage(response.data.message);
          }
        } catch {
          setMessage("Error in checking Email");
        } finally {
          setIsCheckingEmail(false);
          setIsCheckingEmail(false);
        }
      }
    };
    checkEmailIsVerified();
  }, [email]);

  const onSubmit = async (data: z.infer<typeof signInValidation>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Sign In Failed",
          description: "Incorrect Credentails",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      toast({
        title: "Sign In Successfull",
      });
      router.replace("/dashboard");
    }
  };

  const form = useForm({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white p-6 rounded-md shadow-lg">
        <header className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="h-6 w-6 text-rose-400 sm:h-8 sm:w-8" />
            <div className="text-2xl font-bold sm:text-3xl md:text-4xl text-gray-800">
              Sign In to True Gift Galaxy
            </div>
            <Home className="h-6 w-6 text-rose-400 sm:h-8 sm:w-8" />
          </div>
        </header>
        <main>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedEmail(e.target.value);
                        }}
                        className="flex h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    {isCheckingEmail && <Loader2 className="animate-spin" />}
                    <FormDescription
                      className={`text-sm ${
                        message === "Email is verified"
                          ? "text-green-600"
                          : "text-red-600"
                      }  `}
                    >
                      {message}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="flex h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-4"
                disabled={!isVerified}
              >
                {isSubmitting ? (
                  <span className=" flex gap-3">
                    <Loader2 className="animate-spin" />
                    Please wait..
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          {!isVerified && (
            <Button
              onClick={() => router.replace(`/verify/${email}`)}
              className="mt-3"
            >
              Verify Your email
            </Button>
          )}
        </main>
        <footer>
          <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
            Don't have account Sign Up{" "}
            <Link
              href="/sign-up"
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              Sign Up
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default page;
