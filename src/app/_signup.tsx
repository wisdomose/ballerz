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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useFetcher from "@/hooks/useFetcher";
import UserService, { LoginResponse } from "@/services/User";
import { useUserStore } from "@/store/user";
import { LEVEL, ROLES } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { FiCalendar } from "react-icons/fi";
import { Calendar } from "@/components/ui/calendar";
import moment from "moment";
import { cn } from "@/lib/utils";

// const formSchema = z.object({
//   lastname: z
//     .string({ required_error: "Last name is required" })
//     .min(2, "Lastname is too short"),
//   firstname: z
//     .string({ required_error: "First name is required" })
//     .min(2, "Firstname is too short"),
//   dob: z
//     .string({ required_error: "Date of birth is required" })
//     .min(2, "Date of birth is required"),
//   gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
//   role: z.enum(["PLAYER", "COACH"], {
//     invalid_type_error: "Invalid user role",
//   }),
//   position: z.number().min(1, "Position cannot be less than 1"),
//   level: z.enum(["BEGINNER", "MODERATE", "PROFESSIONAL"], {
//     invalid_type_error: "Invalid level",
//   }),
//   email: z.string({ required_error: "Email is required" }).email(),
//   password: z
//     .string({ required_error: "Password is required" })
//     .min(6, "Password should be at least 6 characters"),

//   // address
//   country: z.string({ required_error: "Country of residence is required" }),
//   state: z.string({ required_error: "State of residence is required" }),
//   city: z.string({ required_error: "City of residence is required" }),
//   street: z.string({ required_error: "Name of your street is required" }),
//   houseNo: z
//     .number({ required_error: "House number is required" })
//     .min(1, "Invalid house address"),
// });
const formSchema = z.object({
  lastname: z
    .string({ required_error: "Your lastname is required" })
    .min(2, "Your lastname is too short"),
  firstname: z
    .string({ required_error: "Your firstname is required" })
    .min(2, "Your firstname is too short"),
  dob: z
    .string({ required_error: "Date of birth is required" })
    .min(2, "Date of birth is required"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  role: z.enum(["PLAYER", "COACH"], {
    invalid_type_error: "Invalid user role",
  }),
  position: z.number().min(1, "Position cannot be less than 1").optional(),
  level: z.enum(["BEGINNER", "MODERATE", "PROFESSIONAL"], {
    invalid_type_error: "Invalid level",
  }).optional(),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password should be at least 6 characters"),
  // address
  country: z.string({ required_error: "Country of residence is required" }),
  state: z.string({ required_error: "State of residence is required" }),
  city: z.string({ required_error: "City of residence is required" }),
  street: z.string({ required_error: "Name of your street is required" }),
  houseNo: z
    .number({ required_error: "House number is required" })
    .min(1, "Invalid house address"),
});

export default function Signup() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>(null);
  const { setUser } = useUserStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      dob: "",
      gender: "male",
      role: ROLES.PLAYER,
      position: undefined,
      level: undefined,
      email: "",
      password: "",

      // address
      country: "",
      state: "",
      city: "",
      street: "",
      houseNo: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userService = new UserService();
    await wrapper(() =>
      userService.signUp({
        displayName: `${values.lastname} ${values.firstname}`,
        dob: Timestamp.fromDate(new Date(values.dob)),
        address: {
          country: values.country,
          state: values.state,
          city: values.city,
          street: values.street,
          houseNo: values.houseNo,
        },
        gender: values.gender,
        role: values.role as ROLES,
        position: values.position,
        level: values.level as LEVEL,
        email: values.email,
        password: values.password,
      })
    );
  }

  useEffect(() => {
    if (data) {
      setUser(data);
      window.location.href = "/";
      toast.success("Signup sucessful");
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full overflow-auto px-4 md:px-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {/* lastname */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                {form.formState.errors["lastname"]?.message && (
                  <FormMessage>
                    {form.formState.errors["lastname"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* firstname */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                {form.formState.errors["firstname"]?.message && (
                  <FormMessage>
                    {form.formState.errors["firstname"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>

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

        <div className="grid grid-cols-2 items-center gap-6">
          {/* dob */}
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder=""
                  />
                </FormControl>
                {form.formState.errors["dob"]?.message && (
                  <FormMessage>
                    {form.formState.errors["dob"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />

          {/* gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">male</SelectItem>
                    <SelectItem value="female">female</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors["gender"]?.message && (
                  <FormMessage>
                    {form.formState.errors["gender"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signup as</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ROLES.PLAYER}>player</SelectItem>
                  <SelectItem value={ROLES.COACH}>coach</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors["role"]?.message && (
                <FormMessage>
                  {form.formState.errors["role"]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        {/* position */}
        {/* level */}
        {form.getValues().role === ROLES.PLAYER && (
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.currentTarget.valueAsNumber)
                      }
                      placeholder="1"
                    />
                  </FormControl>
                  {form.formState.errors["position"]?.message && (
                    <FormMessage>
                      {form.formState.errors["position"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Player level</FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={LEVEL.BEGINNER}>beginner</SelectItem>
                      <SelectItem value={LEVEL.MODERATE}>moderate</SelectItem>
                      <SelectItem value={LEVEL.PROFESSIONAL}>
                        professional
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors["level"]?.message && (
                    <FormMessage>
                      {form.formState.errors["level"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
        )}

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

        {/* address */}
        <p className="font-semibold mt-4">Address information</p>
        <div className="grid grid-cols-2 items-center gap-6">
          {/* country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Nigeria" {...field} />
                </FormControl>
                {form.formState.errors["country"]?.message && (
                  <FormMessage>
                    {form.formState.errors["country"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          {/* state */}
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Cross River" {...field} />
                </FormControl>
                {form.formState.errors["state"]?.message && (
                  <FormMessage>
                    {form.formState.errors["state"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>

        {/* city */}
        {/* street */}
        <div className="grid grid-cols-2 items-center gap-6">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Calabar" {...field} />
                </FormControl>
                {form.formState.errors["city"]?.message && (
                  <FormMessage>
                    {form.formState.errors["city"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="Nigeria" {...field} />
                </FormControl>
                {form.formState.errors["street"]?.message && (
                  <FormMessage>
                    {form.formState.errors["street"]?.message}
                  </FormMessage>
                )}
              </FormItem>
            )}
          />
        </div>
        {/* house no */}
        <FormField
          control={form.control}
          name="houseNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nigeria"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              {form.formState.errors["houseNo"]?.message && (
                <FormMessage>
                  {form.formState.errors["houseNo"]?.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-3" loading={loading}>
          Signup
        </Button>
      </form>
    </Form>
  );
}
