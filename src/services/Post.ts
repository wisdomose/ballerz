import { COLLECTIONS, Post, User } from "@/types";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import UserService from "./User";
import StorageService from "./Storage";

export default class PostService {
  auth;
  db;
  app;

  constructor() {
    this.app = getApp();
    this.auth = getAuth();
    this.db = getFirestore();

    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
  }

  async create(params: Pick<Post, "post"> & { file?: File }) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(
          this.db,
          COLLECTIONS.USERS,
          this.auth.currentUser.uid
        );

        const store = new StorageService();
        const photoURL = params.file
          ? await store.upload(params.file)
          : "";

        const post = {
          post: params.post,
          owner: userRef,
          photoURL,
          timestamp: serverTimestamp(),
        };

        const saved = await addDoc(
          collection(this.db, COLLECTIONS.POSTS),
          post
        );

        // update id
        const postRef = doc(this.db, COLLECTIONS.POSTS, saved.id);

        await updateDoc(postRef, { id: saved.id });

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
  async findAll() {
    return new Promise<Post[]>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");
        const userService = new UserService();
        const profile = await userService.profile();

        // const userRef = doc(
        //   this.db,
        //   COLLECTIONS.USERS,
        //   this.auth.currentUser.uid
        // );

        const postCol = collection(this.db, COLLECTIONS.POSTS);
        let q = query(postCol, orderBy("timestamp", "desc"));

        const querySnapshot = await getDocs(q);

        let promises: Promise<Post | null>[] = [];
        querySnapshot.forEach((doc) => {
          promises.push(
            new Promise(async (res, rej) => {
              try {
                if (doc.exists()) {
                  const data = doc.data();
                  const owner = await getDoc(data.owner);

                  const post = {
                    ...data,
                    owner: { ...(owner.data() ?? {}) },
                  } as Post;
                  res(post);
                } else res(null);
              } catch (error) {
                res(null);
              }
            })
          );
        });

        const posts = await Promise.all(promises);
        resolve(posts.filter((posts) => posts !== null));
      } catch (error: any) {
        reject(error?.response?.data ?? error.message);
      }
    });
  }

  async deleteOne(id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        if (!this.auth.currentUser) throw new Error("You need to be logged in");

        const userRef = doc(this.db, COLLECTIONS.POSTS, id);

        await deleteDoc(userRef);

        resolve(true);
      } catch (error: any) {
        reject(error.message);
      }
    });
  }
}
