import { useState } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import useAuthContext from 'app/hooks/useAuthContext';
import { fTimestamp } from "app/firebase/config";
import useFirestore from "app/hooks/useFirestore";
import Avatar from "app/components/Avatar/Avatar";
import IProject from "app/interface/projects";

type ProjectCommentsProps = {
    project: IProject
};

const ProjectComments = ({ project }: ProjectCommentsProps): JSX.Element => {
    const [newComment, setNewComment] = useState<string>('');
    const { user } = useAuthContext();
    const { updateDocument, response } = useFirestore('projects');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const commentToAdd = {
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            content: newComment,
            createdAt: fTimestamp.fromDate(new Date()),
            id: Math.random()
        };

        await updateDocument(project.id, {
            comments: [...project.comments, commentToAdd]
        });

        if (response.error) return;
        setNewComment('');
    }

    return (
        <div className="ProjectComments">
            <h4>Project Comments</h4>
            <ul>
                {project.comments.length > 0 && project.comments.map(comment => (
                    <li key={comment.id}>
                        <div className="comment-author">
                            <Avatar src={comment.photoURL} />
                            <p>{comment.displayName}</p>
                        </div>
                        <div className="comment-date">
                            <p>{formatDistanceToNow(comment.createdAt.toDate(), {  addSuffix: true })}</p>
                        </div>
                        <div className="comment-content">
                            <p>{comment.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
            <form className="add-comment" onSubmit={handleSubmit}>
                <label>
                    <span>Add new comment:</span>
                    <textarea
                        required
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                </label>
                <button className="btn">Add Comment</button>
            </form>
        </div>
    );
};

export default ProjectComments;
