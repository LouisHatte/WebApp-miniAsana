import React from 'react';
import ReactDOM from 'react-dom';

import App from 'app/App';
import AuthContextProvider from 'app/context/AuthContext';

import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
