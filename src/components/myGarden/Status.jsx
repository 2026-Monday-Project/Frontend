import './Status.css';

const Status = ({ type }) => {
    let statusClass = '';
    if (type === '검토중') statusClass = 'status-review';
    else if (type === '비공개') statusClass = 'status-private';
    else if (type === '공개') statusClass = 'status-public';

    return (
        <div className={`story-status-badge ${statusClass}`}>
            {type}
        </div>
    );
};

export default Status;