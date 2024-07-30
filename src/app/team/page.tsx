"use client";
import AddEvent from "@/components/AddEvent";
import Logout from "@/components/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { events } from "@/mocks/events";
import { stats } from "@/mocks/stats";
import { users } from "@/mocks/users";
import { ROLES } from "@/types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

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

export default function TeamPage() {
  const stat = stats[0];
  return (
    <main className="max-w-7xl mx-auto">
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

      <div className="px-3 md:px-6 mt-6 mb-6">
        <h2 className="text-xl">Invite to your team</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm">Share this link to invite players to your team</p>
          <p className="border rounded-lg px-4 py-2 text-sm border-slate-300">{`${window.location.host}/invite?coach=${stat.id}`}</p>
        </div>
      </div>

      <div className="w-full overflow-auto px-3 md:px-6 py-3">
        <Table>
          <TableHeader>
            <TableHead>Player</TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["pointsPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["assistsPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["reboundsPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["turnoversPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["stealsPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["blocksPerGame"]}
            </TableHead>
            <TableHead className="whitespace-nowrap">
              {keyMap["foulsPerGame"]}
            </TableHead>
          </TableHeader>
          <TableBody>
            {users
              //   .filter((user) => user.role === ROLES["PLAYER"])
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap">
                    <Button asChild variant="link" className="px-0 py-1">
                      <Link href={`/${user.id}`}>{user.displayName}</Link>
                    </Button>
                  </TableCell>
                  <TableCell>{stat.pointsPerGame}</TableCell>
                  <TableCell>{stat.assistsPerGame}</TableCell>
                  <TableCell>{stat.reboundsPerGame}</TableCell>
                  <TableCell>{stat.turnoversPerGame}</TableCell>
                  <TableCell>{stat.stealsPerGame}</TableCell>
                  <TableCell>{stat.blocksPerGame}</TableCell>
                  <TableCell>{stat.foulsPerGame}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
