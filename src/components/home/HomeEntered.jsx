import {
    useEffect,
    useRef,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import homeEnteredBackground from "@/assets/images/custom/home-entered-background.svg";

import "./HomeEntered.css";

const FIGMA_WIDTH = 402;

const HomeEntered = () => {
    const navigate = useNavigate();

    const pageRef = useRef(null);

    const [scale, setScale] = useState(1);

    useEffect(() => {
        const page = pageRef.current;

        if (!page) {
            return undefined;
        }

        const updateScale = () => {
            const nextScale =
                page.clientWidth /
                FIGMA_WIDTH;

            setScale(nextScale);
        };

        updateScale();

        const resizeObserver =
            new ResizeObserver(
                updateScale,
            );

        resizeObserver.observe(page);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const handlePerformanceClick = () => {
        navigate("/performance");
    };

    const handleGardenClick = () => {
        navigate("/garden");
    };

    return (
        <main
            ref={pageRef}
            className="home-entered-page"
        >
            <div
                className="home-entered-design"
                style={{
                    transform: `scale(${scale})`,
                }}
            >
                <img
                    className="home-entered-background"
                    src={homeEnteredBackground}
                    alt=""
                />

                <div className="home-entered-text">
                    <div className="home-entered-text-title">
                        <p>정원으로</p>
                        <p>입장했어요</p>
                    </div>

                    <div className="home-entered-text-content">
                        <p>매기스가든에서</p>

                        <p>
                            사랑과 편지를 만나보세요.
                        </p>
                    </div>
                </div>

                <div className="home-entered-buttons">
                    <button
                        type="button"
                        className="home-entered-button home-entered-button-primary"
                        onClick={
                            handlePerformanceClick
                        }
                    >
                        공연 정보 보기
                    </button>

                    <button
                        type="button"
                        className="home-entered-button home-entered-button-secondary"
                        onClick={
                            handleGardenClick
                        }
                    >
                        정원 둘러보기
                    </button>
                </div>
            </div>
        </main>
    );
};

export default HomeEntered;