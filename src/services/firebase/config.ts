import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCwemrr63vZulKITUW4aS2TMMG96hD6mwg",
  authDomain: "partnermatcheu.firebaseapp.com",
  projectId: "partnermatcheu",
  storageBucket: "partnermatcheu.firebasestorage.app",
  messagingSenderId: "603509497796",
  appId: "1:603509497796:web:0a752e497612eebd778e91",
  measurementId: "G-PPQ8ZB7C4X"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
