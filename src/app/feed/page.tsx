"use client";
import AddEvent from "@/components/AddEvent";
import Logout from "@/components/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { events } from "@/mocks/events";
import { posts } from "@/mocks/posts";
import { stats } from "@/mocks/stats";
import { users } from "@/mocks/users";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

// statsLabels.ts

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

export default function FeedPage() {
  const stat = stats[0];
  const user = users[0];
  return (
    <main className="md:grid md:grid-rows-[max-content,calc(100vh_-_64.67px)] md:max-h-screen md:h-screen md:overflow-hidden max-w-7xl mx-auto">
      <nav className="flex justify-center gap-x-40 gap-y-5 sm:gap-20 sm:justify-between items-center flex-wrap py-3 border-b px-6">
        <Link href="/feed" className="flex items-center font-bold">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={100}
            height={100}
            className="h-[40px] w-auto"
            priority
            sizes="large"
          />
          Ballerz
        </Link>

        <div className="flex items-center gap-8">
          {/* <Button>My stats</Button> */}
          <Button asChild variant={"link"}>
            <Link href="/events">Events</Link>
          </Button>
          <Button asChild>
            <Link href="/team">My team</Link>
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Logout />
        </div>
      </nav>

      <main className="md:grid md:grid-cols-[240px,1fr] lg:grid-cols-[240px,1fr,240px]">
        <div className="border-r hidden md:grid grid-rows-[max-content,1fr] pt-3 pl-6">
          <div className="mb-4 pr-4">
            <AddEvent />

            <p className="text-xs uppercase font-medium">upcoming events</p>
          </div>
          <div className="relative h-full">
            <div className="absolute inset-0 pb-3">
              <ScrollArea className="pr-3 h-full">
                <div className="!flex flex-col gap-3">
                  {events.map((event) => {
                    return (
                      <div
                        key={event.id}
                        className="border rounded-md px-3 py-4"
                      >
                        <div>
                          <p className="text-xs text-gray-500">
                            {moment(event.startingAt.toDate()).fromNow()}
                          </p>
                          <p className="text-sm font-medium">{event.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Avatar className="w-4 h-4">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback className="w-4 h-4 text-[10px]">
                              {event.createdBy.displayName.split(" ")[0][0] ??
                                ""}
                              {event.createdBy.displayName.split(" ")[1][0] ??
                                ""}
                            </AvatarFallback>
                          </Avatar>

                          <span className="text-xs font-medium">
                            {event.createdBy.displayName}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        <ScrollArea className="pr-3">
          <div className="border-b py-3 px-3">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="w-full">
                <Textarea
                  className="h-40 w-full mb-2"
                  placeholder="What is happening?"
                ></Textarea>
                <Input type="file" />
                <Button className="mt-2 w-full">Post</Button>
              </div>
            </div>
          </div>

          {posts.map((post) => {
            return (
              <div key={post.id} className="border-b py-3 px-3">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {post.owner.displayName.split(" ")[0][0] ?? ""}
                      {post.owner.displayName.split(" ")[1][0] ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p>
                      <span className="font-medium">
                        {post.owner.displayName}
                      </span>{" "}
                      .{" "}
                      <span className="text-sm">
                        {moment(post.timestamp.toDate()).format("MMM DD")}
                      </span>
                    </p>
                    <p className="">{post.post}</p>
                    {post.photoURL && (
                      <div className="relative w-full h-48 mt-1 rounded-xl overflow-hidden">
                        <Image
                          src="/auth.jpg"
                          fill
                          alt=""
                          className="object-cover"
                          priority
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollArea>

        <div className="hidden lg:grid h-full border-l grid-rows-[max-content,1fr] pl-1">
          <div className="pl-3 mb-4 pr-6 pt-3">
            <Button variant="outline" asChild className="mb-2 w-full">
              <Link href="/add-stat">
                <FiPlus className="mr-2" />
                <span>Add a new stat</span>
              </Link>
            </Button>

            <p className="text-xs uppercase font-medium">latest performance</p>
          </div>
          <div className="relative h-full pb-3">
            <div className="absolute inset-0">
              <ScrollArea className="pr-3 h-full">
                <div className="!flex flex-col gap-3">
                  {Object.keys(stat).map((key) => {
                    if (["id", "owner", "timestamp"].includes(key)) return null;
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
                        <div key={key} className="px-3 py-2">
                          {/* @ts-ignore */}
                          <p className="text-sm font-medium">{keyMap[key]}</p>

                          {/* @ts-ignore */}
                          <Progress value={stat[key]} />
                        </div>
                      );
                    return (
                      <div key={key} className="px-3 py-2">
                        {/* @ts-ignore */}
                        <p className="text-sm font-medium">{keyMap[key]}</p>
                        {/* @ts-ignore */}
                        <p className="text-gray-600">{stat[key]}</p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
}
