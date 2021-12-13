import { Link } from 'react-router-dom';

import { useLogout } from 'app/hooks/useLogout';
import { useAuthContext } from 'app/hooks/useAuthContext';

import './Navbar.scss';
import Temple from 'app/assets/temple.svg';

export const Navbar = (): JSX.Element => {
    const { logout, isPending } = useLogout();
    const { user } = useAuthContext();

    return (
        <div className="Navbar">
            <ul>
                <li className="logo">
                    <img src={Temple} alt="temple" />
                    <span>The Dojo</span>
                </li>
                {!user && (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">Signup</Link></li>
                    </>
                )}
                {user && (
                    <li>
                        {!isPending && <button className="btn" onClick={logout}>Logout</button>}
                        {isPending && <button className="btn" disabled>loading...</button>}
                    </li>
                )}
            </ul>
        </div>
    );
};
