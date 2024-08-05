import { COLLECTIONS, Event } from "@/types";

import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import UserService from "./User";

export default class EventService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
  }

  async create(params: Pick<Event, "name" | "startingAt">) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );

        const event = {
          name: params.name,
          startingAt: params.startingAt,
          createdBy: userRef,
          timestamp: serverTimestamp(),
        };

        const saved = await addDoc(
          collection(this.db, COLLECTIONS.EVENTS),
          event
        );

        // update id
        const eventRef = doc(this.db, COLLECTIONS.EVENTS, saved.id);

        await updateDoc(eventRef, { id: saved.id });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  async findOne(id: string) {
    return new Promise<Event>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const eventRef = doc(this.db, COLLECTIONS.EVENTS, id);

        const querySnapshot = await getDoc(eventRef);

        if (querySnapshot.exists()) {
          const data = querySnapshot.data();
          const owner = await getDoc(data.createdBy);
          const event = {
            ...data,
            createdBy: owner.data(),
          };

          resolve(event as unknown as Event);
        } else throw new Error("No event found");
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
  async findAll() {
    return new Promise<Event[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();
        const profile = await userService.profile();

        // const userRef = doc(
        //   this.db,
        //   COLLECTIONS.USERS,
        //   this.auth.currentUser.uid
        // );

        const eventCol = collection(this.db, COLLECTIONS.EVENTS);
        let q = query(
          eventCol,
          where("startingAt", ">=", Timestamp.fromDate(new Date())),
          orderBy("startingAt", "asc")
        );

        const querySnapshot = await getDocs(q);

        let promises: Promise<Event | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const createdBy = await getDoc(data.createdBy);

                  const event = {
                    ...data,
                    createdBy: { ...(createdBy.data() ?? {}) },
                  } as Event;
                  res(event);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const events = await Promise.all(promises);

        resolve(events.filter((events) => events !== null));
      } catch (error: any) {
        console.log(error);
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
