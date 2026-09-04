import { useNavigate } from "react-router-dom";

import caretRight from "@/assets/icons/caret-right.svg";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import "./AdminStoryCard.css";

const AdminStoryCard = ({ story }) => {
    const navigate = useNavigate();

    const handleReviewClick = () => {
        navigate(`/admin/reviews/${story.storyId}`);
    };

    const formatCreatedAt = (createdAt) => {
        if (!createdAt) {
            return "";
        }

        const date = new Date(createdAt);

        const month = String(
            date.getMonth() + 1,
        ).padStart(2, "0");

        const day = String(
            date.getDate(),
        ).padStart(2, "0");

        const hours = String(
            date.getHours(),
        ).padStart(2, "0");

        const minutes = String(
            date.getMinutes(),
        ).padStart(2, "0");

        return `${month}.${day} ${hours}:${minutes}`;
    };

    return (
        <article className="admin-story-card">
            <div className="admin-story-card-top">
                <AdminStatusBadge status={story.status} />

                <span className="admin-story-card-date">
                    {formatCreatedAt(story.createdAt)}
                </span>
            </div>

            <h3 className="admin-story-card-title">
                {story.title}
            </h3>

            <div className="admin-story-card-bottom">
                <span className="admin-story-card-attachment">
                    첨부 · 사진{" "}
                    {story.imageCount !== undefined
                        ? `${story.imageCount}장`
                        : "-장"}
                </span>

                <button
                    type="button"
                    className="admin-story-card-review"
                    onClick={handleReviewClick}
                >
                    검토하기

                    <img
                        src={caretRight}
                        alt=""
                    />
                </button>
            </div>
        </article>
    );
};

export default AdminStoryCard;