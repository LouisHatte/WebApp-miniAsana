import { createContext, useEffect, useReducer } from "react";
import firebase from 'firebase/app';

import { fAuth } from "app/firebase/config";

type AuthReducerState = {
    user: firebase.User | null,
    authIsReady: boolean
};

type AuthReducerAction =
    { type: 'LOGIN', payload: firebase.User | null } |
    { type: 'LOGOUT' } |
    { type: 'AUTH_IS_READY', payload: firebase.User | null };

export interface IAuthContext extends AuthReducerState {
    dispatch: React.Dispatch<AuthReducerAction>;
}

type AuthContextProviderProps = {
    children: React.ReactNode
};

const authReducer = (state: AuthReducerState, action: AuthReducerAction) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'AUTH_IS_READY':
            return { user: action.payload, authIsReady: true };
        default:
            return state
    }
};

const authState = {
    user: null,
    authIsReady: false,
};

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthContextProvider = ({ children }: AuthContextProviderProps): JSX.Element => {
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

export default AuthContextProvider;
