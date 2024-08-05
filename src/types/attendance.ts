import { Timestamp } from "firebase/firestore";
import { Event } from "./event";
import { User } from "./user";

export type Attendance = {
  id: string;
  response: "yes" | "no" | "maybe";
  timestamp: Timestamp;
  event: Event;
  owner: User;
};
