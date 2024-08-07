import { Coach, COLLECTIONS, Player, ROLES, User } from "@/types";
import axios from "axios";
import { getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export type LoginResponse = User;
export type SignUpResponse = User;

export default class UserService {
  auth;
  storage;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();
    this.storage = getStorage();

    this.login = this.login.bind(this);
    this.profile = this.profile.bind(this);
    this.signUp = this.signUp.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async login({ email, password }: { email: string; password: string }) {
    return new Promise<LoginResponse>(async (resolve, reject) => {
      try {
        const userCredential = await signInWithEmailAndPassword(
          this.auth,
          email,
          password
        );

        if (userCredential.user) {
          const profile = await this.profile();
          resolve(profile);
        }

        throw new Error("Failed to login");
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async signUp(
    params: Omit<
      Player & Coach,
      "id" | "timestamp" | "photoURL" | "coach" | "position"
    > & {
      password: string;
      position?: number;
    }
  ) {
    return new Promise<SignUpResponse>(async (resolve, reject) => {
      try {
        if (this.auth.currentUser)
          throw new Error("You cannot perform this operation");

        const result = await axios({
          url:
            params.role === ROLES.COACH
              ? "/api/create-coach"
              : `/api/create-player`,
          method: "POST",
          data: params,
        });

        resolve(result.data);
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async profile(id?: string) {
    return new Promise<User>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const q = query(
          collection(this.db, COLLECTIONS.USERS),
          where("id", "==", id ?? this.auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          let profile = {
            ...doc.data(),
          } as User;

          if (profile.role === ROLES.PLAYER && (profile as Player).coach) {
            // @ts-ignore
            const coach = await getDoc(profile.coach);
            if (coach.exists())
              (profile as Player).coach = coach.data() as Coach;
          }

          resolve(profile as unknown as User);
        }
      } catch (error: any) {
        reject(error.message);
      }
    });
  }

  async deleteOne(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(this.db, COLLECTIONS.USERS, id);

        await axios({
          url: `/api/delete-user`,
          method: "DELETE",
          data: { id },
        });

        await deleteDoc(userRef);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
