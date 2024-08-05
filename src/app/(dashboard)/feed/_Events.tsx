"use client";
import useFetcher from "@/hooks/useFetcher";
import EventService from "@/services/Event";
import { Event } from "@/types";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const { data, wrapper, loading } = useFetcher<Event[]>();

  useEffect(() => {
    const eventService = new EventService();
    wrapper(eventService.findAll);

    const interval = setInterval(async () => {
      await wrapper(eventService.findAll);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setEvents(data);
    }
  }, [data]);
  return (
    <div className="!flex flex-col gap-3">
      {events.length === 0 ? (
        <p className="text-xs text-center text-gray-500 py-4">No events</p>
      ) : (
        events.map((event) => {
          return (
            <div key={event.id} className="border rounded-md px-3 py-2">
              <div>
                <p className="text-xs text-gray-500">
                  {moment(event.startingAt.toDate()).fromNow()}
                </p>
                <p className="text-sm font-medium first-letter:uppercase">
                  {event.name}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Avatar className="w-4 h-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="w-4 h-4 text-[10px]">
                    {(
                      event.createdBy.displayName.split(" ")[0][0] ?? ""
                    ).toUpperCase()}
                    {(
                      event.createdBy.displayName.split(" ")[1][0] ?? ""
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <span className="text-xs font-medium capitalize">
                  {event.createdBy.displayName}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
