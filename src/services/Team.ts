import { COLLECTIONS, Player, Stats } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import UserService from "./User";
import StatsService from "./Stat";

export type TeamOverview = { player: Player; stats: Stats[] }[];

export default class TeamService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.team = this.team.bind(this);
    this.overview = this.overview.bind(this);
  }

  async team() {
    return new Promise<Player[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );

        const usersCol = collection(this.db, COLLECTIONS.USERS);
        let q = query(usersCol, where("coach", "==", userRef));
        const querySnapshot = await getDocs(q);

        let promises: Promise<Player | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                const player = (await userService.profile(doc.id)) as Player;
                res(player);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const team = await Promise.all(promises);
        resolve(team.filter((team) => team !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async overview() {
    return new Promise<TeamOverview>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const team = await this.team();

        let promises: Promise<TeamOverview[number] | null>[] = [];
        team.forEach((player) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                const statService = new StatsService();
                const stats = await statService.findAll(player.id);
                const result = {
                  player,
                  stats,
                };
                res(result);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const result = await Promise.all(promises);
        resolve(result.filter((entry) => entry !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
