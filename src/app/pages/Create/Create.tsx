import { useEffect, useState } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';
import { useNavigate } from 'react-router-dom';

import { fTimestamp } from 'app/firebase/config';
import useAuthContext from 'app/hooks/useAuthContext';
import useCollection from 'app/hooks/useCollection';
import useFirestore from 'app/hooks/useFirestore';
import { IUserAssigned } from 'app/interface/projects';

import './Create.scss';

type Category = {
    label: string,
    value: string
}

type AssignedUser = {
    label: string,
    value: IUserAssigned
};

// interface AssignedUserOptions extends IFirestoreDocumentData, IUserAssigned {};

// type User = {
//     label: string,
//     value: AssignedUserOptions
// };

const categories: Category[] = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' }
];

const Create = (): JSX.Element => {
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const [category, setCategory] = useState<SingleValue<Category>>(categories[0]);
    const [assignedUsers, setAssignedUsers] = useState<MultiValue<AssignedUser>>([]);

    const { documents } = useCollection('users');
    const [users, setUsers] = useState<AssignedUser[]>([]);

    const { addDocument, response } = useFirestore('projects');

    const { user } = useAuthContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (!documents) return;
        const options = documents.map(user => {
            const u = {
                id: user.id,
                displayName: user.displayName,
                photoURL: user.photoURL
            };
            return { value: u, label: user.displayName };
        });
        setUsers(options);
    }, [documents]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);

        if (!user) return;
        if (!category) return;

        if (assignedUsers.length < 1) {
            setFormError('Please assign the project to at least 1 user');
            return;
        }

        const createdBy = {
            displayName: user.displayName,
            photoURL: user.photoURL,
            id: user.uid
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
            category: category.value,
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

export default Create;
