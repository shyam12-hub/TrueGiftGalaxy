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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
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
                    placeholder="email.."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                {isCheckingEmail && <Loader2 className="animate-spin" />}
                <FormDescription
                  className={`text-sm ${
                    message === "email is unique"
                      ? "text-green-400"
                      : "text-red-400"
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
                  <Input type="password" placeholder="password.." {...field} />
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
                  <span>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <p>Are you a seller</p>
                  </span>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {isSubmitting ? (
              <span>
                <Loader2 className="animate-spin" />
                Please wait..
              </span>
            ) : (
              "SignUp"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default page;
