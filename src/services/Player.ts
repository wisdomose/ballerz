import { Coach, COLLECTIONS, Player, ROLES } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export default class PlayerService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.changeCoach = this.changeCoach.bind(this);
    this.findAll = this.findAll.bind(this);
    this.count = this.count.bind(this);
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

  async findAll() {
    return new Promise<Player[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const playerCol = collection(this.db, COLLECTIONS.USERS);
        let q = query(
          playerCol,
          orderBy("timestamp", "asc"),
          where("role", "==", ROLES.PLAYER)
        );

        const querySnapshot = await getDocs(q);

        let promises: Promise<Player | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  if (data.coach) {
                    const coach = await getDoc(data.coach);
                    if (coach.exists()) data.coach = coach.data() as Coach;
                  }
                  res(data as Player);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const players = await Promise.all(promises);

        resolve(players.filter((player) => player !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const playerCol = collection(this.db, COLLECTIONS.USERS);
        let q = query(playerCol, where("role", "==", ROLES.PLAYER));
        const querySnapshot = await getCountFromServer(q);

        resolve(querySnapshot.data().count);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
