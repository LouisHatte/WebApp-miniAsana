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

interface Document {
    id: string;
    documentData: firebase.firestore.DocumentData;
}

type State = {
    documents: Document[] | null,
    error: string | null
};

export const useCollection = (collection: string, _query: Query, _orderBy: OrderBy): State => {
    const [documents, setDocuments] = useState<Document[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const query: Query = useRef(_query).current;
    const orderBy: OrderBy = useRef(_orderBy).current;

    useEffect(() => {
        let ref: firebase.firestore.Query<firebase.firestore.DocumentData> = fStore.collection(collection);

        if (query) {
            ref = ref.where(query.fieldPath, query.opStr, query.value);
        }
        if (orderBy) {
            ref = ref.orderBy(orderBy.fieldPath, orderBy.directionStr);
        }

        const unsub = ref.onSnapshot(snapshot => {
            const results: Document[] = [];
            snapshot.docs.forEach(doc => {
                results.push({ id: doc.id, documentData: doc.data() });
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