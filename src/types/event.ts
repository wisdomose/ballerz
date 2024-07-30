import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export type Event = {
  id: string;
  name: string;
  createdBy: User;
  startingAt: Timestamp;
  timestamp: Timestamp;
};
