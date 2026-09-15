import unreadDot from "@/assets/images/custom/unread-dot.svg";
import "./MailCard.css";

const MailCard = ({ title, content, date, isRead, onClick }) => {
    return (
        <button
            className={`mail-card ${isRead ? "read" : ""}`}
            onClick={onClick}
            type="button"
        >
            <div className="mail-text-wrapper">
                <p className="mail-title">{title}</p>
                <p className="mail-desc">{content}</p>
                <p className="mail-date">{date}</p>
            </div>
            {!isRead && (
                <img src={unreadDot} alt="안 읽음" className="unread-dot" />
            )}
        </button>
    );
};

export default MailCard;