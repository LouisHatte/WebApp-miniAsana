import { useEffect, useRef, useState } from "react";
import firebase from 'firebase/app';

import { fStore } from "app/firebase/config";

interface Query {
    fieldPath: string | firebase.firestore.FieldPath;
    opStr: firebase.firestore.WhereFilterOp;
    value: unknown;
}

interface OrderBy {
    fieldPath: string | firebase.firestore.FieldPath;
    directionStr?: firebase.firestore.OrderByDirection | undefined;
}

export interface Document extends firebase.firestore.DocumentData {
    id: string;
}

export const useCollection = <T>(collection: string, _query?: Query, _orderBy?: OrderBy): { documents: T[] | null, error: string | null} => {
    const [documents, setDocuments] = useState<T[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const query = useRef(_query).current;
    const orderBy = useRef(_orderBy).current;

    useEffect(() => {
        let ref: firebase.firestore.Query<firebase.firestore.DocumentData> = fStore.collection(collection);

        if (query) {
            ref = ref.where(query.fieldPath, query.opStr, query.value);
        }
        if (orderBy) {
            ref = ref.orderBy(orderBy.fieldPath, orderBy.directionStr);
        }

        const unsub = ref.onSnapshot(snapshot => {
            const results: any[] = [];
            snapshot.docs.forEach(doc => {
                doc.data()
                results.push({ ...doc.data(), id: doc.id }); // TODO
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
