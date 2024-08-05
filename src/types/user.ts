import { Timestamp } from "firebase/firestore";

export type Address = {
  country: string;
  state: string;
  city: string;
  street: string;
  houseNo: number;
};
export enum ROLES {
  PLAYER = "PLAYER",
  COACH = "COACH",
}
export enum LEVEL {
  BEGINNER = "BEGINNER",
  MODERATE = "MODERATE",
  PROFESSIONAL = "PROFESSIONAL",
}

export type Player = {
  id: string;
  coach: Coach;
  displayName: string;
  dob: Timestamp;
  address: Address;
  gender: string;
  role: ROLES;
  position: number;
  level: LEVEL;
  email: string;
  timestamp: Timestamp;
  photoURL?: string;
};

export type Coach = {
  id: string;
  displayName: string;
  dob: Timestamp;
  address: Address;
  gender: string;
  email: string;
  timestamp: Timestamp;
  photoURL?: string;
  role: ROLES;
};

export type User = Coach | Player;
