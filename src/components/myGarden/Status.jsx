import './Status.css';

const Status = ({ type, subText }) => {
    let statusClass = '';
    if (type === '검토중') statusClass = 'status-review';
    else if (type === '비공개') statusClass = 'status-private';
    else if (type === '공개') statusClass = 'status-public';

    return (
        <div className={`story-status-badge ${statusClass}`}>
            {type} {subText && <span> {subText}</span>}
        </div>
    );
};

export default Status;