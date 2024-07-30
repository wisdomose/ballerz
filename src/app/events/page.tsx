"use client";
import AddEvent from "@/components/AddEvent";
import Logout from "@/components/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { events } from "@/mocks/events";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function EventsPage() {
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

      <div className="py-3 px-6 max-w-xl mx-auto">
        <AddEvent />
        <p className="mt-6 mb-4 text-xs uppercase font-bold">upcoming events</p>
        <div className="relative h-full flex flex-col gap-3 ">
          {events.map((event) => {
            return (
              <div key={event.id} className="border rounded-md px-3 py-4">
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
                      {event.createdBy.displayName.split(" ")[0][0] ?? ""}
                      {event.createdBy.displayName.split(" ")[1][0] ?? ""}
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
      </div>
    </main>
  );
}
