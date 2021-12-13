import { useLogin } from 'app/hooks/useLogin';
import { useState } from 'react';

import './Login.scss';

export const Login = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { login, isPending, error } = useLogin();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(email, password);
    }

    return (
        <form className="Login" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label>
                <span>email:</span>
                <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <label>
                <span>password:</span>
                <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            {!isPending && <button className="btn">Login</button>}
            {isPending && <button className="btn" disabled>loading</button>}
            {error && <div className="error">{error}</div>}
        </form>
    );
}
