import { useEffect, useState } from 'react';

import { fAuth, fStore } from 'app/firebase/config';
import useAuthContext from 'app/hooks/useAuthContext';

type UseLogoutStates = {
    logout: () => Promise<void>,
    isPending: boolean,
    error: string | null
};

const useLogout = (): UseLogoutStates => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCancelled, setIsCancelled] = useState(false);
    const { dispatch, user } = useAuthContext();

    const logout = async () => {
        setIsPending(true);
        setError(null);

        try {
            if (!user) {
                throw new Error('User does not exist');
            }
            const { uid } = user;
            await fStore.collection('users').doc(uid).update({ online: false });

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

export default useLogout;
