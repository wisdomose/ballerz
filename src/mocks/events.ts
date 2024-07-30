// Import necessary types
import { Timestamp } from "firebase/firestore";
import { Event } from "@/types";
import { users } from "./users";

// Define mock events
export const events: Event[] = [
  {
    id: "1",
    name: "Soccer Match",
    createdBy: users[0],
    startingAt: Timestamp.fromDate(new Date(2024, 6, 29, 16, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "2",
    name: "Basketball Training",
    createdBy: users[1],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 2, 12, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "3",
    name: "Yoga Session",
    createdBy: users[2],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 3, 9, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "4",
    name: "Swimming Competition",
    createdBy: users[3],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 4, 14, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "5",
    name: "Tennis Match",
    createdBy: users[4],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 5, 16, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "6",
    name: "Running Marathon",
    createdBy: users[0],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 6, 6, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "7",
    name: "Cycling Race",
    createdBy: users[1],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 7, 8, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "8",
    name: "Boxing Match",
    createdBy: users[2],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 8, 18, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "9",
    name: "Golf Tournament",
    createdBy: users[3],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 9, 11, 0)),
    timestamp: Timestamp.now()
  },
  {
    id: "10",
    name: "Volleyball Game",
    createdBy: users[4],
    startingAt: Timestamp.fromDate(new Date(2024, 8, 10, 15, 0)),
    timestamp: Timestamp.now()
  }
];
