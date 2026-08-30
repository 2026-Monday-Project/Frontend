import { useEffect } from "react";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";

import "./StoryPhotoViewer.css";

const StoryPhotoViewer = ({ images, currentIndex, onChange, onClose, title }) => {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="story-photo-viewer" role="dialog" aria-modal="true" aria-label="사진 자세히 보기">
            <header className="story-photo-viewer-header">
                <button
                    className="story-photo-viewer-back"
                    type="button"
                    onClick={onClose}
                    aria-label="사연 상세 화면으로 돌아가기"
                >
                    <img src={arrowBackIcon} alt="" aria-hidden="true" />
                </button>
                <span>{currentIndex + 1}/{images.length}</span>
            </header>

            <img
                className="story-photo-viewer-image"
                src={images[currentIndex]}
                alt={`${title} 확대 사진 ${currentIndex + 1}`}
            />

            <div className="story-photo-viewer-thumbnails" aria-label="다른 사진 선택">
                {images.map((image, index) => (
                    <button
                        key={image}
                        className={`story-photo-thumbnail-button${index === currentIndex ? " story-photo-thumbnail-button-active" : ""}`}
                        type="button"
                        onClick={() => onChange(index)}
                        aria-label={`${index + 1}번째 사진 보기`}
                        aria-current={index === currentIndex ? "true" : undefined}
                    >
                        <img src={image} alt="" aria-hidden="true" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StoryPhotoViewer;
