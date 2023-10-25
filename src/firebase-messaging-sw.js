importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js");
const firebaseConfig = {
    apiKey: "AIzaSyDL6i90M0cXcKX9B-Rq3wIKLidsaaMz86g",
    authDomain: "tradevogue.firebaseapp.com",
    projectId: "tradevogue",
    storageBucket: "tradevogue.appspot.com",
    messagingSenderId: "271891465540",
    appId: "1:271891465540:web:674972c835685b5b5ac311"
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('src/firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
  }

messaging.onBackgroundMessage(function(payload) {
console.log('Received background message ', payload);

const notificationTitle = payload.notification.title;
const notificationOptions = {
body: payload.notification.body,
};

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  });
}

self.registration.showNotification(notificationTitle,
notificationOptions);
});
  
