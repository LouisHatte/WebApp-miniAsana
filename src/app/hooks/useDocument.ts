import { useEffect, useState } from "react";

import { fStore } from 'app/firebase/config';
import { Document } from 'app/hooks/useCollection';

type State = {
    document: Document | null,
    error: string | null
};

export const useDocument = (collection: string, id?: string): State => {
    const [document, setDocument] = useState<Document | null>(null);
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
