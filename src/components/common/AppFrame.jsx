import {
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import "./AppFrame.css";

const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

const DESKTOP_MAX_SCALE = 1.1;

const getViewportSize = () => {
    return {
        width:
            window.visualViewport?.width ??
            window.innerWidth,

        height:
            window.visualViewport?.height ??
            window.innerHeight,
    };
};

const getDesktopScale = (
    width,
    height,
) => {
    const widthScale =
        width / FRAME_WIDTH;

    const heightScale =
        height / FRAME_HEIGHT;

    return Math.min(
        widthScale,
        heightScale,
        DESKTOP_MAX_SCALE,
    );
};

const getInitialFrameState = () => {
    const {
        width,
        height,
    } = getViewportSize();

    const isMobile =
        width <= FRAME_WIDTH;

    const isTouchDevice =
        navigator.maxTouchPoints > 1;

    const isTablet =
        !isMobile &&
        isTouchDevice;

    if (isMobile) {
        return {
            scale: 1,
            isMobile: true,
            isTablet: false,
            viewportWidth: width,
            viewportHeight: height,
        };
    }

    if (isTablet) {
        return {
            scale:
                height /
                FRAME_HEIGHT,

            isMobile: false,
            isTablet: true,

            viewportWidth: width,
            viewportHeight: height,
        };
    }

    return {
        scale:
            getDesktopScale(
                width,
                height,
            ),

        isMobile: false,
        isTablet: false,

        viewportWidth: width,
        viewportHeight: height,
    };
};

const AppFrame = ({
    children,
}) => {
    const [
        frameState,
        setFrameState,
    ] = useState(
        getInitialFrameState,
    );

    const {
        scale,
        isMobile,
        isTablet,
    } = frameState;

    const maxViewportHeightRef =
        useRef(
            frameState.viewportHeight,
        );

    const lastViewportWidthRef =
        useRef(
            frameState.viewportWidth,
        );

    useLayoutEffect(() => {
        const handleResize = () => {
            const {
                width,
                height: currentHeight,
            } = getViewportSize();

            const mobile =
                width <= FRAME_WIDTH;

            const isTouchDevice =
                navigator.maxTouchPoints >
                1;

            const tablet =
                !mobile &&
                isTouchDevice;

            if (mobile) {
                setFrameState({
                    scale: 1,

                    isMobile: true,
                    isTablet: false,

                    viewportWidth:
                        width,

                    viewportHeight:
                        currentHeight,
                });

                return;
            }

            if (tablet) {
                const widthChanged =
                    Math.abs(
                        width -
                            lastViewportWidthRef.current,
                    ) > 50;

                if (
                    lastViewportWidthRef.current ===
                        0 ||
                    widthChanged
                ) {
                    lastViewportWidthRef.current =
                        width;

                    maxViewportHeightRef.current =
                        currentHeight;
                } else {
                    maxViewportHeightRef.current =
                        Math.max(
                            maxViewportHeightRef.current,
                            currentHeight,
                        );
                }

                setFrameState({
                    scale:
                        maxViewportHeightRef.current /
                        FRAME_HEIGHT,

                    isMobile: false,
                    isTablet: true,

                    viewportWidth:
                        width,

                    viewportHeight:
                        currentHeight,
                });

                return;
            }

            setFrameState({
                scale:
                    getDesktopScale(
                        width,
                        currentHeight,
                    ),

                isMobile: false,
                isTablet: false,

                viewportWidth:
                    width,

                viewportHeight:
                    currentHeight,
            });
        };

        handleResize();

        window.addEventListener(
            "resize",
            handleResize,
        );

        window.visualViewport?.addEventListener(
            "resize",
            handleResize,
        );

        return () => {
            window.removeEventListener(
                "resize",
                handleResize,
            );

            window.visualViewport?.removeEventListener(
                "resize",
                handleResize,
            );
        };
    }, []);

    return (
        <div
            className={`app-frame-viewport ${
                isMobile
                    ? "app-frame-viewport-mobile"
                    : ""
            } ${
                isTablet
                    ? "app-frame-viewport-tablet"
                    : ""
            }`}
            style={
                isMobile
                    ? undefined
                    : {
                          width:
                              `${FRAME_WIDTH * scale}px`,
                          height:
                              `${FRAME_HEIGHT * scale}px`,
                      }
            }
        >
            <div
                className={`app-frame ${
                    isMobile
                        ? "app-frame-mobile"
                        : ""
                } ${
                    isTablet
                        ? "app-frame-tablet"
                        : ""
                }`}
                style={
                    isMobile
                        ? undefined
                        : {
                              transform:
                                  `scale(${scale})`,
                          }
                }
            >
                {children}
            </div>
        </div>
    );
};

export default AppFrame;