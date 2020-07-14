import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDwVCS99zXhsuLAYhQZGB9G1NAaZ52jwtI',
  authDomain: 'recipe-app-b1c70.firebaseapp.com',
  databaseURL: 'https://recipe-app-b1c70.firebaseio.com',
  projectId: 'recipe-app-b1c70',
  storageBucket: 'recipe-app-b1c70.appspot.com',
  messagingSenderId: '548194390212',
  appId: '1:548194390212:web:d9c0a783db23f2382c7991',
};

firebase.initializeApp(firebaseConfig);

// firebase.firestore().settings();

export default firebase;
