import unreadDot from "@/assets/images/custom/unread-dot.svg";
import "./MailCard.css";

const MailCard = ({ title, content, date, isRead, onClick }) => {
    return (
        <button
            className={`mail-card-wrapper ${isRead ? "read" : ""}`}
            onClick={onClick}
            type="button"
        >
            <div className="mail-card-text-area">
                <p className="mail-card-title">{title}</p>
                <p className="mail-card-desc">{content}</p>
                <p className="mail-card-date">{date}</p>
            </div>
            {!isRead && (
                <img src={unreadDot} alt="안 읽음" className="mail-card-unread-dot" />
            )}
        </button>
    );
};

export default MailCard;