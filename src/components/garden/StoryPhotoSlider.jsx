import { useRef } from "react";

import "./StoryPhotoSlider.css";

const SWIPE_THRESHOLD = 45;

const StoryPhotoSlider = ({ images, currentIndex, onChange, onOpen, title }) => {
    const pointerStartRef = useRef(null);
    const suppressClickRef = useRef(false);

    const handlePointerDown = (event) => {
        if (!event.isPrimary || event.button !== 0) return;

        pointerStartRef.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        };
        suppressClickRef.current = false;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const resetPointer = () => {
        pointerStartRef.current = null;
    };

    const handlePointerUp = (event) => {
        const pointerStart = pointerStartRef.current;
        if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;

        const distanceX = event.clientX - pointerStart.x;
        const distanceY = event.clientY - pointerStart.y;
        resetPointer();

        if (
            Math.abs(distanceX) < SWIPE_THRESHOLD
            || Math.abs(distanceX) <= Math.abs(distanceY)
        ) return;

        suppressClickRef.current = true;
        const nextIndex = distanceX < 0 ? currentIndex + 1 : currentIndex - 1;
        onChange(Math.min(Math.max(nextIndex, 0), images.length - 1));
    };

    const handleClick = (event) => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            event.preventDefault();
            return;
        }

        onOpen();
    };

    return (
        <section className="story-photo-slider" aria-label="사연 사진">
            <button
                className="story-photo-main-button"
                type="button"
                onClick={handleClick}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={resetPointer}
                aria-label={`${title} 사진 ${currentIndex + 1} 자세히 보기`}
            >
                <img
                    className="story-photo-main-image"
                    src={images[currentIndex]}
                    alt={`${title} 사진 ${currentIndex + 1}`}
                    draggable={false}
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
