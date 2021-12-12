import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyAbrFzaoRStG-B4Qs94JKo4ajDK8F820TQ",
    authDomain: "mini-asana.firebaseapp.com",
    projectId: "mini-asana",
    storageBucket: "mini-asana.appspot.com",
    messagingSenderId: "470298841632",
    appId: "1:470298841632:web:fcad215e0cd7b960966245"
};

firebase.initializeApp(firebaseConfig);

export const fStore = firebase.firestore();
export const fAuth = firebase.auth();

export const fTimestamp = firebase.firestore.Timestamp;
