"use client";
import { stats } from "@/mocks/stats";
import Logout from "@/components/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FiPlus } from "react-icons/fi";
import moment from "moment";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/mocks/users";
import { useParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { useUserStore } from "@/store/user";
import { useEffect, useMemo, useState } from "react";
import UserService from "@/services/User";
import useFetcher from "@/hooks/useFetcher";
import { Player, Stats, User } from "@/types";
import Spinner from "@/components/Spinner";
import StatsService from "@/services/Stat";

const keyMap = {
  pointsPerGame: "Points per Game",
  fieldGoalPercentage: "Field Goal Percentage",
  threePointPercentage: "Three-Point Percentage",
  freeThrowPercentage: "Free Throw Percentage",
  reboundsPerGame: "Rebounds per Game",
  offensiveReboundsPerGame: "Offensive Rebounds per Game",
  defensiveReboundsPerGame: "Defensive Rebounds per Game",
  assistsPerGame: "Assists per Game",
  stealsPerGame: "Steals per Game",
  blocksPerGame: "Blocks per Game",
  turnoversPerGame: "Turnovers per Game",
  playerEfficiencyRating: "Player Efficiency Rating",
  plusMinus: "Plus/Minus",
  minutesPerGame: "Minutes per Game",
  usageRate: "Usage Rate",
  trueShootingPercentage: "True Shooting Percentage",
  effectiveFieldGoalPercentage: "Effective Field Goal Percentage",
  winShares: "Win Shares",
  offensiveRating: "Offensive Rating",
  defensiveRating: "Defensive Rating",
  assistToTurnoverRatio: "Assist-to-Turnover Ratio",
  foulsPerGame: "Fouls per Game",
};

export default function StatPage() {
  const params = useParams();
  const user = useUserStore((s) => s.user);
  const userFetcher = useFetcher<Player>();
  const historyFetcher = useFetcher<Stats[]>([]);
  const [stat, setStat] = useState<Stats>();

  const myProfile = useMemo(() => {
    return !!user && userFetcher.data && user.id === userFetcher.data.id;
  }, [userFetcher.data, user]);

  function updateStat(update: Stats) {
    setStat(update);
  }

  const canUpload = useMemo(() => {
    if (!user || !userFetcher.data) return false;
    return (
      user.id === userFetcher.data.id || user.id === userFetcher.data.coach.id
    );
  }, [user, userFetcher]);

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    const userService = new UserService();
    const statsService = new StatsService();
    // @ts-ignore
    userFetcher.wrapper(() => userService.profile(id as string));
    historyFetcher.wrapper(() => statsService.findAll(id as string));
  }, [params?.id]);

  useEffect(() => {
    if (historyFetcher.data) {
      setStat(historyFetcher.data[0]);
    }
  }, [historyFetcher.data]);

  return (
    <main className="max-w-7xl mx-auto pb-10">
      <NavBar />

      {userFetcher.loading ? (
        <div className="flex flex-col items-center justify-center gap-5 mt-6">
          <Spinner />
        </div>
      ) : userFetcher.data ? (
        <div className="px-3 md:px-6">
          <div className="flex justify-between flex-wrap gap-2 border-b py-6 mb-6 md:mb-10 ">
            <h1 className="text-lg md:text-xl">
              {myProfile ? (
                "My"
              ) : (
                <span className="capitalize">
                  {userFetcher?.data?.displayName}&apos;s
                </span>
              )}{" "}
              Statistics
            </h1>
            <div className="flex justify-end items-center gap-6">
              {canUpload && (
                <Button variant="outline" asChild>
                  <Link href={`/add-stat?player=${params?.id ?? ""}`}>
                    <FiPlus className="mr-2" />
                    <span>Add a new stat</span>
                  </Link>
                </Button>
              )}

              {canUpload && stat && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/add-stat?player=${params?.id ?? ""}&stat=${
                      stat?.id ?? ""
                    }`}
                  >
                    <span>Edit</span>
                  </Link>
                </Button>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant={"outline"}>History</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Performance history</SheetTitle>
                  </SheetHeader>

                  {historyFetcher.data.length === 0 ? (
                    <p className="text-xs text-center text-gray-500 py-4">
                      This user has no statistics
                    </p>
                  ) : (
                    <ScrollArea className="mt-6 h-[85vh] pr-3">
                      {historyFetcher.data.map((entry) => {
                        return (
                          <button
                            onClick={() => updateStat(entry)}
                            key={entry.id}
                            className={`border rounded-md px-3 py-4 mt-3 w-full text-left ${
                              entry.id === stat?.id
                                ? "bg-primary text-white"
                                : ""
                            }`}
                          >
                            <p
                              className={`text-xs ${
                                entry.id === stat?.id
                                  ? "text-white/80"
                                  : "text-gray-500"
                              }`}
                            >
                              {moment(entry.timestamp.toDate()).fromNow()}
                            </p>

                            <p className="text-sm mt-3">
                              Efficiency Rating:{" "}
                              <span className="font-bold">
                                {entry.playerEfficiencyRating}
                              </span>
                            </p>
                          </button>
                        );
                      })}
                    </ScrollArea>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {!stat && (
            <p className="text-center text-gray-500 py-4">No stat exists</p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.keys(stat ?? {}).map((key) => {
              if (
                ["id", "owner", "timestamp", "updatedAt", "remark"].includes(
                  key
                )
              )
                return null;
              if (
                [
                  "fieldGoalPercentage",
                  "threePointPercentage",
                  "freeThrowPercentage",
                  "trueShootingPercentage",
                  "effectiveFieldGoalPercentage",
                ].includes(key)
              )
                return (
                  <div
                    key={key}
                    className="px-6 py-2 shadow-md shadow-gray-100 rounded-md"
                  >
                    {/* @ts-ignore */}
                    <p className="text-sm font-medium mb-2">{keyMap[key]}</p>

                    {/* @ts-ignore */}
                    <Progress value={stat[key]} />
                  </div>
                );
              return (
                <div
                  key={key}
                  className="px-6 py-2 shadow-md shadow-gray-100 rounded-md"
                >
                  {/* @ts-ignore */}
                  <p className="text-sm font-medium mb-2">{keyMap[key]}</p>
                  {/* @ts-ignore */}
                  <p className="text-gray-600">{stat[key]}</p>
                </div>
              );
            })}
          </div>

          {stat?.remark && (
            <div className="py-2 max-w-lg mt-6">
              <p className="text-sm font-medium mb-2">Remark</p>
              <p className="text-gray-600 border rounded-md py-3 px-3">{stat.remark}</p>
            </div>
          )}
        </div>
      ) : null}
    </main>
  );
}
