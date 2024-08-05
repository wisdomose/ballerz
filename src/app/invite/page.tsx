"use client";
import NavBar from "@/components/NavBar";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetcher from "@/hooks/useFetcher";
import PlayerService from "@/services/Player";
import UserService from "@/services/User";
import { useUserStore } from "@/store/user";
import { Coach, Player } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function InvitePage() {
  const user = useUserStore((s) => s.user);
  const search = useSearchParams();
  const { data, wrapper, loading, error } = useFetcher<Coach>();
  const acceptFetcher = useFetcher();
  const [coach, setCoach] = useState("");
  const router = useRouter();

  useEffect(() => {
    const id = search?.get("coach");
    setCoach(id ?? "");
  }, [search]);

  useEffect(() => {
    if (!user || !coach) return;

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userService = new UserService();
        wrapper(() => userService.profile(coach));
      }
    });
  }, [user, coach]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (acceptFetcher.data) {
      router.replace("/feed");
      toast.success("You have sucessfully changed teams");
    }
  }, [acceptFetcher.data]);

  useEffect(() => {
    if (acceptFetcher.error) {
      toast.error(acceptFetcher.error);
    }
  }, [acceptFetcher.error]);

  async function changeCoachHandler() {
    const playerService = new PlayerService();
    acceptFetcher.wrapper(() => playerService.changeCoach(coach));
  }

  return (
    <>
      <NavBar />
      <main className="flex my-20">
        <Card className="mx-auto">
          <CardHeader>
            <Image
              src="/logo.jpg"
              alt="logo"
              width={200}
              height={200}
              priority
              sizes="large"
              className="w-[200px] h-auto mx-auto"
            />
            <CardTitle className="text-center text-2xl">
              Invitation to join a team
            </CardTitle>
            <CardDescription>
              {(user as Player)?.coach?.id === coach ? (
                <p className="text-center">This is your current team</p>
              ) : !user ? (
                "You need to be loggedin to join a team"
              ) : data ? (
                <>
                  You have been invited by coach{" "}
                  <span className="font-bold capitalize">
                    {data.displayName}
                  </span>{" "}
                  to join his team
                </>
              ) : loading ? (
                <div className="flex items-center justify-center">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {(user as Player)?.coach?.id === coach ? null : user ? (
              <Button
                onClick={changeCoachHandler}
                loading={acceptFetcher.loading}
              >
                Accept invitation
              </Button>
            ) : (
              <Button asChild>
                <Link href="/">Login</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
