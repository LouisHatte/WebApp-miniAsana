import firebase from 'firebase/app';

export interface IUserAssigned {
    id: string;
    displayName: string;
    photoURL: string;
}

type ICreatedBy = IUserAssigned

interface IComment {
    id: number;
    displayName: string;
    photoURL: string;
    content: string;
    createdAt: string;
}


interface IProject {
    id: string;
    name: string;
    dueDate: firebase.firestore.Timestamp;
    category: string;
    details: string;
    createdAt: string;
    createdBy: ICreatedBy;
    assignedUsersList: IUserAssigned[];
    comments: IComment[];
}

export default IProject;
