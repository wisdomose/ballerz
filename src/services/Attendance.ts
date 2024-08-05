import { Attendance, COLLECTIONS, Event } from "@/types";

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

export default class AttendanceService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.update = this.update.bind(this);
  }

  //   event is not attendance id
  async create(params: Pick<Attendance, "id" | "response">) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );
        const eventRef = doc(this.db, COLLECTIONS.EVENTS, params.id);

        const attendance = {
          owner: userRef,
          event: eventRef,
          response: params.response,
          timestamp: serverTimestamp(),
        };

        const saved = await addDoc(
          collection(this.db, COLLECTIONS.ATTENDANCE),
          attendance
        );

        // update id
        const attendanceRef = doc(this.db, COLLECTIONS.ATTENDANCE, saved.id);

        await updateDoc(attendanceRef, { id: saved.id });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async update(params: Pick<Attendance, "id" | "response">) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const attendanceRef = doc(this.db, COLLECTIONS.ATTENDANCE, params.id);

        const attendance = {
          response: params.response,
          timestamp: serverTimestamp(),
        };

        await updateDoc(attendanceRef, attendance);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async findAll() {
    return new Promise<Attendance[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );

        const attendanceCol = collection(this.db, COLLECTIONS.ATTENDANCE);
        let q = query(
          attendanceCol,
          where("owner", "==", userRef),
          orderBy("timestamp", "asc")
        );

        const querySnapshot = await getDocs(q);

        let promises: Promise<Attendance | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const owner = await getDoc(data.owner);
                  const event = await getDoc(data.event);

                  const attendance = {
                    ...data,
                    owner: { ...(owner.data() ?? {}) },
                    event: { ...(event.data() ?? {}) },
                  } as Attendance;
                  res(attendance);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const attendance = await Promise.all(promises);

        resolve(attendance.filter((attendance) => attendance !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }
}
