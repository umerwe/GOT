// lib/firebase.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Validate required environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
  }
}

// requiredEnvVars.forEach((envVar) => {
//   console.error(`Missing required environment variable: ${envVar}`);
// });

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === "undefined") return null;

  try {
    return getMessaging(app);
  } catch (err) {
    console.warn("Firebase messaging not available", err);
    return null;
  }
}

export { app, firebaseConfig };

// // src/lib/firebase.ts
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIza...YOUR_KEY", // You’ll need this from Firebase Console
//   authDomain: "got-app-d1d1f.firebaseapp.com",
//   projectId: "got-app-d1d1f",
//   storageBucket: "got-app-d1d1f.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID", // from service account (same as project number)
//   appId: "YOUR_APP_ID", // from Firebase console
// };

// const app = initializeApp(firebaseConfig);

// export const messaging =
//   typeof window !== "undefined" ? getMessaging(app) : null;

// // Function to request permission & get FCM token
// export async function requestForToken() {
//   if (!messaging) return null;

//   try {
//     const token = await getToken(messaging, {
//       vapidKey: "YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR", // from Firebase console → Project Settings → Cloud Messaging
//     });
//     return token;
//   } catch (err) {
//     console.error("Error getting FCM token:", err);
//     return null;
//   }
// }

// // Foreground messages
// export function onMessageListener() {
//   return new Promise((resolve) => {
//     if (!messaging) return;
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
// }
