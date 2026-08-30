import { useRef, useState } from "react";

import performance1 from "@/assets/images/provided/posters/performance1.svg";
import performance2 from "@/assets/images/provided/posters/performance2.svg";
import performance3 from "@/assets/images/provided/posters/performance3.svg";
import performance4 from "@/assets/images/provided/posters/performance4.svg";
import performance5 from "@/assets/images/provided/posters/performance5.svg";
import performance6 from "@/assets/images/provided/posters/performance6.svg";

import "./PerformanceCarousel.css";

const posterList = [
    performance1,
    performance2,
    performance3,
    performance4,
    performance5,
    performance6,
];

const DRAG_THRESHOLD = 50;
const WHEEL_THRESHOLD = 35;

const PerformanceCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragDistance, setDragDistance] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const dragStartX = useRef(0);
    const wheelLocked = useRef(false);

    const handleNext = () => {
        setCurrentIndex((prev) =>
            Math.min(prev + 1, posterList.length - 1),
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) =>
            Math.max(prev - 1, 0),
        );
    };

    const handlePointerDown = (event) => {
        setIsDragging(true);
        dragStartX.current = event.clientX;

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (event) => {
        if (!isDragging) {
            return;
        }

        const distance =
            event.clientX - dragStartX.current;

        setDragDistance(distance);
    };

    const handlePointerUp = () => {
        if (!isDragging) {
            return;
        }

        if (dragDistance <= -DRAG_THRESHOLD) {
            handleNext();
        }

        if (dragDistance >= DRAG_THRESHOLD) {
            handlePrevious();
        }

        setDragDistance(0);
        setIsDragging(false);
    };

    const handleWheel = (event) => {
        if (wheelLocked.current) {
            return;
        }

        if (
            Math.abs(event.deltaX) <
            Math.abs(event.deltaY)
        ) {
            return;
        }

        if (Math.abs(event.deltaX) < WHEEL_THRESHOLD) {
            return;
        }

        wheelLocked.current = true;

        if (event.deltaX > 0) {
            handleNext();
        } else {
            handlePrevious();
        }

        window.setTimeout(() => {
            wheelLocked.current = false;
        }, 400);
    };

    const handlePosterChange = (index) => {
        setCurrentIndex(index);
        setDragDistance(0);
    };

    return (
        <section className="performance-carousel">
            <div
                className="performance-carousel-viewport"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
            >
                <div
                    className={`performance-carousel-track ${
                        isDragging
                            ? "performance-carousel-track-dragging"
                            : ""
                    }`}
                    style={{
                        transform: `translateX(calc(-${currentIndex * 100}% + ${dragDistance}px))`,
                    }}
                >
                    {posterList.map((poster, index) => (
                        <div
                            className="performance-carousel-slide"
                            key={poster}
                        >
                            <img
                                className="performance-carousel-image"
                                src={poster}
                                alt={`공연 포스터 ${index + 1}`}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="performance-carousel-indicator">
                {posterList.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`performance-carousel-dot ${
                            currentIndex === index
                                ? "performance-carousel-dot-active"
                                : ""
                        }`}
                        onClick={() =>
                            handlePosterChange(index)
                        }
                        aria-label={`${index + 1}번째 포스터 보기`}
                    />
                ))}
            </div>
        </section>
    );
};

export default PerformanceCarousel;