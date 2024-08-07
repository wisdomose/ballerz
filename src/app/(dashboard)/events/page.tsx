"use client";
import AddEvent from "@/components/AddEvent";
import NavBar from "@/components/NavBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import useFetcher from "@/hooks/useFetcher";
import EventService from "@/services/Event";
import { Attendance, Event, ROLES } from "@/types";
import { useEffect, useState } from "react";
import AttendanceService from "@/services/Attendance";
import AttendanceModal from "@/components/AttendanceModal";
import { FiCheck, FiTrash, FiX } from "react-icons/fi";
import { useUserStore } from "@/store/user";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const { data, wrapper, loading } = useFetcher<Event[]>();
  const attendanceFetcher = useFetcher<Attendance[]>();

  useEffect(() => {
    const eventService = new EventService();
    const attendanceService = new AttendanceService();
    wrapper(eventService.findAll);
    attendanceFetcher.wrapper(attendanceService.findAll);

    const interval = setInterval(async () => {
      await wrapper(eventService.findAll);
      await attendanceFetcher.wrapper(attendanceService.findAll);
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

  useEffect(() => {
    if (attendanceFetcher.data) {
      setAttendance(attendanceFetcher.data);
    }
  }, [attendanceFetcher.data]);

  return (
    <main className="max-w-7xl mx-auto">
      <NavBar />

      <div className="py-3 px-6 max-w-xl mx-auto">
        <AddEvent />
        <p className="mt-6 mb-4 text-xs uppercase font-bold">upcoming events</p>
        <div className="relative h-full flex flex-col gap-3 ">
          {events.map((event) => {
            const attending = attendance.find(
              (attendance) => attendance.event.id === event.id
            );
            return (
              <EventDetails
                key={event.id}
                event={event}
                attending={attending}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}

function EventDetails({
  event,
  attending,
}: {
  event: Event;
  attending?: Attendance;
}) {
  const { data, wrapper, loading } = useFetcher<boolean>();
  const user = useUserStore((s) => s.user);

  async function deleteHandler() {
    const eventService = new EventService();
    await wrapper(() => eventService.deleteOne(event.id));
  }

  useEffect(() => {
    if (data) toast.success("Event deleted");
  }, [data]);

  return (
    <div key={event.id} className="border rounded-md px-3 py-4">
      <div className="flex justify-between gap-2 flex-wrap-reverse">
        <div>
          <p className="text-xs text-gray-500">
            {moment(event.startingAt.toDate()).fromNow()}
          </p>
          <p className="text-sm font-medium">{event.name}</p>
        </div>

        <div className="flex items-center gap-3">
          {attending?.response === "yes" ? (
            <FiCheck className="text-green-500" />
          ) : attending?.response === "no" ? (
            <FiX className="text-red-700" />
          ) : attending?.response === "maybe" ? (
            <FiCheck className="text-orange-400" />
          ) : null}
          {user?.role === ROLES.ADMIN ? (
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
          ) : (
            <AttendanceModal event={event} attendance={attending} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Avatar className="w-6 h-6">
          <AvatarImage src="" />
          <AvatarFallback className="w-6 h-6 text-sm">
            {(event.createdBy.displayName.split(" ")[0][0] ?? "").toUpperCase()}
            {(event.createdBy.displayName.split(" ")[1][0] ?? "").toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <span className="text-xs font-medium capitalize">
          {event.createdBy.displayName}
        </span>
      </div>
    </div>
  );
}
