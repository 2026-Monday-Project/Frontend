import { useEffect, useRef, useState } from "react";

import "./AppFrame.css";

const FRAME_WIDTH = 402;
const FRAME_HEIGHT = 874;

const AppFrame = ({ children }) => {
    const [scale, setScale] = useState(1);
    const [isMobile, setIsMobile] =
        useState(false);

    // 카카오톡 인앱 브라우저 등 일부 브라우저는 키보드가 올라올 때
    // window.innerHeight 자체가 줄어들면서 resize 이벤트가 발생한다(크롬은 그대로 유지).
    // 이걸 그대로 반영하면 입력 중 화면 전체가 찌그러지므로, 폭은 그대로인데 높이만
    // 작아진 경우(=키보드일 가능성)는 무시하고 지금까지 관측된 가장 큰 높이를 기준으로 삼는다.
    const maxHeightRef = useRef(0);
    const lastWidthRef = useRef(0);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width !== lastWidthRef.current) {
                // 폭이 바뀌었다는 건 화면 회전 등 실제 화면 크기 변경 → 기준을 새로 잡는다.
                lastWidthRef.current = width;
                maxHeightRef.current = height;
            } else {
                maxHeightRef.current = Math.max(
                    maxHeightRef.current,
                    height,
                );
            }

            const widthScale = width / FRAME_WIDTH;

            const heightScale =
                maxHeightRef.current / FRAME_HEIGHT;

            const mobile = width <= FRAME_WIDTH;

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