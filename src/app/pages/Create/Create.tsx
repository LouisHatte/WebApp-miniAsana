import { useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import { useNavigate } from 'react-router-dom';

import { fTimestamp } from 'app/firebase/config';
import { useAuthContext } from 'app/hooks/useAuthContext';
import { Document, useCollection } from 'app/hooks/useCollection';
import { useFirestore } from 'app/hooks/useFirestore';

import './Create.scss';

type Option = {
    value: string,
    label: string
};

type User = {
    value: Document,
    label: string
};

const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
];

export const Create = (): JSX.Element => {
    const [name, setName] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [category, setCategory] = useState<SingleValue<Option>>(categories[0]);
    const [assignedUsers, setAssignedUsers] = useState<MultiValue<User>>([]);
    const [formError, setFormError] = useState<string | null>(null);

    const { documents } = useCollection('users');
    const [users, setUsers] = useState<User[]>([]);

    const { user } = useAuthContext();

    const { addDocument, response } = useFirestore('projects');

    const navigate = useNavigate();

    useEffect(() => {
        if (!documents) return;
        const options = documents.map(user => {
            return { value: user, label: user.displayName };
        });
        setUsers(options);
    }, [documents]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (assignedUsers.length < 1) {
            setFormError('Please assign the project to at least 1 user');
            return;
        }

        const createdBy = {
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            id: user?.uid
        };

        const assignedUsersList = assignedUsers.map(user => {
            return {
                displayName: user.value.displayName,
                photoURL: user.value.photoURL,
                id: user.value.id
            };
        });

        const project = {
            name,
            details,
            category: category?.value,
            dueDate: fTimestamp.fromDate(new Date(dueDate)),
            comments: [],
            createdBy,
            assignedUsersList
        };

        await addDocument(project);
        if (response.error) return;
        navigate('/');
    };

    return (
        <div className="Create">
            <h2 className="page-title">Create a new project</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Project name:</span>
                    <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <span>Project details:</span>
                    <textarea
                        required
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                    />
                </label>
                <label>
                    <span>Set due date:</span>
                    <input
                        required
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </label>
                <label>
                    <span>Project category:</span>
                    <Select
                        defaultValue={categories[0]}
                        options={categories}
                        onChange={(option) => setCategory(option)}
                    />
                </label>
                <label>
                    <span>Assign to:</span>
                    <Select
                        options={users}
                        onChange={(option) => setAssignedUsers(option)}
                        isMulti
                    />
                </label>
                <button className="btn">Add Project</button>
                {formError && <p className="error">{formError}</p>}
            </form>
        </div>
    );
};
