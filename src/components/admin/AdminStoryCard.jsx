import { useNavigate } from "react-router-dom";

import caretRight from "@/assets/icons/caret-right.svg";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import "./AdminStoryCard.css";

const AdminStoryCard = ({ story }) => {
    const navigate = useNavigate();

    const handleReviewClick = () => {
        navigate(`/admin/reviews/${story.id}`);
    };

    return (
        <article className="admin-story-card">
            <div className="admin-story-card-top">
                <AdminStatusBadge status={story.status} />

                <span className="admin-story-card-date">
                    {story.submittedAt}
                </span>
            </div>

            <h3 className="admin-story-card-title">
                {story.title}
            </h3>

            <div className="admin-story-card-bottom">
                <span className="admin-story-card-attachment">
                    첨부 · 사진 {story.images.length || 3}장
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