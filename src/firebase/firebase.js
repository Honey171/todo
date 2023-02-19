import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: 'todo-app-b90be.firebaseapp.com',
  projectId: 'todo-app-b90be',
  storageBucket: 'todo-app-b90be.appspot.com',
  messagingSenderId: process.env.REACT_APP_SENDER,
  appId: process.env.REACT_APP_ADD_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

export { db, auth };

