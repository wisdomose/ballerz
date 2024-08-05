"use client";
import useFetcher from "@/hooks/useFetcher";
import { Player } from "@/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import TeamService from "@/services/Team";
import Link from "next/link";

export default function MyTeam() {
  const [team, setTeam] = useState<Player[]>([]);
  const { data, wrapper, loading } = useFetcher<Player[]>();

  useEffect(() => {
    const teamService = new TeamService();
    wrapper(teamService.team);

    const interval = setInterval(async () => {
      await wrapper(teamService.team);
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

  return (
    <div className="!flex flex-col gap-3">
      {team.length === 0 ? (
        <p className="text-xs text-center text-gray-500 py-4">
          No players in your team
        </p>
      ) : (
        team.map((member) => {
          return (
            <Link
              href={`/${member.id}`}
              key={member.id}
              className="border rounded-md p-3 flex items-center gap-2 hover:border-primary/30 hover:text-primary focus:border-primary/30 focus:text-primary"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-sm">
                  {(member.displayName.split(" ")[0][0] ?? "").toUpperCase()}
                  {(member.displayName.split(" ")[1][0] ?? "").toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium capitalize">
                {member.displayName}
              </span>
            </Link>
          );
        })
      )}
    </div>
  );
}
