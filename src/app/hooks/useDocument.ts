import { useEffect, useState } from "react";

import { fStore } from 'app/firebase/config';

export const useDocument = <T>(collection: string, id?: string): { document: T | null, error: string | null } => {
    const [document, setDocument] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ref = fStore.collection(collection).doc(id);

        const unsub = ref.onSnapshot(snapshot => {
            if (snapshot.data()) {
                // setDocument({ ...snapshot.data(), id: snapshot.id }); TODO
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
