// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Firebase config - will be injected during build
const firebaseConfig = {
  apiKey: "AIzaSyDN6ba7rwLpaAR3uwCbtUR5-nt3bqziEVI",
  authDomain: "got-app-d1d1f.firebaseapp.com",
  projectId: "got-app-d1d1f",
  storageBucket: "got-app-d1d1f.appspot.com",
  messagingSenderId: "665749499527",
  appId: "1:665749499527:web:fb38b4a0cba5d6a9975222"
};

try {
  // Initialize Firebase
  console.log('Service worker: Initializing Firebase with config', firebaseConfig);
  firebase.initializeApp(firebaseConfig);
  console.log('Service worker: Firebase initialized successfully');
  
  const messaging = firebase.messaging();
  console.log('Service worker: Messaging initialized');

  messaging.onBackgroundMessage(function (payload) {
    console.log('Service worker: Background message received:', payload);
    
    try {
      const title = payload.notification?.title || "Notification";
      const options = {
        body: payload.notification?.body || "",
        icon: payload.notification?.icon || "/icons/icon-192.png",
        badge: "/icons/icon-72.png",
        data: payload.data || {},
        tag: payload.data?.tag || 'general-notification'
      };
      
      self.registration.showNotification(title, options);
    } catch (error) {
      console.error('Service worker: Error showing notification:', error);
    }
  });

  // Handle notification click
  self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || '/';
    
    event.waitUntil(
      clients.matchAll({ 
        type: "window", 
        includeUncontrolled: true 
      }).then(function(clientList) {
        // Check if there's already a window open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no client found, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  });

  // Handle push subscription change
  self.addEventListener('pushsubscriptionchange', function(event) {
    event.waitUntil(
      self.registration.pushManager.subscribe(event.oldSubscription.options)
        .then(function(subscription) {
          // Send new subscription to your server
        })
    );
  });

} catch (error) {
  console.error('Service worker: Error during initialization:', error);
}




// // public/firebase-messaging-sw.js

// importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "YOUR_FIREBASE_KEY",
//   authDomain: "YOUR_PROJECT.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// });

// const messaging = firebase.messaging();

// // Handle background notifications
// messaging.onBackgroundMessage((payload) => {
//   console.log("Received background message ", payload);
//   self.registration.showNotification(payload.notification.title, {
//     body: payload.notification.body,
//     icon: "/icon.png",
//   });
// });
