import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import homeEnteredBackground from "@/assets/images/custom/home-entered-background.svg";

import "./HomeEntered.css";

const FIGMA_WIDTH = 402;

const RETURN_THRESHOLD = 0.2;
const RETURN_VELOCITY = 0.55;
const RETURN_ANIMATION_TIME = 460;

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

const HomeEntered = ({
    onReturnHome,
}) => {
    const navigate =
        useNavigate();

    const pageRef =
        useRef(null);

    const startXRef =
        useRef(0);

    const startTimeRef =
        useRef(0);

    const dragDistanceRef =
        useRef(0);

    const isDraggingRef =
        useRef(false);

    const [
        scale,
        setScale,
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
        isReturning,
        setIsReturning,
    ] = useState(false);

    useEffect(() => {
        const page =
            pageRef.current;

        if (!page) {
            return undefined;
        }

        const updateScale =
            () => {
                const nextScale =
                    page.clientWidth /
                    FIGMA_WIDTH;

                setScale(
                    nextScale,
                );
            };

        updateScale();

        const resizeObserver =
            new ResizeObserver(
                updateScale,
            );

        resizeObserver.observe(
            page,
        );

        return () => {
            resizeObserver.disconnect();
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

    const handleReturnHome =
        () => {
            if (
                !onReturnHome ||
                isReturning
            ) {
                return;
            }

            setIsReturning(true);

            window.requestAnimationFrame(
                () => {
                    window.requestAnimationFrame(
                        () => {
                            updateDragDistance(
                                FIGMA_WIDTH +
                                    40,
                            );
                        },
                    );
                },
            );

            window.setTimeout(
                () => {
                    onReturnHome();
                },
                RETURN_ANIMATION_TIME,
            );
        };

    const handlePointerDown = (
        event,
    ) => {
        if (
            !onReturnHome ||
            isReturning
        ) {
            return;
        }

        if (
            event.target.closest(
                "button, a",
            )
        ) {
            return;
        }

        startXRef.current =
            event.clientX;

        startTimeRef.current =
            performance.now();

        dragDistanceRef.current =
            0;

        isDraggingRef.current =
            true;

        setIsDragging(true);

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
            isReturning
        ) {
            return;
        }

        const appScale =
            getAppScale();

        const movedDistance =
            event.clientX -
            startXRef.current;

        const designDistance =
            movedDistance /
            appScale;

        const limitedDistance =
            Math.min(
                Math.max(
                    designDistance,
                    0,
                ),
                FIGMA_WIDTH,
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
            isReturning
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
                    event.clientX -
                    startXRef.current
                ) /
                    appScale,
                0,
            );

        const velocity =
            movedDistance /
            elapsedTime;

        const progress =
            dragDistanceRef.current /
            FIGMA_WIDTH;

        const shouldReturn =
            progress >=
                RETURN_THRESHOLD ||
            velocity >=
                RETURN_VELOCITY;

        if (shouldReturn) {
            handleReturnHome();

            return;
        }

        updateDragDistance(0);
    };

    const handlePointerCancel = (
        event,
    ) => {
        if (
            !isDraggingRef.current
        ) {
            return;
        }

        isDraggingRef.current =
            false;

        setIsDragging(false);

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

    const handlePerformanceClick =
        () => {
            navigate(
                "/performance",
            );
        };

    const handleGardenClick =
        () => {
            navigate(
                "/garden",
            );
        };

    return (
        <main
            ref={pageRef}
            className="home-entered-page"
        >
            <div
                className={`home-entered-swipe-layer ${
                    isDragging
                        ? "is-dragging"
                        : ""
                } ${
                    isReturning
                        ? "is-returning"
                        : ""
                }`}
                style={{
                    transform:
                        `translate3d(
                            ${dragDistance}px,
                            0,
                            0
                        )`,
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
            >
                <div
                    className="home-entered-design"
                    style={{
                        transform:
                            `scale(${scale})`,
                    }}
                >
                    <img
                        className="home-entered-background"
                        src={
                            homeEnteredBackground
                        }
                        alt=""
                        draggable="false"
                    />

                    <div className="home-entered-text">
                        <div className="home-entered-text-title">
                            <p>
                                정원으로
                            </p>

                            <p>
                                입장했어요
                            </p>
                        </div>

                        <div className="home-entered-text-content">
                            <p>
                                매기스가든에서
                            </p>

                            <p>
                                사랑과 편지를 만나보세요.
                            </p>
                        </div>
                    </div>

                    <div className="home-entered-buttons">
                        <button
                            type="button"
                            className="home-entered-button home-entered-button-primary"
                            onClick={
                                handlePerformanceClick
                            }
                        >
                            공연 정보 보기
                        </button>

                        <button
                            type="button"
                            className="home-entered-button home-entered-button-secondary"
                            onClick={
                                handleGardenClick
                            }
                        >
                            정원 둘러보기
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default HomeEntered;