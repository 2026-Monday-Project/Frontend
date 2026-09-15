import {
    useRef,
    useState,
} from "react";

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

const carouselList = [
    posterList[posterList.length - 1],
    ...posterList,
    posterList[0],
];

const DRAG_THRESHOLD = 50;
const WHEEL_THRESHOLD = 35;

const PerformanceCarousel = () => {
    const [
        currentIndex,
        setCurrentIndex,
    ] = useState(1);

    const [
        dragDistance,
        setDragDistance,
    ] = useState(0);

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const [
        isTransitioning,
        setIsTransitioning,
    ] = useState(true);

    const dragStartX =
        useRef(0);

    const dragDistanceRef =
        useRef(0);

    const wheelLocked =
        useRef(false);

    const handleNext = () => {
        setIsTransitioning(true);

        setCurrentIndex(
            (prev) => prev + 1,
        );
    };

    const handlePrevious = () => {
        setIsTransitioning(true);

        setCurrentIndex(
            (prev) => prev - 1,
        );
    };

    const resetDrag = () => {
        setDragDistance(0);

        dragDistanceRef.current =
            0;

        setIsDragging(false);
    };

    const handlePointerDown = (
        event,
    ) => {
        setIsDragging(true);

        dragStartX.current =
            event.clientX;

        dragDistanceRef.current =
            0;

        setDragDistance(0);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (
        event,
    ) => {
        if (!isDragging) {
            return;
        }

        const distance =
            event.clientX -
            dragStartX.current;

        dragDistanceRef.current =
            distance;

        setDragDistance(
            distance,
        );
    };

    const handlePointerUp = (
        event,
    ) => {
        if (!isDragging) {
            return;
        }

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        const distance =
            dragDistanceRef.current;

        if (
            distance <=
            -DRAG_THRESHOLD
        ) {
            handleNext();
        } else if (
            distance >=
            DRAG_THRESHOLD
        ) {
            handlePrevious();
        }

        resetDrag();
    };

    const handleTransitionEnd =
        () => {
            /*
             * 마지막 실제 포스터 다음의
             * 복제된 첫 번째 포스터에 도착하면
             * 애니메이션 없이 진짜 첫 번째로 이동
             */
            if (
                currentIndex ===
                carouselList.length - 1
            ) {
                setIsTransitioning(
                    false,
                );

                setCurrentIndex(1);

                return;
            }

            /*
             * 첫 번째 실제 포스터 이전의
             * 복제된 마지막 포스터에 도착하면
             * 애니메이션 없이 진짜 마지막으로 이동
             */
            if (
                currentIndex === 0
            ) {
                setIsTransitioning(
                    false,
                );

                setCurrentIndex(
                    posterList.length,
                );
            }
        };

    const handleWheel = (
        event,
    ) => {
        if (
            wheelLocked.current
        ) {
            return;
        }

        if (
            Math.abs(
                event.deltaX,
            ) <
            Math.abs(
                event.deltaY,
            )
        ) {
            return;
        }

        if (
            Math.abs(
                event.deltaX,
            ) <
            WHEEL_THRESHOLD
        ) {
            return;
        }

        wheelLocked.current =
            true;

        if (event.deltaX > 0) {
            handleNext();
        } else {
            handlePrevious();
        }

        window.setTimeout(
            () => {
                wheelLocked.current =
                    false;
            },
            400,
        );
    };

    const handlePosterChange = (
        index,
    ) => {
        setIsTransitioning(true);

        setCurrentIndex(
            index + 1,
        );

        resetDrag();
    };

    const getIndicatorIndex =
        () => {
            if (
                currentIndex === 0
            ) {
                return (
                    posterList.length -
                    1
                );
            }

            if (
                currentIndex ===
                carouselList.length -
                    1
            ) {
                return 0;
            }

            return (
                currentIndex - 1
            );
        };

    const indicatorIndex =
        getIndicatorIndex();

    return (
        <section className="performance-carousel">
            <div
                className="performance-carousel-viewport"
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                onPointerCancel={
                    handlePointerUp
                }
                onWheel={
                    handleWheel
                }
            >
                <div
                    className={`performance-carousel-track ${
                        isDragging
                            ? "performance-carousel-track-dragging"
                            : ""
                    } ${
                        !isTransitioning
                            ? "performance-carousel-track-no-transition"
                            : ""
                    }`}
                    style={{
                        transform:
                            `translateX(calc(-${currentIndex * 100}% + ${dragDistance}px))`,
                    }}
                    onTransitionEnd={
                        handleTransitionEnd
                    }
                >
                    {carouselList.map(
                        (
                            poster,
                            index,
                        ) => (
                            <div
                                className="performance-carousel-slide"
                                key={`${poster}-${index}`}
                            >
                                <img
                                    className="performance-carousel-image"
                                    src={
                                        poster
                                    }
                                    alt=""
                                    draggable="false"
                                />
                            </div>
                        ),
                    )}
                </div>
            </div>

            <div className="performance-carousel-indicator">
                {posterList.map(
                    (_, index) => (
                        <button
                            key={
                                index
                            }
                            type="button"
                            className={`performance-carousel-dot ${
                                indicatorIndex ===
                                index
                                    ? "performance-carousel-dot-active"
                                    : ""
                            }`}
                            onClick={() =>
                                handlePosterChange(
                                    index,
                                )
                            }
                            aria-label={`${index + 1}번째 포스터 보기`}
                        />
                    ),
                )}
            </div>
        </section>
    );
};

export default PerformanceCarousel;