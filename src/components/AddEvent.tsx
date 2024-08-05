"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useFetcher from "@/hooks/useFetcher";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { FiCalendar, FiPlus } from "react-icons/fi";
import moment from "moment";
import { cn } from "@/lib/utils";
import EventService from "@/services/Event";

const formSchema = z.object({
  name: z
    .string({ required_error: "Event name is required" })
    .min(2, "Event name is required"),
  startingAt: z
    .date({ required_error: "Event date is required" })
    .min(new Date(), "You cannot create an event later than today"),
});

export default function AddEvent() {
  const { wrapper, data, loading, error } = useFetcher(null);
  //   const { setUser } = useUserStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startingAt: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const eventService = new EventService();
    await wrapper(() =>
      eventService.create({
        name: values.name,
        startingAt: Timestamp.fromDate(values.startingAt),
      })
    );
  }

  useEffect(() => {
    if (data) {
      toast.success("Event created");
      form.reset();
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full">
        <Button variant="outline" className="mb-2 w-full">
          <FiPlus className="mr-2" />
          <span>Add a new event</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new event</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  {form.formState.errors["name"]?.message && (
                    <FormMessage>
                      {form.formState.errors["name"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startingAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-2">Pick a date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            moment(field.value).format("DD/MM/YYYY")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <FiCalendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        fromDate={new Date()}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-3" loading={loading}>
              Create Event
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
