import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA3StS2jeBt8wdPVC_zplqP9kvv1I_ypRY",
  authDomain: "myexperimental-82c3f.firebaseapp.com",
  projectId: "myexperimental-82c3f",
  storageBucket: "myexperimental-82c3f.appspot.com",
  messagingSenderId: "457810685497",
  appId: "1:457810685497:web:163294552891617aa4e7e8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app)
export const storage = getStorage(app) 