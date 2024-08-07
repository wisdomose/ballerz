import { COLLECTIONS, ROLES } from "@/types";
import * as admin from "firebase-admin";
import { initializeApp as initializeClientApp } from "firebase/app";
import { getAuth } from "firebase-admin/auth";
import { getAuth as getAuth2 } from "firebase/auth";
import {
  serverTimestamp,
  getFirestore,
  connectFirestoreEmulator,
  setDoc,
  doc,
} from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseConfig } from "@/lib";
import { connectAuthEmulator } from "firebase/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      return res.status(200).send("API up and running");

    const email = "admin@ballerz.com";
    const password = "password";
    const displayName = "admin";

    const admin2 =
      admin.apps.length > 0
        ? admin.app("admin")
        : admin.initializeApp(
            {
              // TODO: don't put this in production level code
              credential: admin.credential.cert({
                projectId: process.env.projectId,
                clientEmail: process.env.clientEmail,
                privateKey: process.env.privateKey,
              }),
            },
            "admin"
          );

    initializeClientApp(firebaseConfig);
    const db = getFirestore();

    try {
      if (process.env.NODE_ENV === "development") {
        const auth = getAuth2();
        // connectStorageEmulator(storage, "localhost", 9199);
        connectFirestoreEmulator(db, "localhost", 8080);
        connectAuthEmulator(auth, "http://localhost:9099");
      }
    } catch {}

    const userRecord = await getAuth(admin2).createUser({
      emailVerified: true,
      disabled: false,
      email,
      password,
      displayName,
    });

    const data = {
      id: userRecord.uid,
      displayName,
      role: ROLES["ADMIN"],
      email,
      timestamp: serverTimestamp(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, data.id), data);

    return res.status(200).json(data);
  } catch (error: any) {
    res.status(400).send(error?.response?.data ?? error.message);
  }
}
