import { useNavigate } from 'react-router-dom';

import Avatar from 'app/components/Avatar/Avatar';
import useFirestore from 'app/hooks/useFirestore';
import useAuthContext from 'app/hooks/useAuthContext';
import { IFirestoreDocumentData } from 'app/interface/firestore';
import { IUserAssigned } from 'app/interface/projects';

type ProjectSummaryProps = {
    project: IFirestoreDocumentData
};

const ProjectSummary = ({ project }: ProjectSummaryProps): JSX.Element => {
    const { deleteDocument } = useFirestore('projects');
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleClick = () => {
        deleteDocument(project.id);
        navigate('/');
    };

    return (
        <div>
            <div className="ProjectSummary">
                <h2 className="page-title">{project.name}</h2>
                <p>By {project.createdBy.displayName}</p>
                <p className="due-date">
                    Project due by {project.dueDate.toDate().toDateString()}
                </p>
                <p className="details">
                    {project.details}
                </p>
                <h4>Project is assigned to:</h4>
                <div className="assigned-users">
                    {project.assignedUsersList.map((user: IUserAssigned) => (
                        <div key={user.id}>
                            <Avatar src={user.photoURL} />
                        </div>
                    ))}
                </div>
            </div>
            {user?.uid === project.createdBy.id && (
                <button className="btn" onClick={handleClick}>Mark as Complete</button>
            )}
        </div>
    );
};

export default ProjectSummary;
