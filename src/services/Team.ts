import { Coach, COLLECTIONS, Player, ROLES, Stats } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
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
    this.count = this.count.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async team(id?: string) {
    return new Promise<Player[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          id ?? this.auth.currentUser.uid
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

  async overview(id?: string) {
    return new Promise<TeamOverview>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const team = await this.team(id);

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

  async count() {
    return new Promise<number>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const playerCol = collection(this.db, COLLECTIONS.USERS);
        let q = query(playerCol, where("role", "==", ROLES.COACH));
        const querySnapshot = await getCountFromServer(q);

        resolve(querySnapshot.data().count);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async findAll() {
    return new Promise<Coach[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();

        const usersCol = collection(this.db, COLLECTIONS.USERS);
        let q = query(usersCol, where("role", "==", ROLES.COACH));
        const querySnapshot = await getDocs(q);

        let promises: Promise<Coach | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                const coach = (await userService.profile(doc.id)) as Coach;
                res(coach);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const coaches = (await Promise.all(promises)).filter(
          (team) => team !== null
        );

        resolve(coaches);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
