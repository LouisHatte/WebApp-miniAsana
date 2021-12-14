import { useCollection } from 'app/hooks/useCollection';
import ProjectList from 'app/components/ProjectList/ProjectList';
import ProjectFilter from 'app/pages/Dashboard/ProjectFilter';

import './Dashboard.scss';
import { useState } from 'react';
import { useAuthContext } from 'app/hooks/useAuthContext';
import IProject from 'app/interfaces/projects';

type AssignedUsersList = {
    displayName: string,
    id: string,
    photoURL: string
};

export const Dashboard = (): JSX.Element => {
    const { user } = useAuthContext();
    const { documents, error } = useCollection<IProject>('projects');
    const [currentFilter, setCurrentFilter] = useState<string>('all');

    const changeFilter = (newFilter: string) => {
        setCurrentFilter(newFilter);
    };

    const projects = documents ? documents.filter(document => {
        let assignedToMe = false;
        switch (currentFilter) {
            case 'all':
                return true;
            case 'mine':
                document.assignedUsersList.forEach((u: AssignedUsersList) => {
                    if (user?.uid === u.id) {
                        assignedToMe = true;
                    }
                });
                return assignedToMe;
            case 'development':
            case 'design':
            case 'sales':
            case 'marketing':
                return document.category === currentFilter;
            default:
                return true;
        }
    }) : null;

    return (
        <>
            <h2 className="page-title">Dashboard</h2>
            {error && <p className="error">{error}</p>}
            {documents && (
                <ProjectFilter
                    currentFilter={currentFilter}
                    changeFilter={changeFilter}
                />
            )}
            {projects && <ProjectList projects={projects}/>}
        </>
    );
}
