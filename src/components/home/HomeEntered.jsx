import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./HomeEntered.css";

const FIGMA_WIDTH = 402;
const FIGMA_HEIGHT = 874;

const HomeEntered = () => {
  const navigate = useNavigate();

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
    const availableWidth = Math.min(
        window.innerWidth,
        FIGMA_WIDTH,
    );

    const widthScale = availableWidth / FIGMA_WIDTH;
    const heightScale = window.innerHeight / FIGMA_HEIGHT;

    setScale(Math.min(widthScale, heightScale, 1));
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handlePerformanceClick = () => {
    navigate("/performance");
  };

  const handleGardenClick = () => {
    navigate("/garden");
  };

  return (
    <main className="home-entered-page">
      <div
        className="home-entered-scale-container"
        style={{
          width: `${FIGMA_WIDTH * scale}px`,
          height: `${FIGMA_HEIGHT * scale}px`,
        }}
      >
        <div
          className="home-entered"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <div className="home-entered-text">
            <p className="home-entered-text-title">
              <p>정원으로</p>
              <p>입장했어요</p>
            </p>

            <div className="home-entered-text-content">
              <p>매기스가든에서</p>
              <p>사랑과 편지를 만나보세요.</p>
            </div>
          </div>

          <div className="home-entered-buttons">
            <button
              type="button"
              className="home-entered-button home-entered-button-primary"
              onClick={handlePerformanceClick}
            >
              공연 정보 보기
            </button>

            <button
              type="button"
              className="home-entered-button home-entered-button-secondary"
              onClick={handleGardenClick}
            >
              정원 둘러보기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomeEntered;