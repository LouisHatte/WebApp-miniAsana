import { useEffect, useState } from "react";

import { fAuth } from "app/firebase/config";
import { useAuthContext } from "app/hooks/useAuthContext";
import { AuthDispatch } from "app/contexts/AuthContext";

type State = {
    logout: () => Promise<void>,
    isPending: boolean,
    error: string | null
};

export const useLogout = (): State => {
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelled, setIsCancelled] = useState<boolean>(false);
    const { dispatch }: AuthDispatch = useAuthContext();

    const logout = async () => {
        setIsPending(true);
        setError(null);

        try {
            await fAuth.signOut();
            dispatch({ type: 'LOGOUT' });
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

    return { logout, isPending, error };
};
