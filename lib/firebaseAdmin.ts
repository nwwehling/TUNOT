import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cached: Firestore | undefined;

function getDb(): Firestore {
  if (cached) return cached;
  if (!getApps().length) {
    const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!key) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set");
    }
    initializeApp({ credential: cert(JSON.parse(key)) });
  }
  cached = getFirestore();
  return cached;
}

export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const db = getDb();
    const value = Reflect.get(db, prop, receiver);
    return typeof value === "function" ? value.bind(db) : value;
  },
});
