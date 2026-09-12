import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./AppFrame.css";

const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

const AppFrame = ({ children }) => {
    const [scale, setScale] = useState(1);

    const [isMobile, setIsMobile] =
        useState(false);

    const [isTablet, setIsTablet] =
        useState(false);

    /*
     * iPad에서 키보드가 올라오면
     * visualViewport.height가 작아진다.
     *
     * 이 값을 그대로 scale 계산에 사용하면
     * AppFrame 전체가 키보드 높이에 맞춰 축소되므로,
     * 키보드가 열리기 전 가장 큰 viewport 높이를 보관한다.
     */
    const maxViewportHeightRef =
        useRef(0);

    const lastViewportWidthRef =
        useRef(0);

    useEffect(() => {
        const handleResize = () => {
            const width =
                window.visualViewport
                    ?.width ??
                window.innerWidth;

            const currentHeight =
                window.visualViewport
                    ?.height ??
                window.innerHeight;

            const mobile =
                width <= FRAME_WIDTH;

            const isTouchDevice =
                navigator.maxTouchPoints >
                1;

            const tablet =
                !mobile &&
                isTouchDevice;

            setIsMobile(mobile);
            setIsTablet(tablet);

            /* =========================
                모바일
               ========================= */

            if (mobile) {
                setScale(1);

                return;
            }

            /* =========================
                iPad / 태블릿
               ========================= */

            if (tablet) {
                /*
                 * 화면 회전처럼 가로폭 자체가
                 * 크게 바뀐 경우에는 기준 높이를
                 * 새로 설정한다.
                 */
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
                    /*
                     * 키보드가 열렸을 때 height가
                     * 줄어드는 것은 무시한다.
                     *
                     * 키보드가 닫혀 더 큰 높이가
                     * 관측되면 그때만 갱신한다.
                     */
                    maxViewportHeightRef.current =
                        Math.max(
                            maxViewportHeightRef.current,
                            currentHeight,
                        );
                }

                const tabletScale =
                    maxViewportHeightRef.current /
                    FRAME_HEIGHT;

                setScale(tabletScale);

                return;
            }

            /* =========================
                PC
               ========================= */

            const widthScale =
                width /
                FRAME_WIDTH;

            const heightScale =
                currentHeight /
                FRAME_HEIGHT;

            setScale(
                Math.min(
                    widthScale,
                    heightScale,
                    1,
                ),
            );
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
                          width: `${FRAME_WIDTH * scale}px`,
                          height: `${FRAME_HEIGHT * scale}px`,
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
                            transform: `scale(${scale})`,
                          }
                }
            >
                {children}
            </div>
        </div>
    );
};

export default AppFrame;