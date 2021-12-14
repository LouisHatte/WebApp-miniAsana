import { useEffect, useState } from 'react';

import { fStore } from 'app/firebase/config';

type UseDocumentStates = {
    document: any | null,
    error: string | null
};

const useDocument = <Datatype>(collection: string, id?: string): UseDocumentStates => {
    const [document, setDocument] = useState<any | null>(null);
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
            console.log(error.message);
            setError('Failed to get document');
        });

        return () => unsub();
    }, [collection, id]);

    return { document, error };
};

export default useDocument;
