import { Timestamp } from "firebase/firestore";
import { User } from "./user";

export type Post = {
  id: string;
  post: string;
  photoURL?: string;
  owner: User;
  timestamp: Timestamp;
};
