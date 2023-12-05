importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '271891465540'
});

const messaging = firebase.messaging();

self.addEventListener('push', (event) => {
  if (event.data) {
    const payload = event.data.json();
    // const url = payload.data['gcm.notification.url']; // Move this line inside the if block

    const options = {
      body: payload.notification.body,
      icon: payload.notification.icon,
    };

    event.waitUntil(
      self.registration.showNotification(payload.notification.title, options)
    );
  }
});
