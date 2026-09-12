import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import mondayOneSong from "@/assets/images/provided/performance/monday-one-song.svg";
import { getMondayOneSong } from "@/api/performanceApi";

import "./MondayOneSongCarousel.css";

const DEFAULT_CONTENT_OPEN_AT =
    "2026-09-27T00:00:00+09:00";

/*
 * 공개 후 캐러셀을 미리 테스트할 때만 true
 * 실제 배포 시 반드시 false
 */
const FORCE_RELEASE_PREVIEW = false;

const DRAG_THRESHOLD = 25;
const WHEEL_THRESHOLD = 25;

const mondayOneSongModules = import.meta.glob(
    "/src/assets/images/provided/performance/monday-one-song/*.{png,jpg,jpeg,webp,svg}",
    {
        eager: true,
        import: "default",
    },
);

const getOpenTime = (dateTime) => {
    if (!dateTime) {
        return new Date(
            DEFAULT_CONTENT_OPEN_AT,
        ).getTime();
    }

    const hasTimezone =
        /Z$|[+-]\d{2}:\d{2}$/.test(
            dateTime,
        );

    const normalizedDateTime =
        hasTimezone
            ? dateTime
            : `${dateTime}+09:00`;

    return new Date(
        normalizedDateTime,
    ).getTime();
};

const MondayOneSongCarousel = () => {
    const [contentOpenAt, setContentOpenAt] =
        useState(
            DEFAULT_CONTENT_OPEN_AT,
        );

    const [isReleased, setIsReleased] =
        useState(
            FORCE_RELEASE_PREVIEW,
        );

    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [dragDistance, setDragDistance] =
        useState(0);

    const [isDragging, setIsDragging] =
        useState(false);

    const dragStartXRef = useRef(0);
    const dragDistanceRef = useRef(0);

    const wheelLockedRef =
        useRef(false);

    const realImages = useMemo(() => {
        return Object.entries(
            mondayOneSongModules,
        )
            .sort(([pathA], [pathB]) =>
                pathA.localeCompare(
                    pathB,
                    undefined,
                    {
                        numeric: true,
                    },
                ),
            )
            .map(([, image]) => image);
    }, []);

    const carouselImages =
        realImages.length > 0
            ? realImages
            : [mondayOneSong];

    useEffect(() => {
        const fetchMondayOneSong = async () => {
            try {
                const response =
                    await getMondayOneSong();

                const content =
                    response.data.data;

                setContentOpenAt(
                    content.contentOpenAt ??
                        DEFAULT_CONTENT_OPEN_AT,
                );
            } catch {
                setContentOpenAt(
                    DEFAULT_CONTENT_OPEN_AT,
                );
            }
        };

        fetchMondayOneSong();
    }, []);

    useEffect(() => {
        if (FORCE_RELEASE_PREVIEW) {
            return undefined;
        }

        const openTime =
            getOpenTime(contentOpenAt);

        const remainingTime =
            openTime - Date.now();

        if (remainingTime <= 0) {
            const releaseTimer =
                window.setTimeout(() => {
                    setIsReleased(true);
                }, 0);

            return () => {
                window.clearTimeout(
                    releaseTimer,
                );
            };
        }

        const releaseTimer =
            window.setTimeout(() => {
                setIsReleased(true);
            }, remainingTime);

        return () => {
            window.clearTimeout(
                releaseTimer,
            );
        };
    }, [contentOpenAt]);

    const formatOpenDate = (dateTime) => {
        if (!dateTime) {
            return "";
        }

        const hasTimezone =
            /Z$|[+-]\d{2}:\d{2}$/.test(
                dateTime,
            );

        const normalizedDateTime =
            hasTimezone
                ? dateTime
                : `${dateTime}+09:00`;

        const date = new Date(
            normalizedDateTime,
        );

        const year =
            date.getFullYear();

        const month = String(
            date.getMonth() + 1,
        ).padStart(2, "0");

        const day = String(
            date.getDate(),
        ).padStart(2, "0");

        return `${year}.${month}.${day}`;
    };

    const handleNext = () => {
        setCurrentIndex((previousIndex) =>
            Math.min(
                previousIndex + 1,
                carouselImages.length - 1,
            ),
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((previousIndex) =>
            Math.max(
                previousIndex - 1,
                0,
            ),
        );
    };

    const resetDrag = () => {
        setDragDistance(0);

        dragDistanceRef.current = 0;

        setIsDragging(false);
    };

    const handlePointerDown = (event) => {
        if (!isReleased) {
            return;
        }

        setIsDragging(true);

        dragStartXRef.current =
            event.clientX;

        dragDistanceRef.current = 0;

        setDragDistance(0);

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );
    };

    const handlePointerMove = (event) => {
        if (!isDragging) {
            return;
        }

        const distance =
            event.clientX -
            dragStartXRef.current;

        /*
         * 첫 번째/마지막 사진에서
         * 바깥쪽으로 과하게 끌리는 것 방지
         */
        if (
            currentIndex === 0 &&
            distance > 0
        ) {
            const limitedDistance =
                distance * 0.25;

            dragDistanceRef.current =
                limitedDistance;

            setDragDistance(
                limitedDistance,
            );

            return;
        }

        if (
            currentIndex ===
                carouselImages.length - 1 &&
            distance < 0
        ) {
            const limitedDistance =
                distance * 0.25;

            dragDistanceRef.current =
                limitedDistance;

            setDragDistance(
                limitedDistance,
            );

            return;
        }

        dragDistanceRef.current =
            distance;

        setDragDistance(distance);
    };

    const handlePointerUp = (event) => {
        if (!isDragging) {
            return;
        }

        const distance =
            dragDistanceRef.current;

        if (
            distance <=
            -DRAG_THRESHOLD
        ) {
            handleNext();
        } else if (
            distance >=
            DRAG_THRESHOLD
        ) {
            handlePrevious();
        }

        resetDrag();

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }
    };

    const handleWheel = (event) => {
        if (!isReleased) {
            return;
        }

        if (
            wheelLockedRef.current
        ) {
            return;
        }

        if (
            Math.abs(event.deltaX) <
            Math.abs(event.deltaY)
        ) {
            return;
        }

        if (
            Math.abs(event.deltaX) <
            WHEEL_THRESHOLD
        ) {
            return;
        }

        wheelLockedRef.current = true;

        if (event.deltaX > 0) {
            handleNext();
        } else {
            handlePrevious();
        }

        window.setTimeout(() => {
            wheelLockedRef.current =
                false;
        }, 300);
    };

    const handleImageChange = (index) => {
        if (!isReleased) {
            return;
        }

        setCurrentIndex(index);

        resetDrag();
    };

    return (
        <div className="monday-song-carousel">
            <div className="monday-song-preview">
                {isReleased ? (
                    <div
                        className="monday-song-viewport"
                        onPointerDown={
                            handlePointerDown
                        }
                        onPointerMove={
                            handlePointerMove
                        }
                        onPointerUp={
                            handlePointerUp
                        }
                        onPointerCancel={
                            handlePointerUp
                        }
                        onWheel={
                            handleWheel
                        }
                    >
                        <div
                            className={`monday-song-track ${
                                isDragging
                                    ? "monday-song-track-dragging"
                                    : ""
                            }`}
                            style={{
                                transform: `translateX(calc(-${currentIndex * 100}% + ${dragDistance}px))`,
                            }}
                        >
                            {carouselImages.map(
                                (
                                    image,
                                    index,
                                ) => (
                                    <div
                                        className="monday-song-slide"
                                        key={`${image}-${index}`}
                                    >
                                        <img
                                            className="monday-song-image"
                                            src={
                                                image
                                            }
                                            alt={`Monday One Song ${
                                                index +
                                                1
                                            }`}
                                            draggable="false"
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <img
                            className="monday-song-image monday-song-image-blurred"
                            src={
                                mondayOneSong
                            }
                            alt="Monday One Song 콘텐츠"
                            draggable="false"
                        />

                        <div className="monday-song-overlay">
                            <p className="monday-song-coming-soon">
                                COMING SOON
                            </p>

                            <p className="monday-song-release">
                                {formatOpenDate(
                                    contentOpenAt,
                                )}{" "}
                                공개 예정
                            </p>
                        </div>
                    </>
                )}
            </div>

            <div
                className={`monday-song-indicator ${
                    !isReleased
                        ? "monday-song-indicator-disabled"
                        : ""
                }`}
            >
                {carouselImages.map(
                    (_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`monday-song-dot ${
                                currentIndex ===
                                index
                                    ? "monday-song-dot-active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleImageChange(
                                    index,
                                )
                            }
                            disabled={
                                !isReleased
                            }
                            aria-label={`${index + 1}번째 Monday One Song 이미지 보기`}
                        />
                    ),
                )}
            </div>
        </div>
    );
};

export default MondayOneSongCarousel;