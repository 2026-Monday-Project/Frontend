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
        document.querySelector(
            ".app-frame",
        );

    if (!appFrame) {
        return 1;
    }

    const logicalWidth =
        appFrame.offsetWidth;

    const renderedWidth =
        appFrame.getBoundingClientRect()
            .width;

    if (!logicalWidth) {
        return 1;
    }

    return (
        renderedWidth /
        logicalWidth
    );
};

const Home = () => {
    const pageRef =
        useRef(null);

    const startYRef =
        useRef(0);

    const startTimeRef =
        useRef(0);

    const dragDistanceRef =
        useRef(0);

    const isDraggingRef =
        useRef(false);

    const [
        pageHeight,
        setPageHeight,
    ] = useState(874);

    const [
        dragDistance,
        setDragDistance,
    ] = useState(0);

    const [
        swipeOpacity,
        setSwipeOpacity,
    ] = useState(1);

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const [
        isEntering,
        setIsEntering,
    ] = useState(false);

    const [
        isEntered,
        setIsEntered,
    ] = useState(false);

    useEffect(() => {
        const page =
            pageRef.current;

        if (!page) {
            return undefined;
        }

        const updatePageHeight =
            () => {
                const appScale =
                    getAppScale();

                const renderedHeight =
                    page.getBoundingClientRect()
                        .height;

                const nextHeight =
                    renderedHeight /
                    appScale;

                setPageHeight(
                    nextHeight,
                );
            };

        updatePageHeight();

        const resizeObserver =
            new ResizeObserver(
                updatePageHeight,
            );

        resizeObserver.observe(
            page,
        );

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

    const updateDragDistance = (
        distance,
    ) => {
        dragDistanceRef.current =
            distance;

        setDragDistance(
            distance,
        );
    };

    const handleEnter = () => {
        if (
            isEntering ||
            isEntered
        ) {
            return;
        }

        setIsEntering(true);
        setIsDragging(false);

        isDraggingRef.current =
            false;

        /*
         * 손을 놓는 순간 현재 위치에서
         * 자동으로 끝까지 올라간다.
         *
         * 올라가는 동안 Home은
         * 자연스럽게 투명해진다.
         */
        window.requestAnimationFrame(
            () => {
                window.requestAnimationFrame(
                    () => {
                        updateDragDistance(
                            pageHeight +
                                40,
                        );

                        setSwipeOpacity(
                            0,
                        );
                    },
                );
            },
        );

        window.setTimeout(
            () => {
                /*
                 * 중요:
                 * 여기서 dragDistance를
                 * 다시 0으로 만들면
                 * Home이 다시 내려온다.
                 *
                 * 입장 완료 후에는
                 * 위로 빠진 상태 그대로 유지한다.
                 */
                setIsEntered(true);
                setIsEntering(false);
                setIsDragging(false);

                isDraggingRef.current =
                    false;

                setSwipeOpacity(0);
            },
            ENTRY_ANIMATION_TIME,
        );
    };

    const handlePointerDown = (
        event,
    ) => {
        if (
            isEntering ||
            isEntered
        ) {
            return;
        }

        startYRef.current =
            event.clientY;

        startTimeRef.current =
            performance.now();

        dragDistanceRef.current =
            0;

        isDraggingRef.current =
            true;

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
            isEntering ||
            isEntered
        ) {
            return;
        }

        const appScale =
            getAppScale();

        const movedDistance =
            startYRef.current -
            event.clientY;

        const designDistance =
            movedDistance /
            appScale;

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
            isEntering ||
            isEntered
        ) {
            return;
        }

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

        const elapsedTime =
            Math.max(
                performance.now() -
                    startTimeRef.current,
                1,
            );

        const appScale =
            getAppScale();

        const movedDistance =
            Math.max(
                (
                    startYRef.current -
                    event.clientY
                ) /
                    appScale,
                0,
            );

        const velocity =
            movedDistance /
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
         * 충분히 올리지 않았을 때만
         * 원래 Home 위치로 돌아온다.
         */
        setSwipeOpacity(1);

        updateDragDistance(0);
    };

    const handlePointerCancel = (
        event,
    ) => {
        if (
            isEntering ||
            isEntered
        ) {
            return;
        }

        isDraggingRef.current =
            false;

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
            event.key !==
                "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        event.preventDefault();

        if (
            isEntering ||
            isEntered
        ) {
            return;
        }

        handleEnter();
    };

    return (
        <main
            ref={pageRef}
            className="home-page"
        >
            <div className="home-entered-under-layer">
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
                } ${
                    isEntered
                        ? "is-entered"
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
                tabIndex={
                    isEntered
                        ? -1
                        : 0
                }
                aria-label="위로 밀어서 정원 입장하기"
            >
                <div className="home-design">
                    <img
                        className="home-background"
                        src={
                            homeBackground
                        }
                        alt=""
                        draggable="false"
                        fetchPriority="high"
                    />

                    <section className="home-info">
                        <h1 className="home-title">
                            MAGGIE'S
                            <br />
                            GARDEN
                        </h1>

                        <img
                            className="home-divider"
                            src={
                                homeDivider
                            }
                            alt=""
                            aria-hidden="true"
                            draggable="false"
                        />

                        <p className="home-subtitle">
                            pouring love and letters
                        </p>

                        <img
                            className="home-divider"
                            src={
                                homeDivider
                            }
                            alt=""
                            aria-hidden="true"
                            draggable="false"
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