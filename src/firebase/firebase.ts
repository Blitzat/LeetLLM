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
	apiKey: "AIzaSyAffisCdRW2qR8XoppurClAg7O0Buz5vGs",
	authDomain: "leetllm.firebaseapp.com",
	projectId: "leetllm",
	storageBucket: "leetllm.appspot.com",
	messagingSenderId: "321472127598",
	appId: "1:321472127598:web:8c632411a38e026da47c7f",
	measurementId: "G-CX6KZFTFVT"
  };

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, app };
