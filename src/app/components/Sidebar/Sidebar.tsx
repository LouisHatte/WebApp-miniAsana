import { NavLink } from 'react-router-dom';

import { Avatar } from 'app/components/Avatar/Avatar';
import { useAuthContext } from 'app/hooks/useAuthContext';

import './Sidebar.scss';
import DashboardIcon from 'app/assets/dashboard_icon.svg';
import AddIcon from 'app/assets/add_icon.svg';

export const Sidebar = (): JSX.Element => {
    const { user } = useAuthContext();

    return (
        <div className="Sidebar">
            <div className="sidebar-content">
                <div className="user">
                    <Avatar src={user?.photoURL}/>
                    <p>Hey {user?.displayName}</p>
                </div>
                <nav className="links">
                    <ul>
                        <li>
                            <NavLink to="/">
                                <img src={DashboardIcon} alt="dashboardIcon" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/create">
                                <img src={AddIcon} alt="addIcon" />
                                <span>New Project</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};
