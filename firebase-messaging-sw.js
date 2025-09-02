importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBcjdUxwJGVNf6dMIMuIQV8csRv3OsqoV8csRv3OsqoV8",
  authDomain: "trade-buddy-2ac42.firebaseapp.com",
  projectId: "trade-buddy-2ac42",
  storageBucket: "trade-buddy-2ac42.firebasestorage.app",
  messagingSenderId: "143538942512",
  appId: "1:143538942512:web:d96dc6e9f9f58b53beb3f5",
});

const messaging = firebase.messaging();

// Optional: handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle =
    payload.notification?.title || "Background Message Title";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo.png",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
