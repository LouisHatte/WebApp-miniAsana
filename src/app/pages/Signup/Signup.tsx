import { useState } from 'react';

import { useSignup } from 'app/hooks/useSignup';

import './Signup.scss';

export const Signup = (): JSX.Element => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [displayName, setDisplayname] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailError, setThumbnailError] = useState<string | null>(null);
    const { signup, isPending, error } = useSignup();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setThumbnail(null);
        const selected = e.target.files?.[0];

        if (!selected) {
            setThumbnailError('Please select a file');
            return;
        }
        if (!selected.type.includes('image')) {
            setThumbnailError('Selected file must be an image');
            return;
        }
        if (selected.size > 100000) {
            setThumbnailError('Image file size must be less than 100kb');
            return;
        }

        setThumbnailError(null);
        setThumbnail(selected);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signup(email, password, displayName, thumbnail);
    }

    return (
        <form className="Signup" onSubmit={handleSubmit}>
            <h2>Sigh up</h2>
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
            <label>
                <span>display name:</span>
                <input
                    required
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayname(e.target.value)}
                />
            </label>
            <label>
                <span>profile thumbnail:</span>
                <input
                    required
                    type="file"
                    onChange={handleFileChange}
                />
                {thumbnailError && <div className="error">{thumbnailError}</div>}
            </label>
            {!isPending && <button className="btn">Sign up</button>}
            {isPending && <button className="btn" disabled>loading</button>}
            {error && <div className="error">{error}</div>}
        </form>
    );
}
