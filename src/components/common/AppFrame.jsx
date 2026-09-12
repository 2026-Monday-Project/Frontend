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
            const mobile =
                window.innerWidth <= FRAME_WIDTH;

            setIsMobile(mobile);

            if (mobile) {
                setScale(1);
                return;
            }

            const widthScale =
                window.innerWidth / FRAME_WIDTH;

            const heightScale =
                window.innerHeight / FRAME_HEIGHT;

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