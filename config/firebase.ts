import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqLS_ddtZzfe0ToNPfd7_sv54LzSNiZgU",
  authDomain: "parkease-f0142.firebaseapp.com",
  projectId: "parkease-f0142",
  storageBucket: "parkease-f0142.firebasestorage.app",
  messagingSenderId: "519242429950",
  appId: "1:519242429950:web:9fcdc1391a129757ad3caf"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db };
