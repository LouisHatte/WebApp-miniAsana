import { useEffect, useState } from 'react';

import { fAuth, fStorage, fStore } from 'app/firebase/config';
import useAuthContext from 'app/hooks/useAuthContext';

type UseSignupStates = {
    isPending: boolean,
    error: string | null,
    signup(email: string, password: string, displayName: string, thumbnail: File | null): Promise<void>
};

const useSignup = (): UseSignupStates => {
    const [isPending, setIsPending] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { dispatch } = useAuthContext();

    const signup = async (email: string, password: string, displayName: string, thumbnail: File | null) => {
        setIsPending(true);
        setError(null);

        try {
            if (!thumbnail) {
                throw new Error('Please provide a thumbnail');
            }

            const res = await fAuth.createUserWithEmailAndPassword(email, password);

            if (!res.user) {
                throw new Error('Could not complete signup');
            }

            const uploadPath = `thumbnails/${res.user.uid}/${thumbnail.name}`;
            const img = await fStorage.ref(uploadPath).put(thumbnail);
            const imgUrl = await img.ref.getDownloadURL();

            await res.user.updateProfile({ displayName, photoURL: imgUrl });
            await res.user.updateProfile({ displayName });

            await fStore.collection('users').doc(res.user.uid).set({
                online: true,
                displayName,
                photoURL: imgUrl
            });

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

export default useSignup;
