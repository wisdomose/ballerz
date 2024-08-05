import { COLLECTIONS, User } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

export default class PlayerService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.changeCoach = this.changeCoach.bind(this);
  }

  async changeCoach(coachId: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        // update id
        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );
        const coachRef = doc(this.db, COLLECTIONS.USERS, coachId);

        await updateDoc(userRef, { coach: coachRef });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
