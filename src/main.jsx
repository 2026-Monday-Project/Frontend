import { createRoot } from "react-dom/client";

import App from "@/App";

import homeBackground from "@/assets/images/custom/home-background.svg";
import homeDivider from "@/assets/images/custom/home-divider.svg";
import homeEnteredBackground from "@/assets/images/custom/home-entered-background.svg";

import "@/styles/global.css";

const isHomePath = () => {
    return (
        window.location.pathname ===
        "/"
    );
};

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const image = new Image();

        const handleComplete = async () => {
            try {
                await image.decode?.();
            } catch {
                // decode 실패 시에도 렌더링 진행
            }

            resolve();
        };

        image.onload =
            handleComplete;

        image.onerror = () => {
            resolve();
        };

        image.src = src;

        if (image.complete) {
            handleComplete();
        }
    });
};

const preloadHomeFont = async () => {
    if (!document.fonts) {
        return;
    }

    try {
        await Promise.all([
            document.fonts.load(
                "400 36px Warhaven",
                "MAGGIE'S GARDEN",
            ),

            document.fonts.load(
                "400 20px Warhaven",
                "pouring love and letters",
            ),

            document.fonts.load(
                "400 15px Warhaven",
                "2026.10.15 살롱문보우",
            ),

            document.fonts.load(
                "400 14px Warhaven",
                "위로 스와이프하여 정원으로 입장하세요.",
            ),
        ]);

        await document.fonts.ready;
    } catch {
        // 폰트 실패 시에도 앱은 실행
    }
};

const prepareHomeScreen = async () => {
    await Promise.all([
        preloadHomeFont(),

        preloadImage(
            homeBackground,
        ),

        preloadImage(
            homeDivider,
        ),

        preloadImage(
            homeEnteredBackground,
        ),
    ]);
};

const waitForLayout = () => {
    return new Promise((resolve) => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                resolve();
            });
        });
    });
};

const showHomeScreen = async () => {
    /*
     * React의 첫 렌더 및 effect가
     * 실제 DOM에 반영될 시간을 준다.
     */
    await waitForLayout();

    document.documentElement.classList.remove(
        "home-initial-loading",
    );
};

const renderApp = async () => {
    const homePath =
        isHomePath();

    if (homePath) {
        await prepareHomeScreen();
    }

    const rootElement =
        document.getElementById(
            "root",
        );

    createRoot(
        rootElement,
    ).render(
        <App />,
    );

    if (homePath) {
        await showHomeScreen();
    }
};

renderApp();