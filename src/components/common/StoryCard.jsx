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
            <span aria-hidden="true">·</span>
            <span>{breed}</span>
            <span aria-hidden="true">·</span>
            <span>{age}살</span>
          </p>
        </div>

        <div className="story-card-meta-info">
          <span className="story-card-date">{date}</span>

          <div className="story-card-counts">
            <span className="story-card-count" aria-label={`조회수 ${viewCount}`}>
              <span className="story-card-view-icon" aria-hidden="true" />
              {viewCount}
            </span>

            <span className="story-card-count" aria-label={`좋아요 수 ${likeCount}`}>
              <span className="story-card-like-icon" aria-hidden="true">
                ♥
              </span>
              {likeCount}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <article className="story-card">
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
