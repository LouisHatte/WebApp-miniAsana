import { useEffect, useReducer, useState } from 'react';
import firebase from 'firebase/app';

import { fStore, fTimestamp } from 'app/firebase/config';

type DocumentData = firebase.firestore.DocumentReference<firebase.firestore.DocumentData>;

type FirestoreReducerState = {
    document: DocumentData | null | void,
    isPending: boolean,
    error: string | null,
    success: boolean | null
};

type FirestoreReducerAction =
    { type: 'IS_PENDING' } |
    { type: 'ADDED_DOCUMENT', payload: DocumentData } |
    { type: 'DELETED_DOCUMENT' } |
    { type: 'UPDATED_DOCUMENT', payload: void } |
    { type: 'ERROR', payload: string };

type UseFirestoreStates = {
    addDocument: (doc: unknown) => Promise<void>,
    deleteDocument: (id: string) => Promise<void>,
    updateDocument: (id: string, updates: firebase.firestore.UpdateData) => Promise<void>,
    response: FirestoreReducerState
};

const firestoreReducer = (state: FirestoreReducerState, action: FirestoreReducerAction) => {
    switch (action.type) {
        case 'IS_PENDING':
            return { isPending: true, document: null, success: false, error: null };
        case 'ADDED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null };
        case 'DELETED_DOCUMENT':
            return { isPending: false, document: null, success: true, error: null };
        case 'UPDATED_DOCUMENT':
            return { isPending: false, document: action.payload, success: true, error: null };
        case 'ERROR':
            return { isPending: false, document: null, success: false, error: action.payload };
        default:
            return state
    }
};

const firestoreState = {
    document: null,
    isPending: false,
    error: null,
    success: null
};

const useFirestore = (collection: string): UseFirestoreStates => {
    const [response, dispatch] = useReducer(firestoreReducer, firestoreState);
    const [isCancelled, setIsCancelled] = useState(false);

    const ref = fStore.collection(collection);

    const dispatchIfNotCancelled = (action: FirestoreReducerAction) => {
        if (isCancelled) return;
        dispatch(action);
    };

    const addDocument = async (doc: unknown) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = fTimestamp.fromDate(new Date());
            const addedDocument = await ref.add({ ...(doc as Record<string, unknown>), createdAt });
            dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument });
        } catch (err) {
            console.log(err);
            if (err instanceof Error) {
                dispatchIfNotCancelled({ type: 'ERROR', payload: err.message });
            }
        }
    };

    const deleteDocument = async (id: string) => {
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

    const updateDocument = async (id: string, updates: firebase.firestore.UpdateData) => {
        dispatch({ type: 'IS_PENDING' });

        try {
            const updatedDocument = await ref.doc(id).update(updates);

            dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDocument });
        } catch (err: unknown) {
            if (err instanceof Error) {
                dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { addDocument, deleteDocument, updateDocument, response };
};

export default useFirestore;
