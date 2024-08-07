"use client";

import { useUserStore } from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logout from "./Logout";
import { ROLES } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";

export default function NavBar() {
  const user = useUserStore((s) => s.user);

  return (
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
        {user?.role === ROLES["COACH"] ? (
          <Button asChild>
            <Link href="/team">My team</Link>
          </Button>
        ) : user?.role === ROLES.PLAYER ? (
          <Button asChild>
            <Link href={`/${user?.id}`}>My Stats</Link>
          </Button>
        ) : null}
        {user?.role === ROLES.ADMIN && (
          <>
            <Link href="/admin/players">Players</Link>
            <Link href="/admin/teams">Teams</Link>
          </>
        )}
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback>
                {" "}
                {(user?.displayName.split(" ")[0][0] ?? "").toUpperCase()}
                {(user?.displayName.split(" ")[1] ?? ""[0] ?? "").toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-xs bg-blue-100 text-blue-700 px-2 py-1 tracking-wider rounded-full w-fit">
              {user?.role}
            </p>
          </PopoverContent>
        </Popover>
        {/* <Dialog>
          <DialogTrigger>Change picture</DialogTrigger>
          <DialogContent className="">
            <DialogHeader></DialogHeader>
            <p>hello</p>
          </DialogContent>
        </Dialog> */}
        <Logout />
      </div>
    </nav>
  );
}
