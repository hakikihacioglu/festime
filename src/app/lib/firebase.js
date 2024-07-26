import { initializeApp } from 'firebase/app';
//import { getAuth } from 'firebase/auth';
//import { getFirestore } from 'firebase/firestore';
import { firebaseClientConfig } from "../../config/firebase";

export const app = initializeApp(firebaseClientConfig);
//const auth = getAuth(app);
//const db = getFirestore(app);


