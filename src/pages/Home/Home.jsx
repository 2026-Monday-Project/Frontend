import {
    useEffect,
    useRef,
    useState,
} from "react";

import HomeEntered from "@/components/home/HomeEntered";

import homeDivider from "@/assets/images/custom/home-divider.svg";
import homeBackground from "@/assets/images/custom/home-background.svg";

import "./Home.css";

const ENTRY_THRESHOLD = 0.2;
const ENTRY_VELOCITY = 0.55;
const ENTRY_ANIMATION_TIME = 460;

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
    const pageRef = useRef(null);

    const startYRef = useRef(0);
    const startTimeRef = useRef(0);

    const dragDistanceRef = useRef(0);
    const isDraggingRef = useRef(false);

    const [pageHeight, setPageHeight] =
        useState(874);

    const [dragDistance, setDragDistance] =
        useState(0);

    const [swipeOpacity, setSwipeOpacity] =
        useState(1);

    const [isDragging, setIsDragging] =
        useState(false);

    const [isEntering, setIsEntering] =
        useState(false);

    const [isEntered, setIsEntered] =
        useState(false);

    useEffect(() => {
        const page = pageRef.current;

        if (!page) {
            return undefined;
        }

        const updatePageHeight = () => {
            const appScale =
                getAppScale();

            const renderedHeight =
                page.getBoundingClientRect()
                    .height;

            const nextHeight =
                renderedHeight /
                appScale;

            setPageHeight(nextHeight);
        };

        updatePageHeight();

        const resizeObserver =
            new ResizeObserver(
                updatePageHeight,
            );

        resizeObserver.observe(page);

        window.addEventListener(
            "resize",
            updatePageHeight,
        );

        window.visualViewport?.addEventListener(
            "resize",
            updatePageHeight,
        );

        return () => {
            resizeObserver.disconnect();

            window.removeEventListener(
                "resize",
                updatePageHeight,
            );

            window.visualViewport?.removeEventListener(
                "resize",
                updatePageHeight,
            );
        };
    }, []);

    const getDesignDragDistance = (
        clientY,
    ) => {
        const movedDistance =
            startYRef.current -
            clientY;

        const appScale =
            getAppScale();

        return movedDistance /
            appScale;
    };

    const updateDragDistance = (
        distance,
    ) => {
        dragDistanceRef.current =
            distance;

        setDragDistance(distance);
    };

    const handleEnter = () => {
        /*
         * 손을 뗀 순간에는
         * 현재 위치 + opacity 1을 유지한다.
         */
        setIsEntering(true);
        setSwipeOpacity(1);

        /*
         * transition이 적용된 프레임을
         * 먼저 한 번 렌더한 뒤
         * 다음 프레임에서 이동 + fade 시작.
         */
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                updateDragDistance(
                    pageHeight + 40,
                );

                setSwipeOpacity(0);
            });
        });

        window.setTimeout(() => {
            setIsEntered(true);
        }, ENTRY_ANIMATION_TIME);
    };

    const handlePointerDown = (
        event,
    ) => {
        if (isEntering) {
            return;
        }

        startYRef.current =
            event.clientY;

        startTimeRef.current =
            performance.now();

        dragDistanceRef.current = 0;
        isDraggingRef.current = true;

        setIsDragging(true);
        setSwipeOpacity(1);

        updateDragDistance(0);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (
        event,
    ) => {
        if (
            !isDraggingRef.current ||
            isEntering
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
                pageHeight,
            );

        updateDragDistance(
            limitedDistance,
        );
    };

    const handlePointerUp = (
        event,
    ) => {
        if (
            !isDraggingRef.current ||
            isEntering
        ) {
            return;
        }

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

        const elapsedTime =
            Math.max(
                performance.now() -
                    startTimeRef.current,
                1,
            );

        const appScale =
            getAppScale();

        const movedDistance =
            startYRef.current -
            event.clientY;

        const designDistance =
            Math.max(
                movedDistance /
                    appScale,
                0,
            );

        const velocity =
            designDistance /
            elapsedTime;

        const progress =
            dragDistanceRef.current /
            Math.max(
                pageHeight,
                1,
            );

        const shouldEnter =
            progress >=
                ENTRY_THRESHOLD ||
            velocity >=
                ENTRY_VELOCITY;

        if (shouldEnter) {
            handleEnter();

            return;
        }

        /*
         * 입장 기준 미달이면
         * 투명해지지 않고 그대로 복귀.
         */
        setSwipeOpacity(1);
        updateDragDistance(0);
    };

    const handlePointerCancel = (
        event,
    ) => {
        isDraggingRef.current = false;

        setIsDragging(false);
        setSwipeOpacity(1);

        updateDragDistance(0);

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
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        event.preventDefault();

        if (isEntering) {
            return;
        }

        handleEnter();
    };

    if (isEntered) {
        return <HomeEntered />;
    }

    return (
        <main
            ref={pageRef}
            className="home-page"
        >
            <div className="home-entered-layer">
                <HomeEntered />
            </div>

            <div
                className={`home-swipe-layer ${
                    isDragging
                        ? "is-dragging"
                        : ""
                } ${
                    isEntering
                        ? "is-entering"
                        : ""
                }`}
                style={{
                    transform:
                        `translate3d(
                            0,
                            -${dragDistance}px,
                            0
                        )`,
                    opacity:
                        swipeOpacity,
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
                role="button"
                tabIndex={0}
                aria-label="위로 밀어서 정원 입장하기"
            >
                <div className="home-design">
                    <img
                        className="home-background"
                        src={homeBackground}
                        alt=""
                        draggable="false"
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

                    <div className="home-entry-guide">
                        <div className="home-entry-guide-text">
                            <p>
                                위로 스와이프하여
                            </p>

                            <p>
                                정원으로 입장하세요.
                            </p>
                        </div>

                        <div
                            className="home-entry-chevron"
                            aria-hidden="true"
                        >
                            <span className="home-entry-chevron-item home-entry-chevron-first" />

                            <span className="home-entry-chevron-item home-entry-chevron-second" />

                            <span className="home-entry-chevron-item home-entry-chevron-third" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;