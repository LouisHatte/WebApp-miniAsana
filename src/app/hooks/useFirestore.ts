import React, { useEffect, useReducer, useState } from "react";
import firebase from 'firebase/app';

import { fStore, fTimestamp } from "app/firebase/config";

type DocumentData = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

interface FirestoreState {
    document: DocumentData | null;
    isPending: boolean;
    error: string | null;
    success: boolean | null;
}

type FirestoreAction =
    { type: 'IS_PENDING' } |
    { type: 'ADDED_DOCUMENT', payload: DocumentData } |
    { type: 'DELETED_DOCUMENT' } |
    { type: 'ERROR', payload: string };

export interface FirestoreDispatch {
    dispatch: React.Dispatch<FirestoreAction>
}

type State = {
    addDocument: (doc: DocumentData) => Promise<void>,
    deleteDocument: (id: string) => Promise<void>,
    response: FirestoreState
};

const firestoreState: FirestoreState = {
    document: null,
    isPending: false,
    error: null,
    success: null
};

const firestoreReducer = (state: FirestoreState, action: FirestoreAction): FirestoreState => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null };
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null };
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null };
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload };
        default:
            throw new Error('Firestore dispatcher action type not defined');
    }
};

export const useFirestore = (collection: string): State => {
    const [response, dispatch] = useReducer(firestoreReducer, firestoreState);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);

    const ref = fStore.collection(collection);

    const dispatchIfNotCancelled = (action: FirestoreAction): void => {
        if (isCancelled) return;
        dispatch(action);
    };

    const addDocument = async (doc: DocumentData): Promise<void> => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = fTimestamp.fromDate(new Date());
            const addedDocument = await ref.add({ ...doc, createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
            }
        }
    };

    const deleteDocument = async (id: string): Promise<void> => {
        dispatch({ type: 'IS_PENDING' })

        try {
            await ref.doc(id).delete()
            dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            }
        }
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { addDocument, deleteDocument, response };
};
