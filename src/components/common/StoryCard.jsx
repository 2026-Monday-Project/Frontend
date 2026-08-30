import eyeIcon from "@/assets/icons/Eye.svg";
import heartIcon from "@/assets/icons/heart.svg";

import "./StoryCard.css";

const StoryCard = ({
  image,
  title,
  petName,
  breed,
  age,
  date,
  viewCount,
  likeCount,
  onClick,
}) => {
  const content = (
    <>
      <img
        className="story-card-image"
        src={image}
        alt={`${title || "사연"} 대표 이미지`}
      />

      <div className="story-card-content">
        <div className="story-card-main-info">
          <h2 className="story-card-title">{title}</h2>

          <p className="story-card-pet-info">
            <span>{petName}</span>
            <span className="story-card-pet-separator" aria-hidden="true" />
            <span>{breed}</span>
            <span className="story-card-pet-separator" aria-hidden="true" />
            <span>{age}살</span>
          </p>
        </div>

        <div className="story-card-meta-info">
          <span className="story-card-date">{date}</span>

          <div className="story-card-counts">
            <span className="story-card-count" aria-label={`조회수 ${viewCount}`}>
              <img className="story-card-view-icon" src={eyeIcon} alt="" aria-hidden="true" />
              {viewCount}
            </span>

            <span className="story-card-count" aria-label={`좋아요 수 ${likeCount}`}>
              <img className="story-card-like-icon" src={heartIcon} alt="" aria-hidden="true" />
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article className="story-card story-card-common">
      {content}

      {onClick && (
        <button
          type="button"
          className="story-card-button"
          onClick={onClick}
          aria-label={`사연 "${title}" 상세 보기`}
        />
      )}
    </article>
  );
};

export default StoryCard;
