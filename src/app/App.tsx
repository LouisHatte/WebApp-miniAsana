import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from 'app/pages/Dashboard/Dashboard';
import Signup from 'app/pages/Signup/Signup';
import Create from 'app/pages/Create/Create';
import Project from 'app/pages/Project/Project';
import Login from 'app/pages/Login/Login';
import Navbar from 'app/components/Navbar/Navbar';
import Sidebar from 'app/components/Sidebar/Sidebar';
import useAuthContext from 'app/hooks/useAuthContext';
import OnlineUsers from 'app/components/OnlineUsers/OnlineUsers';

import './App.scss';

const App = (): JSX.Element => {
    const { user, authIsReady } = useAuthContext();

    return (
        <div className="App">
            {authIsReady && (
                <BrowserRouter>
                    {user && <Sidebar />}
                    <div className="container">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
                            <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />} />
                            <Route path="/projects/:id" element={user ? <Project /> : <Navigate to="/login" />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                    </div>
                    {user && <OnlineUsers />}
                </BrowserRouter>
            )}
        </div>
    );
};

export default App;
