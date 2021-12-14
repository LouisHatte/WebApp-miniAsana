import { useEffect, useState } from 'react';
import firebase from 'firebase/app';

import { fStore } from 'app/firebase/config';
import { IFirestoreDocumentData } from 'app/interface/firestore';

type UseCollectionStates = {
    documents: IFirestoreDocumentData[] | null,
    error: string | null
};

const useCollection = (collection: string): UseCollectionStates => {
    const [documents, setDocuments] = useState<IFirestoreDocumentData[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ref: firebase.firestore.Query<firebase.firestore.DocumentData> = fStore.collection(collection);

        const unsub = ref.onSnapshot(snapshot => {
            const results: IFirestoreDocumentData[] = [];
            snapshot.docs.forEach(doc => {
                doc.data()
                results.push({ ...doc.data(), id: doc.id });
            });

            setDocuments(results);
            setError(null);
        }, err => {
            console.log(err);
            setError('Could not fetch the data');
        });

        return () => unsub();
    }, []);

    return { documents, error };
};

export default useCollection;
