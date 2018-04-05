import * as firebase from 'firebase';

const config = 
    {
      apiKey: 'AIzaSyBEjbFIvUD3zkxjI-6dY1LIEb9yM1z6gZw',
      authDomain: 'firstfirebase-60dcc.firebaseapp.com',
      databaseURL: 'https://firstfirebase-60dcc.firebaseio.com',
      projectId: 'firstfirebase-60dcc',
      storageBucket: 'firstfirebase-60dcc.appspot.com',
      messagingSenderId: '1089831089269'
    };

  export const firebaseApp = firebase.initializeApp(config);
