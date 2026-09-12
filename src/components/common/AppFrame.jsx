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

    const maxHeightRef = useRef(0);
    const lastWidthRef = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            const width =
                window.innerWidth;

            const height =
                window.innerHeight;

            if (
                width !==
                lastWidthRef.current
            ) {
                lastWidthRef.current =
                    width;

                maxHeightRef.current =
                    height;
            } else {
                maxHeightRef.current =
                    Math.max(
                        maxHeightRef.current,
                        height,
                    );
            }

            const widthScale =
                width / FRAME_WIDTH;

            const heightScale =
                maxHeightRef.current /
                FRAME_HEIGHT;

            const mobile =
                width <= FRAME_WIDTH;

            const isTouchDevice =
                navigator.maxTouchPoints >
                1;

            const tablet =
                !mobile &&
                isTouchDevice;

            setIsMobile(mobile);

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
                 * 태블릿에서는 화면 안에서
                 * 402x874 비율을 유지하면서
                 * 가능한 최대 크기로 확대
                 *
                 * 세로가 충분하면 위아래를
                 * 정확히 채우게 됨
                 */
                setScale(
                    Math.min(
                        widthScale,
                        heightScale,
                    ),
                );

                return;
            }

            /* =========================
                PC
               ========================= */

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

        return () => {
            window.removeEventListener(
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