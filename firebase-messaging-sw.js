
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCdUN8ZYTgBy7T4VZMeItRhaV-Ql64euL8",
  authDomain: "triz-board.firebaseapp.com",
  projectId: "triz-board",
  storageBucket: "triz-board.firebasestorage.app",
  messagingSenderId: "565924919299",
  appId: "1:565924919299:web:781d21e8a5eea89f5b7636"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "TRIZ BCI";
  const options = {
    body: payload.notification?.body || "Новое событие в проекте",
    data: payload.data || {}
  };

  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const boardId = event.notification.data?.boardId;
  const target = boardId
    ? `./?board=${encodeURIComponent(boardId)}`
    : "./";

  event.waitUntil((async () => {
    const windows = await clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if ("focus" in client) {
        await client.focus();
        return;
      }
    }

    await clients.openWindow(target);
  })());
});
