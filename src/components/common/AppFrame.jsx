import { useEffect, useState } from "react";

import "./AppFrame.css";

const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

const AppFrame = ({ children }) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
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
            className="app-frame-viewport"
            style={{
                width: `${FRAME_WIDTH * scale}px`,
                height: `${FRAME_HEIGHT * scale}px`,
            }}
        >
            <div
                className="app-frame"
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