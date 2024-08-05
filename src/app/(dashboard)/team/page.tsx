"use client";
import AddEvent from "@/components/AddEvent";
import Logout from "@/components/Logout";
import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetcher from "@/hooks/useFetcher";
import { events } from "@/mocks/events";
import { stats } from "@/mocks/stats";
import { users } from "@/mocks/users";
import TeamService, { TeamOverview } from "@/services/Team";
import { useUserStore } from "@/store/user";
import { ROLES } from "@/types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const user = useUserStore((s) => s.user);

  const [team, setTeam] = useState<TeamOverview>([]);
  const { data, wrapper, loading } = useFetcher<TeamOverview>();

  useEffect(() => {
    const teamService = new TeamService();
    wrapper(teamService.overview);

    const interval = setInterval(async () => {
      await wrapper(teamService.overview);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setTeam(data);
    }
  }, [data]);

  const stat = stats[0];
  return (
    <main className="max-w-7xl mx-auto">
      <NavBar />

      <div className="px-3 md:px-6 mt-6 mb-6">
        <h2 className="text-xl">Invite to your team</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Share this link to invite players to your team
          </p>
          <p className="border rounded-lg px-4 py-2 text-sm border-slate-300">{`${
            window.location.host
          }/invite?coach=${user?.id ?? ""}`}</p>
        </div>
      </div>

      {team.length === 0 ? (
        <p className="text-center text-xs text-gray-500">
          There are no players in your team
        </p>
      ) : (
        <ScrollArea className="w-full px-3 md:px-6 py-3">
          <Table>
            <TableHeader>
              <TableRow>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {team
                //   .filter((user) => user.role === ROLES["PLAYER"])
                .map((user) => (
                  <TableRow key={user.player.id}>
                    <TableCell className="whitespace-nowrap">
                      <Button asChild variant="link" className="px-0 py-1">
                        <Link
                          href={`/${user.player.id}`}
                          className="capitalize"
                        >
                          {user.player.displayName}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell>{user.stats[0]?.pointsPerGame ?? "-"}</TableCell>
                    <TableCell>
                      {user.stats[0]?.assistsPerGame ?? "-"}
                    </TableCell>
                    <TableCell>
                      {user.stats[0]?.reboundsPerGame ?? "-"}
                    </TableCell>
                    <TableCell>
                      {user.stats[0]?.turnoversPerGame ?? "-"}
                    </TableCell>
                    <TableCell>{user.stats[0]?.stealsPerGame ?? "-"}</TableCell>
                    <TableCell>{user.stats[0]?.blocksPerGame ?? "-"}</TableCell>
                    <TableCell>{user.stats[0]?.foulsPerGame ?? "-"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* <ScrollBar orientation="vertical" /> */}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </main>
  );
}
