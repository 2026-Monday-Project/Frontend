import { useRef, useState } from "react";

import HomeEntered from "@/components/home/HomeEntered";

import homeBackground from "@/assets/images/custom/home-background.svg";
import homeDivider from "@/assets/images/custom/home-divider.svg";
import homeEntryArch from "@/assets/images/custom/home-entry-arch.svg";
import homeEntryGuide from "@/assets/images/custom/home-entry-guide.svg";
import homeEntryTrailShort from "@/assets/images/custom/home-entry-trail-short.svg";
import homeEntryTrailLong from "@/assets/images/custom/home-entry-trail-long.svg";

import "./Home.css";

const FIGMA_MAX_DRAG_DISTANCE = 146;
const ENTRY_THRESHOLD = 0.35;

const getAppScale = () => {
    const appFrame =
        document.querySelector(".app-frame");

    if (!appFrame) {
        return 1;
    }

    const logicalWidth =
        appFrame.offsetWidth;

    const renderedWidth =
        appFrame.getBoundingClientRect().width;

    if (!logicalWidth) {
        return 1;
    }

    return renderedWidth / logicalWidth;
};

const Home = () => {
    const startYRef = useRef(0);
    const isDraggingRef = useRef(false);

    const [dragDistance, setDragDistance] =
        useState(0);

    const [isDragging, setIsDragging] =
        useState(false);

    const [isEntered, setIsEntered] =
        useState(false);

    const resetDrag = () => {
        isDraggingRef.current = false;

        setIsDragging(false);
        setDragDistance(0);
    };

    const getDesignDragDistance = (
        clientY,
    ) => {
        const movedDistance =
            startYRef.current -
            clientY;

        const appScale =
            getAppScale();

        return (
            movedDistance /
            appScale
        );
    };

    const handlePointerDown = (
        event,
    ) => {
        startYRef.current =
            event.clientY;

        isDraggingRef.current =
            true;

        setDragDistance(0);
        setIsDragging(true);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (
        event,
    ) => {
        if (
            !isDraggingRef.current
        ) {
            return;
        }

        const designDistance =
            getDesignDragDistance(
                event.clientY,
            );

        const limitedDistance =
            Math.min(
                Math.max(
                    designDistance,
                    0,
                ),
                FIGMA_MAX_DRAG_DISTANCE,
            );

        setDragDistance(
            limitedDistance,
        );
    };

    const handlePointerUp = (
        event,
    ) => {
        if (
            !isDraggingRef.current
        ) {
            return;
        }

        const designDistance =
            getDesignDragDistance(
                event.clientY,
            );

        const finalDragDistance =
            Math.min(
                Math.max(
                    designDistance,
                    0,
                ),
                FIGMA_MAX_DRAG_DISTANCE,
            );

        const progress =
            finalDragDistance /
            FIGMA_MAX_DRAG_DISTANCE;

        isDraggingRef.current =
            false;

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

        if (
            progress >=
            ENTRY_THRESHOLD
        ) {
            setIsEntered(true);

            return;
        }

        setDragDistance(0);
    };

    const handlePointerCancel = (
        event,
    ) => {
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

    const handleEntryKeyDown = (
        event,
    ) => {
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
            <div className="home-design">
                <img
                    className="home-background"
                    src={homeBackground}
                    alt=""
                />

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

                        <p>
                            살롱문보우
                        </p>
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
                    <p>
                        위로 스와이프하여
                    </p>

                    <p>
                        정원으로 입장하세요.
                    </p>
                </div>

                {isDragging &&
                    dragProgress >=
                        0.18 && (
                        <div
                            className="home-entry-trail-container"
                            aria-hidden="true"
                        >
                            <img
                                className="home-entry-base-guide"
                                src={
                                    homeEntryGuide
                                }
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
                        src={
                            homeEntryArch
                        }
                        alt=""
                        draggable="false"
                    />
                </button>
            </div>
        </main>
    );
};

export default Home;