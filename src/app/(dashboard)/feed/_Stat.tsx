import useFetcher from "@/hooks/useFetcher";
import EventService from "@/services/Event";
import PlayerService from "@/services/Player";
import TeamService from "@/services/Team";
import { useEffect } from "react";

export default function Stat() {
  const playerFetcher = useFetcher<number>(0);
  const eventFetcher = useFetcher<number>(0);
  const coachFetcher = useFetcher<number>(0);

  useEffect(() => {
    const playerService = new PlayerService();
    const eventService = new EventService();
    const teamService = new TeamService();
    playerFetcher.wrapper(playerService.count);
    eventFetcher.wrapper(eventService.count);
    coachFetcher.wrapper(teamService.count);

    const interval = setInterval(() => {
      playerFetcher.wrapper(playerService.count);
      eventFetcher.wrapper(eventService.count);
      coachFetcher.wrapper(teamService.count);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="">Players</p>
        <div className="border w-1/3 border-dashed"></div>
        <p className="border rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
          {playerFetcher.data}
        </p>
      </div>
      <div className="flex justify-between items-center my-4">
        <p className="">Teams</p>
        <div className="border w-1/3 border-dashed"></div>
        <p className="border rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
          {coachFetcher.data}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="">Events</p>
        <div className="border w-1/3 border-dashed"></div>
        <p className="border rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
          {eventFetcher.data}
        </p>
      </div>
    </>
  );
}
