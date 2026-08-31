import mondayOneSong from "@/assets/images/provided/performance/monday-one-song.svg";

import "./MondayOneSongCarousel.css";

const INDICATOR_COUNT = 6;

const MondayOneSongCarousel = () => {
    return (
        <div className="monday-song-carousel">
            <div className="monday-song-preview">
                <img
                    className="monday-song-image"
                    src={mondayOneSong}
                    alt="Monday One Song 공개 예정 콘텐츠"
                />

                <div className="monday-song-overlay">
                    <p className="monday-song-coming-soon">
                        COMING SOON
                    </p>

                    <p className="monday-song-release">
                        2026.09.27 공개 예정
                    </p>
                </div>
            </div>

            <div
                className="monday-song-indicator"
                aria-hidden="true"
            >
                {Array.from({ length: INDICATOR_COUNT }).map((_, index) => (
                    <span
                        key={index}
                        className={`monday-song-dot ${
                            index === 0
                                ? "monday-song-dot-active"
                                : ""
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MondayOneSongCarousel;