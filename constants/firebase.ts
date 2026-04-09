import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAlSdV5oqX_HF69Fp-NDidkDeGKrzoFuFk",
  authDomain: "sowloab-app.firebaseapp.com",
  projectId: "sowloab-app",
  storageBucket: "sowloab-app.firebasestorage.app",
  messagingSenderId: "601689411218",
  appId: "1:601689411218:web:b31548b7b0ab2392eb604b",
  measurementId: "G-91CE6WZL4B",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
