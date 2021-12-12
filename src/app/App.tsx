import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useAuthContext } from './hooks/useAuthContext';

import './App.scss';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Signup } from './pages/Signup/Signup';
import { Create } from './pages/Create/Create';
import { Project } from './pages/Project/Project';
import { Login } from './pages/Login/Login';


const App = (): JSX.Element => {
    const { authIsReady, user } = useAuthContext();

    return (
        <>
            { authIsReady && (
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/login" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/signup" element={user ? <Signup /> : <Navigate to="/login" />} />
                        <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />} />
                        <Route path="/projects/:id" element={user ? <Project /> : <Navigate to="/login" />} />
                        <Route path="*" element={<Login />} />
                    </Routes>
                </BrowserRouter>
            )}
        </>
    );
};

export default App;
