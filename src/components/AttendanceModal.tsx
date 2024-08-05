"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useFetcher from "@/hooks/useFetcher";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { FiTrello } from "react-icons/fi";
import moment from "moment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Attendance, Event } from "@/types";
import AttendanceService from "@/services/Attendance";

type AttendanceModalProps = {
  event: Event;
  attendance?: Attendance;
};

export default function AttendanceModal({
  event,
  attendance,
}: AttendanceModalProps) {
  const { wrapper, data, loading, error } = useFetcher(null);

  const [response, setResponse] = useState<Attendance["response"]>(
    () => attendance?.response ?? "yes"
  );

  const updateResponse = (res: Attendance["response"]) => {
    setResponse(res);
  };

  async function submitHandler() {
    const attendanceService = new AttendanceService();

    attendance
      ? await wrapper(() =>
          attendanceService.update({ id: attendance.id, response })
        )
      : await wrapper(() =>
          attendanceService.create({ id: event.id, response })
        );
  }

  useEffect(() => {
    if (attendance) {
      setResponse(attendance.response);
    }
  }, [attendance]);

  useEffect(() => {
    if (data) {
      toast.success("Attendance updated");
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="shadow-none">
          <FiTrello />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark attendance</DialogTitle>
          <DialogDescription>
            Will you be attending{" "}
            <span className="font-semibold capitalize">{event.name}</span> on
            the {moment(event.startingAt.toDate()).format("Do [of] MMMM, YYYY")}
            ?
          </DialogDescription>
        </DialogHeader>

        <Select onValueChange={updateResponse} defaultValue={response}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="button"
          className="mt-3"
          loading={loading}
          onClick={submitHandler}
        >
          Mark attendance
        </Button>
      </DialogContent>
    </Dialog>
  );
}
