import { useEffect, useState } from 'react';

import { fStore } from 'app/firebase/config';
import { IFirestoreDocumentData } from 'app/interface/firestore';

type UseDocumentStates = {
    document: IFirestoreDocumentData | null,
    error: string | null
};

const useDocument = (collection: string, id?: string): UseDocumentStates => {
    const [document, setDocument] = useState<IFirestoreDocumentData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ref = fStore.collection(collection).doc(id);

        const unsub = ref.onSnapshot(snapshot => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id });
                setError(null);
            } else {
                setError('No such document exists');
            }
        }, error => {
            console.log(error);
            setError('Failed to get document');
        });

        return () => unsub();
    }, [collection, id]);

    return { document, error };
};

export default useDocument;
