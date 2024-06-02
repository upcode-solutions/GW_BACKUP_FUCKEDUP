import { initializeApp } from "firebase/app"; //import initializeApp for firebaseConfig
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_0Bz2rJmzQ2GXuyzFxz922cL8UlUgl_Y",
  authDomain: "gowith-4c725.firebaseapp.com",
  databaseURL: "https://gowith-4c725-default-rtdb.firebaseio.com",
  projectId: "gowith-4c725",
  storageBucket: "gowith-4c725.appspot.com",
  messagingSenderId: "810839917221",
  appId: "1:810839917221:web:fbcd81f191354c8031034c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
