import { useEffect, useRef, useState } from "react";

import HomeEntered from "@/components/home/HomeEntered";

import homeDivider from "@/assets/images/custom/home-divider.svg";
import homeEntryArch from "@/assets/images/custom/home-entry-arch.svg";
import homeEntryGuide from "@/assets/images/custom/home-entry-guide.svg";
import homeEntryTrailShort from "@/assets/images/custom/home-entry-trail-short.svg";
import homeEntryTrailLong from "@/assets/images/custom/home-entry-trail-long.svg";

import "./Home.css";

const FIGMA_WIDTH = 402;
const FIGMA_HEIGHT = 874;
const FIGMA_MAX_DRAG_DISTANCE = 146;

const Home = () => {
  const startYRef = useRef(0);

  const [scale, setScale] = useState(1);
  const [dragDistance, setDragDistance] = useState(0);
  const [maxDragDistance, setMaxDragDistance] = useState(
    FIGMA_MAX_DRAG_DISTANCE,
  );
  const [isDragging, setIsDragging] = useState(false);

  /* ⭐ 스와이프 완료 화면 전환용 */
  const [isEntered, setIsEntered] = useState(false);

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

  const handlePointerDown = (event) => {
    startYRef.current = event.clientY;

    setMaxDragDistance(FIGMA_MAX_DRAG_DISTANCE * scale);
    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isDragging) return;

    const movedDistance =
      startYRef.current - event.clientY;

    const limitedDistance = Math.min(
      Math.max(movedDistance, 0),
      maxDragDistance,
    );

    setDragDistance(limitedDistance);
  };

  const handlePointerUp = (event) => {
    if (!isDragging) return;

    const progress =
      maxDragDistance > 0
        ? Math.min(dragDistance / maxDragDistance, 1)
        : 0;

    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    /* ⭐ 여기서 HomeEntered로 화면 교체 */
    if (progress >= 0.95) {
      setIsEntered(true);
      return;
    }

    setDragDistance(0);
  };

  const handlePointerCancel = (event) => {
    setIsDragging(false);
    setDragDistance(0);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const dragProgress =
    maxDragDistance > 0
      ? Math.min(dragDistance / maxDragDistance, 1)
      : 0;

  /* ⭐ 성공했으면 홈 대신 입장 완료 컴포넌트 표시 */
  if (isEntered) {
    return <HomeEntered />;
  }

  return (
    <main className="home-page">
      <div
        className="home-scale-container"
        style={{
          width: `${FIGMA_WIDTH * scale}px`,
          height: `${FIGMA_HEIGHT * scale}px`,
        }}
      >
        <div
          className="home-design"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <section className="home-info">
            <h1 className="home-title">
              MAGGIE'S
              <br />
              GARDEN
            </h1>

            <img
              className="home-divider"
              src={homeDivider}
              alt=""
              aria-hidden="true"
            />

            <p className="home-subtitle">
              pouring love and letters
            </p>

            <img
              className="home-divider"
              src={homeDivider}
              alt=""
              aria-hidden="true"
            />

            <div className="home-performance-info">
              <p>2026.10.15(목) 20:00</p>
              <p>살롱문보우</p>
            </div>
          </section>

          <div
            className={`home-entry-guide-text ${
              isDragging ? "is-dragging" : ""
            }`}
            style={{
              transform: `translateX(-50%) translateY(-${
                dragDistance / scale
              }px)`,
            }}
          >
            <p>위로 스와이프하여</p>
            <p>정원으로 입장하세요.</p>
          </div>

          {isDragging && dragProgress >= 0.18 && (
            <div
              className="home-entry-trail-container"
              aria-hidden="true"
            >
              <img
                className="home-entry-base-guide"
                src={homeEntryGuide}
                alt=""
              />

              {dragProgress < 0.55 && (
                <img
                  className="home-entry-trail home-entry-trail-short"
                  src={homeEntryTrailShort}
                  alt=""
                />
              )}

              {dragProgress >= 0.55 && (
                <img
                  className="home-entry-trail home-entry-trail-long"
                  src={homeEntryTrailLong}
                  alt=""
                />
              )}
            </div>
          )}

          <button
            type="button"
            className={`home-entry-arch ${
              isDragging ? "is-dragging" : ""
            }`}
            style={{
              transform: `translateX(-50%) translateY(-${
                dragDistance / scale
              }px)`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            aria-label="위로 밀어서 정원 입장하기"
          >
            <img
              src={homeEntryArch}
              alt=""
              draggable="false"
            />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;