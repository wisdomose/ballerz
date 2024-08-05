"use client";

import NavBar from "@/components/NavBar";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/user";
import useFetcher from "@/hooks/useFetcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StatsService from "@/services/Stat";
import { Button } from "@/components/ui/button";
import { FiMinus, FiPlus } from "react-icons/fi";
import { statKeyMap } from "@/lib";
import UserService from "@/services/User";
import { Player, ROLES, Stats, User } from "@/types";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  remark: z.string().optional(),
  pointsPerGame: z.number().optional(),
  fieldGoalPercentage: z.number().optional(),
  threePointPercentage: z.number().optional(),
  freeThrowPercentage: z.number().optional(),
  reboundsPerGame: z.number().optional(),
  offensiveReboundsPerGame: z.number().optional(),
  defensiveReboundsPerGame: z.number().optional(),
  assistsPerGame: z.number().optional(),
  stealsPerGame: z.number().optional(),
  blocksPerGame: z.number().optional(),
  turnoversPerGame: z.number().optional(),
  playerEfficiencyRating: z.number().optional(),
  plusMinus: z.number().optional(),
  minutesPerGame: z.number().optional(),
  usageRate: z.number().optional(),
  trueShootingPercentage: z.number().optional(),
  effectiveFieldGoalPercentage: z.number().optional(),
  winShares: z.number().optional(),
  offensiveRating: z.number().optional(),
  defensiveRating: z.number().optional(),
  assistToTurnoverRatio: z.number().optional(),
  foulsPerGame: z.number().optional(),
});

export default function AddStatPage() {
  const search = useSearchParams(); // player, stat
  const { wrapper, data, loading, error } = useFetcher(null);
  const userFetcher = useFetcher<Player>();
  const statFetcher = useFetcher<Stats>();
  const user = useUserStore((state) => state.user);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remark: "",
      pointsPerGame: 0,
      fieldGoalPercentage: 0,
      threePointPercentage: 0,
      freeThrowPercentage: 0,
      reboundsPerGame: 0,
      offensiveReboundsPerGame: 0,
      defensiveReboundsPerGame: 0,
      assistsPerGame: 0,
      stealsPerGame: 0,
      blocksPerGame: 0,
      turnoversPerGame: 0,
      playerEfficiencyRating: 0,
      plusMinus: 0,
      minutesPerGame: 0,
      usageRate: 0,
      trueShootingPercentage: 0,
      effectiveFieldGoalPercentage: 0,
      winShares: 0,
      offensiveRating: 0,
      defensiveRating: 0,
      assistToTurnoverRatio: 0,
      foulsPerGame: 0,
    },
  });

  async function createHandler(values: z.infer<typeof formSchema>) {
    const owner = search?.get("player");
    if (!owner) return;
    const statsService = new StatsService();
    await wrapper(() =>
      statsService.create({
        stats: {
          remark: values.remark ?? "",
          pointsPerGame: values.pointsPerGame as number,
          fieldGoalPercentage: values.fieldGoalPercentage as number,
          threePointPercentage: values.threePointPercentage as number,
          freeThrowPercentage: values.freeThrowPercentage as number,
          reboundsPerGame: values.reboundsPerGame as number,
          offensiveReboundsPerGame: values.offensiveReboundsPerGame as number,
          defensiveReboundsPerGame: values.defensiveReboundsPerGame as number,
          assistsPerGame: values.assistsPerGame as number,
          stealsPerGame: values.stealsPerGame as number,
          blocksPerGame: values.blocksPerGame as number,
          turnoversPerGame: values.turnoversPerGame as number,
          playerEfficiencyRating: values.playerEfficiencyRating as number,
          plusMinus: values.plusMinus as number,
          minutesPerGame: values.minutesPerGame as number,
          usageRate: values.usageRate as number,
          trueShootingPercentage: values.trueShootingPercentage as number,
          effectiveFieldGoalPercentage:
            values.effectiveFieldGoalPercentage as number,
          winShares: values.winShares as number,
          offensiveRating: values.offensiveRating as number,
          defensiveRating: values.defensiveRating as number,
          assistToTurnoverRatio: values.assistToTurnoverRatio as number,
          foulsPerGame: values.foulsPerGame as number,
        },
        owner,
      })
    );
  }
  async function editHandler(values: z.infer<typeof formSchema>) {
    const stat = search?.get("stat");
    if (!userFetcher.data || !stat) return;
    const statsService = new StatsService();
    await wrapper(() =>
      statsService.update({
        stats: {
          remark: values.remark ?? "",
          pointsPerGame: values.pointsPerGame as number,
          fieldGoalPercentage: values.fieldGoalPercentage as number,
          threePointPercentage: values.threePointPercentage as number,
          freeThrowPercentage: values.freeThrowPercentage as number,
          reboundsPerGame: values.reboundsPerGame as number,
          offensiveReboundsPerGame: values.offensiveReboundsPerGame as number,
          defensiveReboundsPerGame: values.defensiveReboundsPerGame as number,
          assistsPerGame: values.assistsPerGame as number,
          stealsPerGame: values.stealsPerGame as number,
          blocksPerGame: values.blocksPerGame as number,
          turnoversPerGame: values.turnoversPerGame as number,
          playerEfficiencyRating: values.playerEfficiencyRating as number,
          plusMinus: values.plusMinus as number,
          minutesPerGame: values.minutesPerGame as number,
          usageRate: values.usageRate as number,
          trueShootingPercentage: values.trueShootingPercentage as number,
          effectiveFieldGoalPercentage:
            values.effectiveFieldGoalPercentage as number,
          winShares: values.winShares as number,
          offensiveRating: values.offensiveRating as number,
          defensiveRating: values.defensiveRating as number,
          assistToTurnoverRatio: values.assistToTurnoverRatio as number,
          foulsPerGame: values.foulsPerGame as number,
        },
        owner: userFetcher.data as Player,
        id: stat,
      })
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const stat = search?.get("stat");
    stat ? editHandler(values) : createHandler(values);
  }

  const myProfile = useMemo(() => {
    if (!user || !userFetcher.data) return false;
    return user.id === userFetcher.data.id;
  }, [user, userFetcher]);

  const myCoach = useMemo(() => {
    if (!user || !userFetcher.data) return false;
    return user.id === userFetcher.data.coach.id;
  }, [user, userFetcher]);

  useEffect(() => {
    const id = search?.get("player");
    const stat = search?.get("stat");
    if (!id) return;

    const userService = new UserService();
    const statService = new StatsService();
    // @ts-ignore
    userFetcher.wrapper(() => userService.profile(id as string));
    stat && statFetcher.wrapper(() => statService.findOne(stat));
  }, []);

  useEffect(() => {
    if (statFetcher.data) {
      form.reset({
        remark: statFetcher.data.remark ?? "",
        pointsPerGame: statFetcher.data.pointsPerGame,
        fieldGoalPercentage: statFetcher.data.fieldGoalPercentage,
        threePointPercentage: statFetcher.data.threePointPercentage,
        freeThrowPercentage: statFetcher.data.freeThrowPercentage,
        reboundsPerGame: statFetcher.data.reboundsPerGame,
        offensiveReboundsPerGame: statFetcher.data.offensiveReboundsPerGame,
        defensiveReboundsPerGame: statFetcher.data.defensiveReboundsPerGame,
        assistsPerGame: statFetcher.data.assistsPerGame,
        stealsPerGame: statFetcher.data.stealsPerGame,
        blocksPerGame: statFetcher.data.blocksPerGame,
        turnoversPerGame: statFetcher.data.turnoversPerGame,
        playerEfficiencyRating: statFetcher.data.playerEfficiencyRating,
        plusMinus: statFetcher.data.plusMinus,
        minutesPerGame: statFetcher.data.minutesPerGame,
        usageRate: statFetcher.data.usageRate,
        trueShootingPercentage: statFetcher.data.trueShootingPercentage,
        effectiveFieldGoalPercentage:
          statFetcher.data.effectiveFieldGoalPercentage,
        winShares: statFetcher.data.winShares,
        offensiveRating: statFetcher.data.offensiveRating,
        defensiveRating: statFetcher.data.defensiveRating,
        assistToTurnoverRatio: statFetcher.data.assistToTurnoverRatio,
        foulsPerGame: statFetcher.data.foulsPerGame,
      });
    }
  }, [statFetcher.data]);

  useEffect(() => {
    if (!loading && data) {
      !search?.get("stat") && form.reset();
      toast.success(
        search?.get("stat")
          ? "Stat edited sucessfully"
          : "Stat uploaded sucessfully"
      );
    }
  }, [data, loading]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (statFetcher.error) toast.error(statFetcher.error);
  }, [statFetcher.error]);

  if (search?.get("stat") && !statFetcher.data && !statFetcher.loading)
    return (
      <main className="max-w-7xl mx-auto pb-10">
        <NavBar />

        {userFetcher.data && (
          <div className="flex justify-between flex-wrap gap-2 border-b py-6 mb-6 md:mb-10 ">
            <h1 className="text-lg md:text-xl">
              {search?.get("stat") ? "Edit" : "Upload"}{" "}
              {myProfile ? (
                "my"
              ) : (
                <span className="capitalize">
                  {userFetcher?.data?.displayName}&apos;s
                </span>
              )}{" "}
              statistics
            </h1>
          </div>
        )}

        <p className="text-red-500 text-center text-sm">No stat found</p>
      </main>
    );

  return (
    <main className="max-w-7xl mx-auto pb-10">
      <NavBar />

      {userFetcher.data && (
        <div className="flex justify-between flex-wrap gap-2 border-b py-6 mb-6 md:mb-10 ">
          <h1 className="text-lg md:text-xl">
            {search?.get("stat") ? "Edit" : "Upload"}{" "}
            {myProfile ? (
              "my"
            ) : (
              <span className="capitalize">
                {userFetcher?.data?.displayName}&apos;s
              </span>
            )}{" "}
            statistics
          </h1>
        </div>
      )}

      <Form {...form}>
        <form
          className="flex flex-col gap-6 w-full overflow-auto px-4 md:px-10 mt-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid md:grid-cols-2 items-center gap-x-20 gap-y-5">
            {/* pointsPerGame */}
            <FormField
              control={form.control}
              name="pointsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["pointsPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["pointsPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["pointsPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* fieldGoalPercentage */}
            <FormField
              control={form.control}
              name="fieldGoalPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["fieldGoalPercentage"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["fieldGoalPercentage"]?.message && (
                    <FormMessage>
                      {form.formState.errors["fieldGoalPercentage"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* threePointPercentage */}
            <FormField
              control={form.control}
              name="threePointPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["threePointPercentage"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["threePointPercentage"]?.message && (
                    <FormMessage>
                      {form.formState.errors["threePointPercentage"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* freeThrowPercentage */}
            <FormField
              control={form.control}
              name="freeThrowPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["freeThrowPercentage"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["freeThrowPercentage"]?.message && (
                    <FormMessage>
                      {form.formState.errors["freeThrowPercentage"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* offensiveReboundsPerGame */}
            <FormField
              control={form.control}
              name="offensiveReboundsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {statKeyMap["offensiveReboundsPerGame"]}
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["offensiveReboundsPerGame"]
                    ?.message && (
                    <FormMessage>
                      {
                        form.formState.errors["offensiveReboundsPerGame"]
                          ?.message
                      }
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* defensiveReboundsPerGame */}
            <FormField
              control={form.control}
              name="defensiveReboundsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {statKeyMap["defensiveReboundsPerGame"]}
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["defensiveReboundsPerGame"]
                    ?.message && (
                    <FormMessage>
                      {
                        form.formState.errors["defensiveReboundsPerGame"]
                          ?.message
                      }
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* assistsPerGame */}
            <FormField
              control={form.control}
              name="assistsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["assistsPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["assistsPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["assistsPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* stealsPerGame */}
            <FormField
              control={form.control}
              name="stealsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["stealsPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["stealsPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["stealsPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* blocksPerGame */}
            <FormField
              control={form.control}
              name="blocksPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["blocksPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["blocksPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["blocksPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* turnoversPerGame */}
            <FormField
              control={form.control}
              name="turnoversPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["turnoversPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["turnoversPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["turnoversPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* playerEfficiencyRating */}
            <FormField
              control={form.control}
              name="playerEfficiencyRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["playerEfficiencyRating"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["playerEfficiencyRating"]?.message && (
                    <FormMessage>
                      {form.formState.errors["playerEfficiencyRating"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* plusMinus */}
            <FormField
              control={form.control}
              name="plusMinus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["plusMinus"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["plusMinus"]?.message && (
                    <FormMessage>
                      {form.formState.errors["plusMinus"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* minutesPerGame */}
            <FormField
              control={form.control}
              name="minutesPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["minutesPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["minutesPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["minutesPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* usageRate */}
            <FormField
              control={form.control}
              name="usageRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["usageRate"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["usageRate"]?.message && (
                    <FormMessage>
                      {form.formState.errors["usageRate"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* trueShootingPercentage */}
            <FormField
              control={form.control}
              name="trueShootingPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["trueShootingPercentage"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["trueShootingPercentage"]?.message && (
                    <FormMessage>
                      {form.formState.errors["trueShootingPercentage"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* effectiveFieldGoalPercentage */}
            <FormField
              control={form.control}
              name="effectiveFieldGoalPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {statKeyMap["effectiveFieldGoalPercentage"]}
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["effectiveFieldGoalPercentage"]
                    ?.message && (
                    <FormMessage>
                      {
                        form.formState.errors["effectiveFieldGoalPercentage"]
                          ?.message
                      }
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* winShares */}
            <FormField
              control={form.control}
              name="winShares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["winShares"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["winShares"]?.message && (
                    <FormMessage>
                      {form.formState.errors["winShares"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* offensiveRating */}
            <FormField
              control={form.control}
              name="offensiveRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["offensiveRating"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["offensiveRating"]?.message && (
                    <FormMessage>
                      {form.formState.errors["offensiveRating"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* defensiveRating */}
            <FormField
              control={form.control}
              name="defensiveRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["defensiveRating"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["defensiveRating"]?.message && (
                    <FormMessage>
                      {form.formState.errors["defensiveRating"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* assistToTurnoverRatio */}
            <FormField
              control={form.control}
              name="assistToTurnoverRatio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["assistToTurnoverRatio"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["assistToTurnoverRatio"]?.message && (
                    <FormMessage>
                      {form.formState.errors["assistToTurnoverRatio"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* foulsPerGame */}
            <FormField
              control={form.control}
              name="foulsPerGame"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{statKeyMap["foulsPerGame"]}</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-[max-content,1fr,max-content] gap-6 py-1">
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            (field.value ?? 0) - 1 <= 0 ? 0 : field.value! - 1
                          )
                        }
                      >
                        <FiMinus />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={() => {}}
                        placeholder="1"
                      />
                      <Button
                        variant={"outline"}
                        type="button"
                        onClick={() => field.onChange((field.value ?? 0) + 1)}
                      >
                        <FiPlus />
                      </Button>
                    </div>
                  </FormControl>
                  {form.formState.errors["foulsPerGame"]?.message && (
                    <FormMessage>
                      {form.formState.errors["foulsPerGame"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {user?.role === ROLES.COACH && (
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Leave a remark</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-40 w-full"
                          {...field}
                          placeholder="leave a review"
                        ></Textarea>
                      </FormControl>
                      {form.formState.errors["remark"]?.message && (
                        <FormMessage>
                          {form.formState.errors["remark"]?.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Button className="w-fit" loading={loading}>
            {search?.get("stat") ? "Edit" : "Save"}
          </Button>
        </form>
      </Form>
    </main>
  );
}
