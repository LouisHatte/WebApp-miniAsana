import './Avatar.scss';

// TODO: try to remove undefined
type AvatarProps = {
    src: string | null | undefined
};

const Avatar = ({ src }: AvatarProps): JSX.Element => {
    return (
        <div className="Avatar">
            {src && <img src={src} alt="avatar" />}
        </div>
    );
};

export default Avatar;
