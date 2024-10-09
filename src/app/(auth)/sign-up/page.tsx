"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signupValidation } from "@/schemas/signupSchemas";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
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
import { Gift, Home } from "lucide-react";
function page() {
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const debounced = useDebounceCallback(setEmail, 300);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // zod implementation
  const form = useForm({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isSeller: false,
    },
  });

  const [message, setMessage] = useState("");
  useEffect(() => {
    const checkUniqueEmail = async () => {
      if (email) {
        setIsCheckingEmail(true);
        setMessage("");
        try {
          const response = await axios.get(
            `/api/check-email-unique?email=${email}`
          );
          let responseMessage = response.data.message;
          setMessage(responseMessage);
        } catch (e) {
          setMessage("Error in checking Email");
        } finally {
          setIsCheckingEmail(false);
        }
      }
    };
    checkUniqueEmail();
  }, [email]);

  async function submitForm(data: z.infer<typeof signupValidation>) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "SignUp Succesfull",
        description: response.data.message,
      });
      router.replace(`/verify/${email}`);
    } catch (e: any) {
      console.log("Signup Failed ", e.message);
      toast({
        title: "Signup Failed",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white p-6 rounded-md shadow-lg">
        <header className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Gift className="h-6 w-6 text-rose-400 sm:h-8 sm:w-8" />
            <div className="text-2xl font-bold sm:text-3xl md:text-4xl text-gray-800">
              True Gift Galaxy
            </div>
            <Home className="h-6 w-6 text-rose-400 sm:h-8 sm:w-8" />
          </div>
          <div className="text-center text-sm sm:text-base text-gray-600">
            Join us to explore exquisite gifts and home decor
          </div>
        </header>
        <main>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        className="flex h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="flex h-10 w-full rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    {isCheckingEmail && <Loader2 className="animate-spin" />}
                    <FormDescription
                      className={`text-sm ${
                        message === "email is unique"
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
              <FormField
                control={form.control}
                name="isSeller"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2 bg-white/50 p-4 rounded-md">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <p className="text-sm sm:text-base text-gray-700 cursor-pointer">
                          Are you a seller
                        </p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              >
                {isSubmitting ? (
                  <span className=" flex gap-3">
                    <Loader2 className="animate-spin" />
                    Please wait..
                  </span>
                ) : (
                  "SignUp"
                )}
              </Button>
            </form>
          </Form>
        </main>

        <footer>
          <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-rose-600 hover:text-rose-500"
            >
              Sign In
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default page;
