import { useCollection } from 'app/hooks/useCollection';
import Avatar from 'app/components/Avatar/Avatar';
import IUser from 'app/interfaces/users';

import './OnlineUsers.scss';

const OnlineUsers = (): JSX.Element => {
    const { error, documents } = useCollection<IUser>('users');

    return (
        <div className="OnlineUsers">
            <h2>All Users</h2>
            {error && <div className="error">{error}</div>}
            {documents && documents.map(user => (
                <div className="user-list-item" key={user.id}>
                    {user.online && <span className="online-user"></span>}
                    <span>{user.displayName}</span>
                    <Avatar src={user.photoURL} />
                </div>
            ))}
        </div>
    );
};

export default OnlineUsers;
