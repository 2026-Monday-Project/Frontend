import { useEffect, useState } from "react";

import "./AppFrame.css";

const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

const AppFrame = ({ children }) => {
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] =
        useState(false);

    useEffect(() => {
        const handleResize = () => {
            const widthScale =
                window.innerWidth / FRAME_WIDTH;

            const heightScale =
                window.innerHeight / FRAME_HEIGHT;

            const mobile =
                window.innerWidth <= FRAME_WIDTH;

            setIsMobile(mobile);

            if (mobile) {
                // 모바일에서는 가로폭 기준으로만 맞춤
                setScale(
                    Math.min(widthScale, 1),
                );

                return;
            }

            // 데스크톱에서는 기존처럼 화면 안에 전부 보이도록
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
            style={{
                width: `${FRAME_WIDTH * scale}px`,
                height: isMobile
                    ? "100dvh"
                    : `${FRAME_HEIGHT * scale}px`,
            }}
        >
            <div
                className={`app-frame ${
                    isMobile
                        ? "app-frame-mobile"
                        : ""
                }`}
                style={{
                    transform: `scale(${scale})`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default AppFrame;