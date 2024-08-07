"use client";
import AddEvent from "@/components/AddEvent";
import Logout from "@/components/Logout";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/Spinner";
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
import PlayerService from "@/services/Player";
import TeamService, { TeamOverview } from "@/services/Team";
import UserService from "@/services/User";
import { useUserStore } from "@/store/user";
import { Player, ROLES } from "@/types";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UsersPage() {
  const user = useUserStore((s) => s.user);

  const [team, setTeam] = useState<Player[]>([]);
  const { data, wrapper, loading } = useFetcher<Player[]>();

  useEffect(() => {
    const teamService = new PlayerService();
    wrapper(teamService.findAll);

    const interval = setInterval(async () => {
      await wrapper(teamService.findAll);
    }, 3000);

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
    <main className="max-w-7xl mx-auto">
      <NavBar />

      {team.length === 0 && !loading ? (
        <p className="text-center text-xs text-gray-500 mt-6">
          No players found
        </p>
      ) : (
        <ScrollArea className="w-full px-3 md:px-6 py-3 mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Gender</TableHead>
                <TableHead className="whitespace-nowrap">Position</TableHead>
                <TableHead className="whitespace-nowrap">Level</TableHead>
                <TableHead className="whitespace-nowrap">Coach</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>
                    <DeletePlayer id={player.id} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button asChild variant="link" className="px-0 py-1">
                      <Link href={`/${player.id}`} className="capitalize">
                        {player.displayName}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.gender}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.level}</TableCell>
                  <TableCell>{player?.coach?.displayName??"-"}</TableCell>
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

function DeletePlayer({ id }: { id: string }) {
  const { data, wrapper, loading } = useFetcher<boolean>();
  const user = useUserStore((s) => s.user);

  async function deleteHandler() {
    const userService = new UserService();
    await wrapper(() => userService.deleteOne(id));
  }

  useEffect(() => {
    if (data) toast.success("User deleted");
  }, [data]);

  return (
    <>
      {user?.role === ROLES.ADMIN && (
        <Button
          disabled={loading}
          variant={"destructive"}
          size={"icon"}
          className="flex-shrink-0"
          onClick={deleteHandler}
        >
          {loading ? (
            <Spinner className="h-4 w-4 animate-spin" />
          ) : (
            <FiTrash className="w-4 h-4" />
          )}
        </Button>
      )}
    </>
  );
}
