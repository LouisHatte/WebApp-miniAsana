import { useEffect, useState } from "react";

import { fAuth } from "app/firebase/config";
import { useAuthContext } from "app/hooks/useAuthContext";
import { AuthDispatch } from "app/contexts/AuthContext";

type State = {
    login: (email: string, password: string) => Promise<void>,
    isPending: boolean,
    error: string | null
};

export const useLogin = (): State => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);
    const { dispatch }: AuthDispatch = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsPending(true);
        setError(null);

        try {
            const res = await fAuth.signInWithEmailAndPassword(email, password);
            dispatch({ type: 'LOGIN', payload: res.user });
            if (isCancelled) return;
        } catch (err: unknown) {
            console.error(err);
            if (isCancelled) return;
            if (err instanceof Error) {
                setError(err.message);
            }
        }

        setIsPending(false);
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { login, isPending, error };
};
