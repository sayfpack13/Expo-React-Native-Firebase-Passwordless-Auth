// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase} from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyD2PTAn8xEJTd_3AhwxSwsVOEbT3lJGQBw",
  authDomain: "mmgc-98beb.firebaseapp.com",
  databaseURL:"https://mmgc-98beb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mmgc-98beb",
  storageBucket: "mmgc-98beb.appspot.com",
  messagingSenderId: "576330168916",
  appId: "1:576330168916:web:e44c45c83b91af25e90bc1"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDB = getFirestore(firebaseApp);
export const firebaseGetDB = getDatabase(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);