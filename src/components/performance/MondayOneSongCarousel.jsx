import { useEffect, useState } from "react";

import mondayOneSong from "@/assets/images/provided/performance/monday-one-song.svg";
import { getMondayOneSong } from "@/api/performanceApi";

import "./MondayOneSongCarousel.css";

const INDICATOR_COUNT = 6;

const DEFAULT_CONTENT_STATUS = "COMING_SOON";
const DEFAULT_CONTENT_OPEN_AT = "2026-09-27T00:00:00";

const MondayOneSongCarousel = () => {
    const [contentStatus, setContentStatus] = useState(
        DEFAULT_CONTENT_STATUS,
    );
    const [contentOpenAt, setContentOpenAt] = useState(
        DEFAULT_CONTENT_OPEN_AT,
    );

    useEffect(() => {
        const fetchMondayOneSong = async () => {
            try {
                const response = await getMondayOneSong();

                const content = response.data.data;

                setContentStatus(
                    content.contentStatus ??
                        DEFAULT_CONTENT_STATUS,
                );

                setContentOpenAt(
                    content.contentOpenAt ??
                        DEFAULT_CONTENT_OPEN_AT,
                );
            } catch {
                setContentStatus(
                    DEFAULT_CONTENT_STATUS,
                );

                setContentOpenAt(
                    DEFAULT_CONTENT_OPEN_AT,
                );
            }
        };

        fetchMondayOneSong();
    }, []);

    const formatOpenDate = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const date = new Date(dateTime);

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1,
        ).padStart(2, "0");
        const day = String(
            date.getDate(),
        ).padStart(2, "0");

        return `${year}.${month}.${day}`;
    };

    const isComingSoon =
        contentStatus === "COMING_SOON";

    return (
        <div className="monday-song-carousel">
            <div className="monday-song-preview">
                <img
                    className={`monday-song-image ${
                        isComingSoon
                            ? "monday-song-image-blurred"
                            : ""
                    }`}
                    src={mondayOneSong}
                    alt="Monday One Song 콘텐츠"
                />

                {isComingSoon && (
                    <div className="monday-song-overlay">
                        <p className="monday-song-coming-soon">
                            COMING SOON
                        </p>

                        <p className="monday-song-release">
                            {formatOpenDate(contentOpenAt)} 공개 예정
                        </p>
                    </div>
                )}
            </div>

            <div
                className="monday-song-indicator"
                aria-hidden="true"
            >
                {Array.from({
                    length: INDICATOR_COUNT,
                }).map((_, index) => (
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