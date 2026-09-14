import { createRoot } from "react-dom/client";

import App from "@/App";

import homeBackground from "@/assets/images/custom/home-background.svg";
import homeDivider from "@/assets/images/custom/home-divider.svg";
import homeEnteredBackground from "@/assets/images/custom/home-entered-background.svg";

import "@/styles/global.css";

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const image = new Image();

        const handleComplete = () => {
            resolve();
        };

        image.onload = handleComplete;
        image.onerror = handleComplete;

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
        await document.fonts.load(
            "400 36px Warhaven",
            "MAGGIE'S GARDEN",
        );

        await document.fonts.load(
            "400 20px Warhaven",
            "pouring love and letters",
        );

        await document.fonts.load(
            "400 14px Warhaven",
            "위로 스와이프하여 정원으로 입장하세요.",
        );
    } catch {
        // 폰트 로딩 실패 시에도 앱은 실행한다.
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

const isHomePath = () => {
    return (
        window.location.pathname ===
        "/"
    );
};

const renderApp = async () => {
    if (isHomePath()) {
        await prepareHomeScreen();
    }

    const root =
        document.getElementById(
            "root",
        );

    createRoot(root).render(
        <App />,
    );
};

renderApp();