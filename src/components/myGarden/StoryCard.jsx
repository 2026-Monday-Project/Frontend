import Status from './Status';
import viewsIcon from '@/assets/images/custom/views.svg';
import likesIcon from '@/assets/images/custom/likes.svg';
import './StoryCard.css';

const StoryCard = ({ thumbnail, status, title, date, views, likes, onClick }) => {
    return (
        <div className="story-card" onClick={onClick}>
            <img src={thumbnail} alt="" className="story-thumbnail" />
            <div className="story-content">
                <div className="status-title">
                    <Status type={status} />
                    <p className="story-title">{title}</p>
                </div>
                <p className="story-date">{date}</p>
            </div>
            <div className="story-metrics">
                <span className="metric">
                    <img src={viewsIcon} alt="조회수" className="views-icon" /> {views}
                </span>
                <span className="metric">
                    <img src={likesIcon} alt="공감수" className="likes-icon" /> {likes}
                </span>
            </div>
        </div>
    );
};

export default StoryCard;