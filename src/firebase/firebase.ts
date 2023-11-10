import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
// 	apiKey: "AIzaSyAffisCdRW2qR8XoppurClAg7O0Buz5vGs",
// 	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// 	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {
	apiKey: "AIzaSyAd6Vxygs4je5OQG2TgeWRlpXVe2BQHFXY",
	authDomain: "leetllm-7130e.firebaseapp.com",
	projectId: "leetllm-7130e",
	storageBucket: "leetllm-7130e.appspot.com",
	messagingSenderId: "84172139357",
	appId: "1:84172139357:web:7a352c0236b3e7c5f5d6b4",
	measurementId: "G-D16GBFPS1X"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, app };
