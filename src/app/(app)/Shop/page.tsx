"use client";
import axios from "axios";
import { useForm } from "react-hook-form";
import { shopInfoValidation } from "@/schemas/shopInfoValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function page() {
  const form = useForm({
    resolver: zodResolver(shopInfoValidation),
    defaultValues: {
      shopName: "",
      shopPhoneNumber: "",
      shopAddress: "", // Added shopAddress to default values
      areaPinCode: "",
      state: "",
    },
  });

  const submitShopInfo = async (data: z.infer<typeof shopInfoValidation>) => {
    try {
      const response = await axios.post("/api/shopInfo", data);
      console.log(response.data.message);
    } catch (error: any) {
      console.log("Could not add address: ", error.message);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitShopInfo)}>
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Shop Name"
                    {...field}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shopPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Shop Phone Number"
                    {...field}
                    type="number"
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Added the shopAddress field */}
          <FormField
            control={form.control}
            name="shopAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shop Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Shop Address"
                    {...field}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areaPinCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin Code</FormLabel>
                <FormControl>
                  <Input
                    type="number" // Updated to handle pin codes as number input
                    placeholder="Pin Code"
                    {...field}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="State"
                    {...field}
                    className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-2">
            Add Address
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default page;
