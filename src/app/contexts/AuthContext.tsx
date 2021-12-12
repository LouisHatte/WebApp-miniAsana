import { createContext, useEffect, useReducer } from "react";
import firebase from 'firebase/app';

import { fAuth } from "app/firebase/config";

interface AuthState {
    user: firebase.User | null;
    authIsReady: boolean;
}

export type AuthAction =
    { type: 'LOGIN', payload: firebase.User | null } |
    { type: 'LOGOUT' } |
    { type: 'AUTH_IS_READY', payload: firebase.User | null };

export interface AuthDispatch {
    dispatch: React.Dispatch<AuthAction>;
}

export interface AuthContextInterface extends AuthState, AuthDispatch {}

type AuthContextProviderProps = {
    children: React.ReactNode
};

const authReducer = (state: AuthState, action: AuthAction) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'AUTH_IS_READY':
            return { user: action.payload, authIsReady: true };
        default:
            throw new Error('Auth dispatcher action type not defined');
    }
};

const authState: AuthState = {
    user: null,
    authIsReady: false,
};

export const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(authReducer, authState);

    useEffect(() => {
        const unsub = fAuth.onAuthStateChanged(user => {
            dispatch({ type: 'AUTH_IS_READY', payload: user });
            unsub();
        });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
