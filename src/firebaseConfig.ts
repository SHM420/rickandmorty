import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = { 
    apiKey: "AIzaSyD8ZZb5TXEo6Qscj4ki8E5MKgS9MOXZSuo", 
    authDomain: "shindiri-test.firebaseapp.com", 
    projectId: "shindiri-test", 
    storageBucket: "shindiri-test.appspot.com", 
    messagingSenderId: "52617965392", 
    appId: "1:52617965392:web:fc3ff399c4d2e6db6e4655", 
    measurementId: "G-CBB903KCR9", 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
