import { useContext } from 'react';

import { AuthContext, IAuthContext } from 'app/context/AuthContext';

const useAuthContext = (): IAuthContext => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used inside an AuthContextProvider');
    }

    return context;
};

export default useAuthContext;