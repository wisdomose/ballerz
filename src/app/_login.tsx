"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetcher from "@/hooks/useFetcher";
import UserService, { LoginResponse } from "@/services/User";
import { useUserStore } from "@/store/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password should be at least 6 characters"),
});

export default function Login() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>(null);
  const { setUser } = useUserStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userService = new UserService();
    await wrapper(() =>
      userService.login({
        email: values.email,
        password: values.password,
      })
    );
    console.log(values);
  }

  useEffect(() => {
    if (data) {
      setUser(data);
      window.location.href = "/";
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 w-full px-4 md:px-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="johndoe@bookz.com" />
              </FormControl>
              {form.formState.errors["email"]?.message && (
                <FormMessage>
                  {form.formState.errors["email"]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="******" />
              </FormControl>
              {form.formState.errors["password"]?.message && (
                <FormMessage>
                  {form.formState.errors["password"]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-3">
          Login
        </Button>
      </form>
    </Form>
  );
}
