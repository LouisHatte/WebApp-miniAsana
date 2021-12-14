import { Link } from 'react-router-dom';

import Avatar from 'app/components/Avatar/Avatar';
import { IFirestoreDocumentData } from 'app/interface/firestore';

import './ProjectList.scss';
import { IUserAssigned } from 'app/interface/projects';

type ProjectListProps = {
    projects: IFirestoreDocumentData[]
};

const ProjectList = ({ projects }: ProjectListProps): JSX.Element => {
    return (
        <div className="ProjectList">
            {projects.length === 0 && <p>No projects yet!</p>}
            {projects.map(project => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                    <h4>{project.name}</h4>
                    <p>Due by {project.dueDate.toDate().toDateString()}</p>
                    <div className="assigned-to">
                        <p><strong>Assigned to:</strong></p>
                        <ul>
                            {project.assignedUsersList.map((user: IUserAssigned) => (
                                <li key={user.photoURL}>
                                    <div>
                                        <Avatar src={user.photoURL} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ProjectList;
