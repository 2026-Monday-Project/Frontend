import {
    useEffect,
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

    useEffect(() => {
        const handleResize = () => {
            const width =
                window.visualViewport
                    ?.width ??
                window.innerWidth;

            const height =
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
                 * 태블릿은 세로 화면을
                 * 무조건 꽉 채우도록
                 * 실제 보이는 viewport 높이를 기준으로 확대
                 */
                const tabletScale =
                    height /
                    FRAME_HEIGHT;

                setScale(
                    tabletScale,
                );

                return;
            }

            /* =========================
                PC
               ========================= */

            const widthScale =
                width /
                FRAME_WIDTH;

            const heightScale =
                height /
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

        window.visualViewport?.addEventListener(
            "scroll",
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

            window.visualViewport?.removeEventListener(
                "scroll",
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