import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyA_OzgQ2ah1mpF5gguB68BNpw8hGdN9Sbw',
  authDomain: 'haus-archive-80d24.firebaseapp.com',
  databaseURL: 'https://haus-archive-80d24-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'haus-archive-80d24',
  storageBucket: 'haus-archive-80d24.firebasestorage.app',
  messagingSenderId: '459748805258',
  appId: '1:459748805258:web:a80ae4f4033a4b8e8a7b73',
  measurementId: 'G-V27K42TTCQ',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const database = getDatabase(app);