import { useEffect, useState } from "react";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";

import "./StoryPhotoViewer.css";

const StoryPhotoViewer = ({ images, currentIndex, onChange, onClose, title }) => {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

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

    const onDragStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.type.includes('mouse') ? e.clientX : e.targetTouches[0].clientX);
    };

    const onDragMove = (e) => {
        if (touchStart === null) return;
        setTouchEnd(e.type.includes('mouse') ? e.clientX : e.targetTouches[0].clientX);
    };

    const onDragEnd = () => {
        if (touchStart === null || touchEnd === null) return;
        
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance && currentIndex < images.length - 1) {
            onChange(currentIndex + 1);
        }
        
        if (distance < -minSwipeDistance && currentIndex > 0) {
            onChange(currentIndex - 1);
        }

        setTouchStart(null);
        setTouchEnd(null);
    };

    const onMouseLeave = () => {
        if (touchStart !== null && touchEnd !== null) {
            onDragEnd();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

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
                onTouchStart={onDragStart}
                onTouchMove={onDragMove}
                onTouchEnd={onDragEnd}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onMouseLeave}
                onDragStart={(e) => e.preventDefault()}
                style={{ cursor: 'grab' }}
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