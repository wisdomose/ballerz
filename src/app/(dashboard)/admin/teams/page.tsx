"use client";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
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
import TeamService from "@/services/Team";
import UserService from "@/services/User";
import { useUserStore } from "@/store/user";
import { Coach, ROLES } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UsersPage() {
  const user = useUserStore((s) => s.user);

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const { data, wrapper, loading } = useFetcher<Coach[]>();

  useEffect(() => {
    const teamService = new TeamService();
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
      setCoaches(data);
    }
  }, [data]);

  return (
    <main className="max-w-7xl mx-auto">
      <NavBar />

      {coaches.length === 0 && !loading ? (
        <p className="text-center text-xs text-gray-500 mt-6">No teams found</p>
      ) : coaches.length === 0 && loading ? (
        <div className="flex items-center justify-center mt-6">
          <Spinner />
        </div>
      ) : (
        <ScrollArea className="w-full px-3 md:px-6 py-3 mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Coach</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Gender</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coaches.map((coach) => (
                <TableRow key={coach.id}>
                  <TableCell>
                    <DeleteCoach id={coach.id} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button asChild variant="link" className="px-0 py-1">
                      <Link
                        href={`/admin/teams/${coach.id}`}
                        className="capitalize"
                      >
                        {coach.displayName}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>{coach.gender}</TableCell>
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

function DeleteCoach({ id }: { id: string }) {
  const { data, wrapper, loading } = useFetcher<boolean>();
  const user = useUserStore((s) => s.user);

  async function deleteHandler() {
    const userService = new UserService();
    await wrapper(() => userService.deleteOne(id));
  }

  useEffect(() => {
    if (data) toast.success("Team deleted");
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
