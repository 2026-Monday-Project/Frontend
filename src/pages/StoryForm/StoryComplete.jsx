import { useNavigate } from "react-router-dom";
import storyCompleteImg from "@/assets/icons/storycomplete photo.png";
import "@/pages/StoryForm/StoryComplete.css";

const StoryComplete = ({ mode }) => {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const handleGoMyGarden = () => {
    navigate("/my-garden");
  };

  const handleLookAround = () => {
    navigate("/garden");
  };

  return (
    <div className="story-complete-container">
      <main className="story-complete-main">
        <div className="story-complete-image-wrapper">
          <img
            src={storyCompleteImg}
            alt="정원 아치문에 도착한 편지"
            className="story-complete-image"
          />
        </div>

        <h1 className="story-complete-title">
          당신의 이야기가
          <br />
          {isEdit ? "수정 되었습니다." : "정원에 도착했어요."}
        </h1>

        <p className="story-complete-subtitle">
          운영팀 검수 후 공개여부와 상태를
          <br />내 정원에서 확인 할 수 있어요.
        </p>
      </main>

      <footer className="story-complete-footer">
        <button
          type="button"
          className="story-complete-primary-button"
          onClick={handleGoMyGarden}
        >
          내 정원으로 가기
        </button>

        <button
          type="button"
          className="story-complete-secondary-button"
          onClick={handleLookAround}
        >
          정원 둘러보기
        </button>
      </footer>
    </div>
  );
};

export default StoryComplete;
