"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import useFetcher from "@/hooks/useFetcher";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PostService from "@/services/Post";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/user";

const MAX_SIZE = 2000000;
const formSchema = z.object({
  post: z.string(),
  file: z.any().refine((file) => {
    return !file ? true : file?.size < MAX_SIZE;
  }, "Max image size is 2MB"),
  // .refine(file=>)
});

export default function CreatePost() {
  const { wrapper, data, loading, error } = useFetcher(null);
  const user = useUserStore((s) => s.user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      post: "",
      file: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const postService = new PostService();
    await wrapper(() =>
      postService.create({
        post: values.post,
        file: values.file,
      })
    );
  }

  useEffect(() => {
    if (data) {
      toast.success("Post created");
      form.reset();
      fileInputRef!.current!.value = "";
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Form {...form}>
      <form
        className="border-b py-3 px-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.photoURL} />
            <AvatarFallback>
              {(user?.displayName.split(" ")[0][0] ?? "").toUpperCase()}
              {(user?.displayName.split(" ")[1][0] ?? "").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="w-full">
            <FormField
              control={form.control}
              name="post"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="h-40 w-full mb-2"
                      {...field}
                      placeholder="What is happening?"
                    ></Textarea>
                  </FormControl>
                  {form.formState.errors["post"]?.message && (
                    <FormMessage>
                      {form.formState.errors["post"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldParams } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldParams}
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => onChange((e?.target?.files ?? [])[0])}
                    />
                  </FormControl>
                  {form.formState.errors["file"]?.message && (
                    <FormMessage>
                      {form.formState.errors["file"]?.message.toString()}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button className="mt-2 w-full" loading={loading}>
              Post
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
