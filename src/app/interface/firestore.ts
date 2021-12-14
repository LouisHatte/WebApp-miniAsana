import firebase from 'firebase/app';

export interface IFirestoreDocumentData extends firebase.firestore.DocumentData {
    id: string;
}
