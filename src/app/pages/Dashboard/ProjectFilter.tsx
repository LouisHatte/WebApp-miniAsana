type ProjectFilterProps = {
    currentFilter: string,
    changeFilter: (newFilter: string) => void
};

const filterList = [
    'all',
    'mine',
    'development',
    'design',
    'marketing',
    'sales'
];

const ProjectFilter = ({ currentFilter, changeFilter }: ProjectFilterProps): JSX.Element => {
    const handleClick = (newFilter: string) => {
        changeFilter(newFilter);
    };

    return (
        <div className="ProjectFilter">
            <nav>
                <p>Filter by:</p>
                {filterList.map(f => (
                    <button
                        className={f === currentFilter ? 'active' : ''}
                        key={f}
                        onClick={() => handleClick(f)}
                    >
                        {f}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default ProjectFilter;
