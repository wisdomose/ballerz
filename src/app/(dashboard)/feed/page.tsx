"use client";
import AddEvent from "@/components/AddEvent";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import Events from "./_Events";
import CreatePost from "@/components/CreatePost";
import Posts from "./_Posts";
import NavBar from "@/components/NavBar";
import { ROLES } from "@/types";
import MyTeam from "./_MyTeam";
import { useUserStore } from "@/store/user";
import MyStat from "./_MyStat";

export default function FeedPage() {
  const user = useUserStore((s) => s.user);
  return (
    <main className="md:grid md:grid-rows-[max-content,calc(100vh_-_64.67px)] md:max-h-screen md:h-screen md:overflow-hidden max-w-7xl mx-auto">
      <NavBar />

      <main className="md:grid md:grid-cols-[240px,1fr] lg:grid-cols-[240px,1fr,240px]">
        <div className="border-r hidden md:grid grid-rows-[max-content,1fr] pt-3 pl-6">
          <div className="mb-4 pr-4">
            <AddEvent />

            <p className="text-xs uppercase font-medium">upcoming events</p>
          </div>
          <div className="relative h-full">
            <div className="absolute inset-0 pb-3">
              <ScrollArea className="pr-3 h-full">
                <Events />
              </ScrollArea>
            </div>
          </div>
        </div>

        <ScrollArea className="pr-3">
          <CreatePost />
          <Posts />
        </ScrollArea>

        <div className="hidden lg:grid h-full border-l grid-rows-[max-content,1fr] pl-1">
          {user?.role === ROLES.PLAYER ? (
            <>
              <div className="pl-3 mb-4 pr-6 pt-3">
                <Button variant="outline" asChild className="mb-2 w-full">
                  <Link href={`/add-stat?player=${user.id}`}>
                    <FiPlus className="mr-2" />
                    <span>Add a new stat</span>
                  </Link>
                </Button>

                <p className="text-xs uppercase font-medium">
                  latest performance
                </p>
              </div>
              <div className="relative h-full pb-3">
                <div className="absolute inset-0">
                  <ScrollArea className="pr-3 h-full">
                    <MyStat />
                  </ScrollArea>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="pl-3 mb-4 pr-6 pt-3">
                <p className="text-xs uppercase font-medium">My team</p>
              </div>
              <MyTeam />
            </>
          )}
        </div>
      </main>
    </main>
  );
}
