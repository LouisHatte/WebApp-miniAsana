import { useEffect, useState } from 'react';

import { fAuth, fStore } from 'app/firebase/config';
import useAuthContext from 'app/hooks/useAuthContext';

type UseLoginStates = {
    login: (email: string, password: string) => Promise<void>,
    isPending: boolean,
    error: string | null
};

const useLogin = (): UseLoginStates => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelled, setIsCancelled] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email: string, password: string) => {
        setIsPending(true);
        setError(null);

        try {
            const res = await fAuth.signInWithEmailAndPassword(email, password);

            if (!res.user) {
                throw new Error('User does not exist');
            }
            const { uid } = res.user;
            await fStore.collection('users').doc(uid).update({ online: true });

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

export default useLogin;
