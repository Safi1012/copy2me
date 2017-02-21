import * as firebase from 'firebase';

export class FirebaseService {

  private config = {
    apiKey: 'AIzaSyC7Li5wpMnQNMnLZZi8DOyfB0yl7vUSvJQ',
    authDomain: 'clipme-32a80.firebaseapp.com',
    databaseURL: 'https://clipme-32a80.firebaseio.com',
    storageBucket: '',
    messagingSenderId: '1001249808762'
  };

  constructor() {
    firebase.initializeApp(this.config);
  }
}
