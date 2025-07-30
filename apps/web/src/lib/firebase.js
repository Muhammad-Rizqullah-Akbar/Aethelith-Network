
import { initializeApp } from "firebase/app";


import { getAuth } from "firebase/auth";




const firebaseConfig = {
    apiKey: "AIzaSyB6PurRc1PN8Rd5emHQfz8YUslSqwdFOEw",
    authDomain: "auth-firebase-9a3d2.firebaseapp.com",
    databaseURL: "https://auth-firebase-9a3d2-default-rtdb.firebaseio.com",
    projectId: "auth-firebase-9a3d2",
    storageBucket: "auth-firebase-9a3d2.firebasestorage.app",
    messagingSenderId: "916804052494",
    appId: "1:916804052494:web:67cccc45c94170948cfe5f"
};
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export default app;