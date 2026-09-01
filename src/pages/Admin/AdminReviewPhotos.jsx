import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import { adminStoryList } from "@/data/adminMockData";

import "./AdminReviewPhotos.css";

const DRAG_THRESHOLD = 5;

const AdminReviewPhotos = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();

    const story = adminStoryList.find(
        (item) => item.id === Number(storyId),
    );

    const thumbnailRef = useRef(null);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);
    const dragDistance = useRef(0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    if (!story) {
        return null;
    }

    const photoList = story.images;

    const handleBack = () => {
        navigate(`/admin/reviews/${storyId}`);
    };

    const handleThumbnailClick = (index) => {
        // 마우스로 끌었던 직후 발생하는 클릭은 무시
        if (Math.abs(dragDistance.current) > DRAG_THRESHOLD) {
            return;
        }

        setCurrentIndex(index);
    };

    const handleThumbnailScroll = () => {
        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        const maxScrollLeft =
            element.scrollWidth - element.clientWidth;

        if (maxScrollLeft <= 0) {
            setScrollProgress(0);
            return;
        }

        setScrollProgress(
            element.scrollLeft / maxScrollLeft,
        );
    };

    const handleMouseDown = (event) => {
        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        setIsDragging(true);

        dragStartX.current = event.clientX;
        dragStartScrollLeft.current = element.scrollLeft;
        dragDistance.current = 0;
    };

    const handleMouseMove = (event) => {
        if (!isDragging) {
            return;
        }

        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        const distance =
            event.clientX - dragStartX.current;

        dragDistance.current = distance;

        element.scrollLeft =
            dragStartScrollLeft.current - distance;
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        // click 이벤트가 처리된 뒤 드래그 거리 초기화
        window.setTimeout(() => {
            dragDistance.current = 0;
        }, 0);
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            return;
        }

        setIsDragging(false);

        window.setTimeout(() => {
            dragDistance.current = 0;
        }, 0);
    };

    return (
        <main className="admin-review-photos">
            <header className="admin-review-photos-header">
                <button
                    type="button"
                    className="admin-review-photos-back"
                    onClick={handleBack}
                    aria-label="뒤로 가기"
                >
                    <img
                        src={arrowBackIcon}
                        alt=""
                    />
                </button>

                <span className="admin-review-photos-count">
                    {currentIndex + 1}/{photoList.length}
                </span>
            </header>

            <div className="admin-review-photos-main">
                {photoList[currentIndex] ? (
                    <img
                        src={photoList[currentIndex]}
                        alt={`제출 사진 ${currentIndex + 1}`}
                        draggable="false"
                    />
                ) : (
                    <span>
                        사진 {currentIndex + 1}
                    </span>
                )}
            </div>

            <div className="admin-review-photos-bottom">
                <div
                    ref={thumbnailRef}
                    className={`admin-review-photos-thumbnails ${
                        isDragging
                            ? "admin-review-photos-thumbnails-dragging"
                            : ""
                    }`}
                    onScroll={handleThumbnailScroll}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {photoList.map((photo, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`admin-review-photo-thumbnail ${
                                currentIndex === index
                                    ? "admin-review-photo-thumbnail-active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleThumbnailClick(index)
                            }
                        >
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={`사진 ${index + 1}`}
                                    draggable="false"
                                />
                            ) : (
                                <span>
                                    사진 {index + 1}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {photoList.length > 3 && (
                    <div
                        className="admin-review-photos-scroll"
                        aria-hidden="true"
                    >
                        <div
                            className="admin-review-photos-scroll-thumb"
                            style={{
                                left: `${scrollProgress * 100}%`,
                                transform: `translateX(-${
                                    scrollProgress * 74.5
                                }px)`,
                            }}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminReviewPhotos;