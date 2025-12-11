// "use client";

// import { useEffect, useState } from "react";
// import { getFirebaseMessaging } from "@/lib/firebase";
// import {
//   getToken,
//   onMessage,
//   isSupported,
//   Messaging,
//   deleteToken,
// } from "firebase/messaging";

// export default function NotificationProvider() {
//   const [messaging, setMessaging] = useState<Messaging | null>(null);
//   const [isClient, setIsClient] = useState(false);
//   const [fcmToken, setFcmToken] = useState<string | null>(null);
//   const [status, setStatus] = useState<string>("Initializing...");

//   useEffect(() => {
//     console.log("Environment check:");
//     console.log(
//       "VAPID Key exists:",
//       !!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//       "Value:",
//       process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
//     );
//     console.log(
//       "API Key exists:",
//       !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//       "Value:",
//       process.env.NEXT_PUBLIC_FIREBASE_API_KEY
//     );
//     console.log("NotificationProvider: Component mounted");
//     setIsClient(true);
//   }, []);

//   useEffect(() => {
//     if (!isClient) {
//       console.log(
//         "NotificationProvider: Skipping initialization on server side"
//       );
//       return;
//     }

//     const initializeNotifications = async () => {
//       try {
//         setStatus("Checking browser support...");
//         console.log("NotificationProvider: Checking browser support");

//         // Check if notifications are supported
//         const supported = await isSupported();
//         if (!supported) {
//           const warning =
//             "Firebase Cloud Messaging is not supported in this browser.";
//           console.warn(warning);
//           setStatus(warning);
//           return;
//         }

//         if (!("serviceWorker" in navigator) || !("Notification" in window)) {
//           const warning = "Notifications not supported in this browser.";
//           console.warn(warning);
//           setStatus(warning);
//           return;
//         }

//         console.log("NotificationProvider: Browser supports notifications");
//         setStatus("Browser supports notifications");

//         // Wait for page load if service worker isn't ready
//         if (!navigator.serviceWorker.controller) {
//           console.log("NotificationProvider: Waiting for page load...");
//           setStatus("Waiting for page load...");
//           await new Promise((resolve) =>
//             window.addEventListener("load", resolve)
//           );
//         }

//         // Initialize messaging
//         setStatus("Initializing Firebase messaging...");
//         console.log("NotificationProvider: Initializing Firebase messaging");
//         const messagingInstance = getFirebaseMessaging();
//         if (!messagingInstance) {
//           const warning = "Messaging not initialized";
//           console.warn(warning);
//           setStatus(warning);
//           return;
//         }
//         setMessaging(messagingInstance);
//         console.log("NotificationProvider: Firebase messaging initialized");
//         setStatus("Firebase messaging initialized");

//         // Register service worker
//         setStatus("Registering service worker...");
//         console.log("NotificationProvider: Registering service worker");
//         const registration = await navigator.serviceWorker.register(
//           "/firebase-messaging-sw.js",
//           { scope: "/" }
//         );
//         console.log("SW registered:", registration.scope);
//         setStatus(`Service worker registered: ${registration.scope}`);

//         // Request permission
//         setStatus("Requesting notification permission...");
//         console.log("NotificationProvider: Requesting notification permission");
//         const permission = await Notification.requestPermission();
//         console.log("Notification permission:", permission);

//         if (permission !== "granted") {
//           const message = "Notification permission not granted.";
//           console.log(message);
//           setStatus(message);
//           return;
//         }

//         setStatus("Notification permission granted");
//         console.log("NotificationProvider: Notification permission granted");

//         // Get FCM token
//         setStatus("Getting FCM token...");
//         console.log("NotificationProvider: Getting FCM token");
//         const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
//         console.log("Using VAPID Key:", vapidKey);
//         if (!vapidKey) {
//           const error = "VAPID key is not defined";
//           console.error(error);
//           setStatus(error);
//           return;
//         }

//         const token = await getToken(messagingInstance, {
//           vapidKey,
//           serviceWorkerRegistration: registration,
//         });

//         console.log("FCM token:", token);
//         setFcmToken(token);

//         if (token) {
//           setStatus("FCM token obtained successfully");
//           console.log("NotificationProvider: FCM token obtained successfully");

//           // Send token to backend
//           setStatus("Sending token to server...");
//           console.log("NotificationProvider: Sending token to server");
//           await sendTokenToServer(token);
//         } else {
//           setStatus("Failed to get FCM token");
//           console.error("NotificationProvider: Failed to get FCM token");
//         }

//         // Set up foreground message listener
//         setStatus("Setting up message listener...");
//         console.log("NotificationProvider: Setting up message listener");
//         onMessage(messagingInstance, (payload) => {
//           console.log("Foreground message received:", payload);
//           setStatus("New message received");

//           // Show notification in UI (replace with toast library)
//           const title = payload.notification?.title || "Notification";
//           const body = payload.notification?.body || "";

//           // Use browser notification API for foreground
//           if (Notification.permission === "granted") {
//             const notification = new Notification(title, {
//               body,
//               icon: payload.notification?.icon || "/icons/icon-192.png",
//             });

//             notification.onclick = () => {
//               window.focus();
//               window.location.href =
//                 payload.data?.click_action || "/notifications"; // go to chat
//               notification.close();
//             };
//             // // Handle notification click
//             // notification.onclick = () => {
//             //   window.focus();
//             //   notification.close();
//             // };
//           }
//         });

//         // Handle token changes by periodically checking token validity
//         setStatus("Setting up token validity check...");
//         console.log("NotificationProvider: Setting up token validity check");
//         setupTokenValidityCheck(messagingInstance, vapidKey, registration);

//         setStatus("Notification system ready");
//         console.log("NotificationProvider: Notification system ready");
//       } catch (err) {
//         const error = `FCM setup error: ${err}`;
//         console.error(error);
//         setStatus(error);
//       }
//     };

//     initializeNotifications();
//   }, [isClient]);

//   const setupTokenValidityCheck = async (
//     messaging: Messaging,
//     vapidKey: string,
//     registration: ServiceWorkerRegistration
//   ) => {
//     // Check token validity every 30 minutes
//     const intervalId = setInterval(async () => {
//       try {
//         console.log("NotificationProvider: Checking token validity");
//         setStatus("Checking token validity...");

//         const currentToken = await getToken(messaging, {
//           vapidKey,
//           serviceWorkerRegistration: registration,
//         });

//         if (currentToken) {
//           console.log("NotificationProvider: Token is still valid");
//           setStatus("Token is valid");

//           // If token has changed, update server
//           if (currentToken !== fcmToken) {
//             console.log("NotificationProvider: Token changed, updating server");
//             setStatus("Token changed, updating server...");
//             setFcmToken(currentToken);
//             await sendTokenToServer(currentToken);
//           }
//         }
//       } catch (error) {
//         console.error("NotificationProvider: Token check failed:", error);
//         setStatus("Token check failed");
//         await handleTokenRefresh(messaging, vapidKey, registration);
//       }
//     }, 30 * 60 * 1000);

//     // Cleanup interval on unmount
//     return () => clearInterval(intervalId);
//   };

//   const handleTokenRefresh = async (
//     messaging: Messaging,
//     vapidKey: string,
//     registration: ServiceWorkerRegistration
//   ) => {
//     try {
//       console.log("NotificationProvider: Refreshing token");
//       setStatus("Refreshing token...");

//       await deleteToken(messaging);

//       const newToken = await getToken(messaging, {
//         vapidKey,
//         serviceWorkerRegistration: registration,
//       });

//       if (newToken) {
//         console.log("NotificationProvider: New FCM token:", newToken);
//         setStatus("New token obtained");
//         setFcmToken(newToken);
//         await sendTokenToServer(newToken);
//       }
//     } catch (error) {
//       console.error("NotificationProvider: Token refresh failed:", error);
//       setStatus("Token refresh failed");
//     }
//   };

//   const sendTokenToServer = async (token: string) => {
//     try {
//       console.log("NotificationProvider: Sending token to server:", token);
//       setStatus("Sending token to server...");

//       // const response = await fetch(
//       //   `${process.env.NEXT_PUBLIC_BASE_URL}/update-profile`,
//       //   {
//       //     method: "POST",
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //     body: JSON.stringify({ fcm_token: token }),
//       //     // credentials: "include",
//       //   }
//       // );

//       // if (response.ok) {
//       //   console.log("NotificationProvider: Token sent to server successfully");
//       //   setStatus("Token sent to server successfully");
//       // } else {
//       //   console.error(
//       //     "NotificationProvider: Failed to send token to server:",
//       //     response.status
//       //   );
//       //   setStatus(`Failed to send token: ${response.status}`);
//       // }
//     } catch (error) {
//       console.error(
//         "NotificationProvider: Failed to send token to server:",
//         error
//       );
//       setStatus("Failed to send token to server");
//     }
//   };

//   // const [mounted, setMounted] = useState(false);
//   // useEffect(() => {
//   //   setMounted(true);
//   // }, []);

//   // if (!mounted) return null; // prevents hydration mismatch

//   return null;
//   // return (
//   //   <div
//   //     style={{
//   //       position: "fixed",
//   //       bottom: "10px",
//   //       right: "10px",
//   //       background: "white",
//   //       padding: "10px",
//   //       border: "1px solid #ccc",
//   //       zIndex: 9999,
//   //       fontSize: "12px",
//   //     }}
//   //   >
//   //     <div>Notification Status: {status}</div>
//   //     {fcmToken && (
//   //       <div>
//   //         FCM Token:
//   //         <div
//   //           style={{
//   //             maxWidth: "200px",
//   //             overflow: "hidden",
//   //             textOverflow: "ellipsis",
//   //           }}
//   //         >
//   //           {fcmToken}
//   //         </div>
//   //       </div>
//   //     )}
//   //   </div>
//   // );
// }
