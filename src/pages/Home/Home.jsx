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

const ENTRY_THRESHOLD = 0.35;

const Home = () => {
    const startYRef = useRef(0);
    const dragDistanceRef = useRef(0);
    const isDraggingRef = useRef(false);

    const [scale, setScale] = useState(1);
    const [designHeight, setDesignHeight] = useState(FIGMA_HEIGHT);
    const [dragDistance, setDragDistance] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isEntered, setIsEntered] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const availableWidth = Math.min(
                window.innerWidth,
                FIGMA_WIDTH,
            );

            const nextScale =
                availableWidth / FIGMA_WIDTH;

            /*
             * 다른 페이지처럼 가로 너비를 기준으로만 축소합니다.
             */
            setScale(nextScale);

            /*
             * 화면이 874px보다 길 경우에도
             * 홈 배경이 브라우저 맨 아래까지 이어지도록
             * 디자인 자체의 높이를 늘립니다.
             */
            const requiredDesignHeight =
                window.innerHeight / nextScale;

            setDesignHeight(
                Math.max(
                    FIGMA_HEIGHT,
                    requiredDesignHeight,
                ),
            );
        };

        handleResize();

        window.addEventListener(
            "resize",
            handleResize,
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize,
            );
        };
    }, []);

    const resetDrag = () => {
        isDraggingRef.current = false;
        dragDistanceRef.current = 0;

        setIsDragging(false);
        setDragDistance(0);
    };

    const handlePointerDown = (event) => {
        startYRef.current = event.clientY;
        dragDistanceRef.current = 0;
        isDraggingRef.current = true;

        setDragDistance(0);
        setIsDragging(true);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (event) => {
        if (!isDraggingRef.current) {
            return;
        }

        const movedDistance =
            startYRef.current - event.clientY;

        /*
         * 실제 브라우저에서 움직인 px을
         * 피그마 기준 px로 변환합니다.
         */
        const designDistance =
            movedDistance / scale;

        const limitedDistance = Math.min(
            Math.max(designDistance, 0),
            FIGMA_MAX_DRAG_DISTANCE,
        );

        dragDistanceRef.current =
            limitedDistance;

        setDragDistance(limitedDistance);
    };

    const handlePointerUp = (event) => {
        if (!isDraggingRef.current) {
            return;
        }

        /*
         * 마지막 pointerMove가 호출되지 않았더라도
         * pointerUp 위치를 기준으로 최종 거리를 다시 계산합니다.
         */
        const movedDistance =
            startYRef.current - event.clientY;

        const designDistance =
            movedDistance / scale;

        const finalDragDistance = Math.min(
            Math.max(designDistance, 0),
            FIGMA_MAX_DRAG_DISTANCE,
        );

        const progress =
            finalDragDistance /
            FIGMA_MAX_DRAG_DISTANCE;

        isDraggingRef.current = false;
        setIsDragging(false);

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        if (progress >= ENTRY_THRESHOLD) {
            setIsEntered(true);
            return;
        }

        dragDistanceRef.current = 0;
        setDragDistance(0);
    };

    const handlePointerCancel = (event) => {
        resetDrag();

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }
    };

    const handleEntryKeyDown = (event) => {
        if (
            event.key === "Enter" ||
            event.key === " "
        ) {
            event.preventDefault();
            setIsEntered(true);
        }
    };

    const dragProgress =
        dragDistance /
        FIGMA_MAX_DRAG_DISTANCE;

    if (isEntered) {
        return <HomeEntered />;
    }

    return (
        <main className="home-page">
            <div
                className="home-scale-container"
                style={{
                    width: `${FIGMA_WIDTH * scale}px`,
                    height: `${designHeight * scale}px`,
                }}
            >
                <div
                    className="home-design"
                    style={{
                        height: `${designHeight}px`,
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
                            <p>
                                2026.10.15(목) 20:00
                            </p>
                            <p>살롱문보우</p>
                        </div>
                    </section>

                    <div
                        className={`home-entry-guide-text ${
                            isDragging
                                ? "is-dragging"
                                : ""
                        }`}
                        style={{
                            transform: `translateX(-50%) translateY(-${dragDistance}px)`,
                        }}
                    >
                        <p>위로 스와이프하여</p>
                        <p>정원으로 입장하세요.</p>
                    </div>

                    {isDragging &&
                        dragProgress >= 0.18 && (
                            <div
                                className="home-entry-trail-container"
                                aria-hidden="true"
                            >
                                <img
                                    className="home-entry-base-guide"
                                    src={homeEntryGuide}
                                    alt=""
                                />

                                {dragProgress <
                                    0.55 && (
                                    <img
                                        className="home-entry-trail home-entry-trail-short"
                                        src={
                                            homeEntryTrailShort
                                        }
                                        alt=""
                                    />
                                )}

                                {dragProgress >=
                                    0.55 && (
                                    <img
                                        className="home-entry-trail home-entry-trail-long"
                                        src={
                                            homeEntryTrailLong
                                        }
                                        alt=""
                                    />
                                )}
                            </div>
                        )}

                    <button
                        type="button"
                        className={`home-entry-arch ${
                            isDragging
                                ? "is-dragging"
                                : ""
                        }`}
                        style={{
                            transform: `translateX(-50%) translateY(-${dragDistance}px)`,
                        }}
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
                            handlePointerCancel
                        }
                        onKeyDown={
                            handleEntryKeyDown
                        }
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