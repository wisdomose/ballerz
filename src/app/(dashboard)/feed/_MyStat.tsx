import { Progress } from "@/components/ui/progress";
import useFetcher from "@/hooks/useFetcher";
import { statKeyMap } from "@/lib";
import StatsService from "@/services/Stat";
import { Stats } from "@/types";
import { useEffect, useState } from "react";

export default function MyStat() {
  const [stat, setStat] = useState<Stats>();
  const { data, wrapper, error, loading } = useFetcher<Stats>();

  useEffect(() => {
    const statService = new StatsService();
    wrapper(statService.latest);
    const interval = setInterval(() => {
      wrapper(statService.latest);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (data) {
      setStat(data);
    }
  }, [data]);
  return (
    <>
      {!stat ? (
        <p className="text-xs text-center text-gray-500 py-4">No stat found</p>
      ) : stat ? (
        <div className="!flex flex-col gap-3">
          {Object.keys(stat).map((key) => {
            if (
              ["id", "owner", "timestamp", "updatedAt", "remark"].includes(key)
            )
              return null;
            else if (
              [
                "fieldGoalPercentage",
                "threePointPercentage",
                "freeThrowPercentage",
                "trueShootingPercentage",
                "effectiveFieldGoalPercentage",
              ].includes(key)
            )
              return (
                <div key={key} className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {/* @ts-ignore */}
                    {statKeyMap[key]}
                  </p>

                  {/* @ts-ignore */}
                  <Progress value={stat[key]} />
                </div>
              );
            else
              return (
                <div key={key} className="px-3 py-2">
                  {/* @ts-ignore */}
                  <p className="text-sm font-medium">{statKeyMap[key]}</p>
                  {/* @ts-ignore */}
                  <p className="text-gray-600">{stat[key]}</p>
                </div>
              );
          })}
        </div>
      ) : null}
    </>
  );
}
