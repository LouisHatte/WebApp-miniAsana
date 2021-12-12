import { useContext } from "react";

import { AuthContext, AuthContextInterface } from "app/contexts/AuthContext";

export const useAuthContext = (): AuthContextInterface => {
    const context: AuthContextInterface | null = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used inside an AuthContextProvider');
    }

    return context;
};
