import { useEffect, useState } from "react";

import { fAuth } from "app/firebase/config";
import { useAuthContext } from "app/hooks/useAuthContext";
import { AuthDispatch } from "app/contexts/AuthContext";

interface UseSignup {
    isPending: boolean;
    error: string | null;
    signup(email: string, password: string, displayName: string): Promise<void>;
}

export const useSignup = (): UseSignup => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { dispatch }: AuthDispatch = useAuthContext();

    const signup = async (email: string, password: string, displayName: string): Promise<void> => {
        setIsPending(true);
        setError(null);

        try {
            const res = await fAuth.createUserWithEmailAndPassword(email, password);

            if (!res.user) {
                throw new Error('Could not complete signup');
            }

            await res.user.updateProfile({ displayName });

            dispatch({ type: 'LOGIN', payload: res.user });
        } catch (err: unknown) {
            console.log(err);
            if (isCancelled) return;
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        if (isCancelled) return;
        setIsPending(false);
    };

    useEffect(() => {
        return () => setIsCancelled(true);
    }, []);

    return { isPending, error, signup };
};
