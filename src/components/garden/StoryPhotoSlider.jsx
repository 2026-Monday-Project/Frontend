import { useRef } from "react";

import "./StoryPhotoSlider.css";

const SWIPE_THRESHOLD = 45;

const StoryPhotoSlider = ({ images, currentIndex, onChange, onOpen, title }) => {
    const touchStartXRef = useRef(null);

    const handleTouchStart = (event) => {
        touchStartXRef.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
        if (touchStartXRef.current === null) return;

        const distance = event.changedTouches[0].clientX - touchStartXRef.current;
        touchStartXRef.current = null;

        if (Math.abs(distance) < SWIPE_THRESHOLD) return;

        if (distance < 0) {
            onChange((currentIndex + 1) % images.length);
        } else {
            onChange((currentIndex - 1 + images.length) % images.length);
        }
    };

    return (
        <section className="story-photo-slider" aria-label="사연 사진">
            <button
                className="story-photo-main-button"
                type="button"
                onClick={onOpen}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-label={`${title} 사진 ${currentIndex + 1} 자세히 보기`}
            >
                <img
                    className="story-photo-main-image"
                    src={images[currentIndex]}
                    alt={`${title} 사진 ${currentIndex + 1}`}
                />
            </button>

            <div className="story-photo-dots" aria-label="사진 선택">
                {images.map((image, index) => (
                    <button
                        key={image}
                        className={`story-photo-dot ${index === currentIndex ? "story-photo-dot-active" : ""}`}
                        type="button"
                        onClick={() => onChange(index)}
                        aria-label={`${index + 1}번째 사진 보기`}
                        aria-current={index === currentIndex ? "true" : undefined}
                    />
                ))}
            </div>

            <span className="story-photo-counter">
                {currentIndex + 1}/{images.length}
            </span>
        </section>
    );
};

export default StoryPhotoSlider;
