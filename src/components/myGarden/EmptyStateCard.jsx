import requiresStory from '@/assets/images/custom/requires-story.svg';
import seperatePaw from '@/assets/images/custom/seperate-paw.svg';
import './EmptyStateCard.css';

const EmptyStateCard = ({ title, description, onClick }) => {
    return (
        <button
            className="mygarden-empty-state-card"
            onClick={onClick}
            type="button"
        >
            <img src={requiresStory} alt="" className="mygarden-empty-state-icon" />
            <p className="mygarden-empty-state-title">{title}</p>
            <img src={seperatePaw} alt="" className="mygarden-empty-state-divider" />
            <p className="mygarden-empty-state-desc">{description}</p>
        </button>
    );
};

export default EmptyStateCard;