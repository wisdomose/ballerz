import { COLLECTIONS, Player, Stats } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import UserService from "./User";

export default class StatsService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.findOne = this.findOne.bind(this);
    this.findAll = this.findAll.bind(this);
    this.latest = this.latest.bind(this);
  }

  async create({
    owner,
    stats,
  }: {
    stats: Omit<Stats, "id" | "owner" | "timestamp" | "updatedAt">;
    owner: string;
  }) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(this.db, COLLECTIONS.USERS, owner);

        const stat = {
          owner: userRef,
          timestamp: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...stats,
        };

        const saved = await addDoc(
          collection(this.db, COLLECTIONS.STATS),
          stat
        );

        // update id
        const statRef = doc(this.db, COLLECTIONS.STATS, saved.id);

        await updateDoc(statRef, { id: saved.id });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  async update({
    owner,
    stats,
    id,
  }: {
    stats: Omit<Stats, "id" | "owner" | "timestamp" | "updatedAt">;
    owner: Player;
    id: string;
  }) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        // check if loggedin user is the owner of the stat
        const isLoggedInUser = owner.id === this.auth.currentUser.uid;
        // check of logged-in user is the coach of owner
        const isCoach = owner?.coach?.id === this.auth.currentUser.uid;

        if (!isLoggedInUser && !isCoach)
          throw new Error("You cannot edit this stat");

        const statRef = doc(this.db, COLLECTIONS.STATS, id);

        const update = { ...stats, updatedAt: serverTimestamp() };
        await updateDoc(statRef, update);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  async findOne(id: string) {
    return new Promise<Stats>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const statRef = doc(this.db, COLLECTIONS.STATS, id);

        const querySnapshot = await getDoc(statRef);

        if (querySnapshot.exists()) {
          const data = querySnapshot.data();
          const owner = await getDoc(data.owner);
          const stat = {
            ...data,
            owner: owner.data(),
          };

          resolve(stat as unknown as Stats);
        } else throw new Error("No stat found");
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async findAll(id?: string) {
    return new Promise<Stats[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();
        const profile = await userService.profile();

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          id ?? this.auth.currentUser.uid
        );

        const statsCol = collection(this.db, COLLECTIONS.STATS);
        let q = query(
          statsCol,
          where("owner", "==", userRef),
          orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);

        let promises: Promise<Stats | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const owner = await getDoc(data.owner);

                  const stat = {
                    ...data,
                    owner: { ...(owner.data() ?? {}) },
                  } as Stats;
                  res(stat);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const stats = await Promise.all(promises);
        resolve(stats.filter((stat) => stat !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async latest() {
    return new Promise<Stats>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();
        const profile = await userService.profile();

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );

        const statsCol = collection(this.db, COLLECTIONS.STATS);
        let q = query(
          statsCol,
          where("owner", "==", userRef),
          orderBy("timestamp", "desc"),
          limit(1)
        );

        const querySnapshot = await getDocs(q);

        let promises: Promise<Stats | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const owner = await getDoc(data.owner);

                  const stat = {
                    ...data,
                    owner: { ...(owner.data() ?? {}) },
                  } as Stats;
                  res(stat);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const stats = (await Promise.all(promises)).filter(
          (stat) => stat !== null
        );

        if (stats.length === 0) throw new Error("No stat found");
        resolve(stats[0]);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
