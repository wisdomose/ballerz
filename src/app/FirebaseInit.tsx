"use client";

import Spinner from "@/components/Spinner";
import { firebaseConfig } from "@/lib";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { useEffect, useState } from "react";

export default function FirebaseInit({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initializeApp(firebaseConfig);

    if (process.env.NODE_ENV === "development") {
      const storage = getStorage();
      const auth = getAuth();
      const db = getFirestore();

      connectStorageEmulator(storage, "localhost", 9199);
      connectFirestoreEmulator(db, "localhost", 8080);
      connectAuthEmulator(auth, "http://localhost:9099", {
        disableWarnings: true,
      });
    }
    setInit(true);
  }, []);

  if (!init)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
        <Spinner />
      </div>
    );
  return <>{children}</>;
}
