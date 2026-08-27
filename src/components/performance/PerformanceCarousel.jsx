import { useState } from "react";

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

const PerformanceCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePosterChange = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="performance-carousel">
            <div className="performance-carousel-track">
                <img
                    className="performance-carousel-image"
                    src={posterList[currentIndex]}
                    alt={`공연 포스터 ${currentIndex + 1}`}
                />
            </div>

            <div
                className="performance-carousel-indicator"
                aria-label="공연 포스터 선택"
            >
                {posterList.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`performance-carousel-dot ${
                            currentIndex === index
                                ? "performance-carousel-dot-active"
                                : ""
                        }`}
                        onClick={() => handlePosterChange(index)}
                        aria-label={`${index + 1}번째 포스터 보기`}
                    />
                ))}
            </div>
        </section>
    );
};

export default PerformanceCarousel;