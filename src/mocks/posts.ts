// Import necessary types
import { Timestamp } from "firebase/firestore";
import { users } from "./users"; // Assuming users are defined in users.ts
import { Post } from "@/types";

// Define mock posts
export const posts: Post[] = [
  {
    id: "post1",
    post: "Excited about the upcoming soccer match!",
    photoURL: "https://example.com/soccer.jpg",
    owner: users[0],
    timestamp: Timestamp.now(),
  },
  {
    id: "post2",
    post: "Had an amazing basketball training session today.",
    photoURL: "https://example.com/basketball.jpg",
    owner: users[1],
    timestamp: Timestamp.now(),
  },
  {
    id: "post3",
    post: "Yoga is the best way to start the day!",
    owner: users[2],
    timestamp: Timestamp.now(),
  },
  {
    id: "post4",
    post: "Swimming competition was intense but fun!",
    photoURL: "https://example.com/swimming.jpg",
    owner: users[3],
    timestamp: Timestamp.now(),
  },
  {
    id: "post5",
    post: "Tennis match today, feeling ready!",
    photoURL: "https://example.com/tennis.jpg",
    owner: users[4],
    timestamp: Timestamp.now(),
  },
  {
    id: "post6",
    post: "Completed my first marathon! What an experience!",
    owner: users[0],
    timestamp: Timestamp.now(),
  },
  {
    id: "post7",
    post: "Cycling race through the city was exhilarating!",
    photoURL: "https://example.com/cycling.jpg",
    owner: users[1],
    timestamp: Timestamp.now(),
  },
  {
    id: "post8",
    post: "Boxing match was tough but I learned a lot.",
    owner: users[2],
    timestamp: Timestamp.now(),
  },
  {
    id: "post9",
    post: "Played in a golf tournament today, it was great!",
    photoURL: "https://example.com/golf.jpg",
    owner: users[3],
    timestamp: Timestamp.now(),
  },
  {
    id: "post10",
    post: "Had a fantastic volleyball game with friends.",
    photoURL: "https://example.com/volleyball.jpg",
    owner: users[4],
    timestamp: Timestamp.now(),
  },
];
