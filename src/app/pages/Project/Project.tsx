import { useParams } from 'react-router-dom';

import { useDocument } from 'app/hooks/useDocument';
import { ProjectSummary } from 'app/pages/Project/ProjectSummary';
import { ProjectComments } from 'app/pages/Project/ProjectComments';

import './Project.scss';
import IProject from 'app/interfaces/projects';

export const Project = (): JSX.Element => {
    const { id } = useParams();
    const { error, document } = useDocument<IProject>('projects', id);

    if (error) {
        return <div className="error">{error}</div>
    }

    if (!document) {
        return <div className="loading">Loading...</div>
    }

    return (
        <div className="Project">
            <ProjectSummary project={document} />
            <ProjectComments project={document} />
        </div>
    );
};
