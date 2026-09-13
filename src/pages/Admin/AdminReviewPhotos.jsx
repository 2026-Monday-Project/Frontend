import {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import arrowBackIcon from "@/assets/icons/arrow-back.svg";
import { getAdminStoryDetail } from "@/api/adminApi";

import "./AdminReviewPhotos.css";

const DRAG_THRESHOLD = 5;
const SWIPE_THRESHOLD = 40;

const AdminReviewPhotos = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();

    const thumbnailRef = useRef(null);
    const thumbnailItemRefs = useRef([]);

    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);
    const dragDistance = useRef(0);

    const mainTouchStartX = useRef(0);

    const [photoList, setPhotoList] = useState([]);
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [scrollProgress, setScrollProgress] =
        useState(0);

    const [isDragging, setIsDragging] =
        useState(false);

    useEffect(() => {
        const fetchStoryPhotos = async () => {
            try {
                const response =
                    await getAdminStoryDetail(storyId);

                setPhotoList(
                    response.data.data.imageUrls ?? [],
                );
            } catch {
                setPhotoList([]);
            }
        };

        fetchStoryPhotos();
    }, [storyId]);

    useEffect(() => {
        const selectedThumbnail =
            thumbnailItemRefs.current[
                currentIndex
            ];

        if (!selectedThumbnail) {
            return;
        }

        selectedThumbnail.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
        });
    }, [currentIndex]);

    const handleBack = () => {
        navigate(`/admin/reviews/${storyId}`);
    };

    const handleThumbnailClick = (index) => {
        if (
            Math.abs(dragDistance.current) >
            DRAG_THRESHOLD
        ) {
            return;
        }

        setCurrentIndex(index);
    };

    const handleThumbnailScroll = () => {
        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        const maxScrollLeft =
            element.scrollWidth -
            element.clientWidth;

        if (maxScrollLeft <= 0) {
            setScrollProgress(0);
            return;
        }

        setScrollProgress(
            element.scrollLeft / maxScrollLeft,
        );
    };

    const handleMouseDown = (event) => {
        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        setIsDragging(true);

        dragStartX.current = event.clientX;
        dragStartScrollLeft.current =
            element.scrollLeft;

        dragDistance.current = 0;
    };

    const handleMouseMove = (event) => {
        if (!isDragging) {
            return;
        }

        const element = thumbnailRef.current;

        if (!element) {
            return;
        }

        const distance =
            event.clientX -
            dragStartX.current;

        dragDistance.current = distance;

        element.scrollLeft =
            dragStartScrollLeft.current -
            distance;
    };

    const handleMouseUp = () => {
        setIsDragging(false);

        window.setTimeout(() => {
            dragDistance.current = 0;
        }, 0);
    };

    const handleMouseLeave = () => {
        if (!isDragging) {
            return;
        }

        setIsDragging(false);

        window.setTimeout(() => {
            dragDistance.current = 0;
        }, 0);
    };

    const handleMainTouchStart = (event) => {
        mainTouchStartX.current =
            event.touches[0].clientX;
    };

    const handleMainTouchEnd = (event) => {
        if (photoList.length <= 1) {
            return;
        }

        const touchEndX =
            event.changedTouches[0].clientX;

        const distance =
            touchEndX -
            mainTouchStartX.current;

        if (
            Math.abs(distance) <
            SWIPE_THRESHOLD
        ) {
            return;
        }

        if (distance < 0) {
            setCurrentIndex((prev) =>
                Math.min(
                    prev + 1,
                    photoList.length - 1,
                ),
            );

            return;
        }

        setCurrentIndex((prev) =>
            Math.max(prev - 1, 0),
        );
    };

    return (
        <main className="admin-review-photos">
            <header className="admin-review-photos-header">
                <button
                    type="button"
                    className="admin-review-photos-back"
                    onClick={handleBack}
                    aria-label="뒤로 가기"
                >
                    <img
                        src={arrowBackIcon}
                        alt=""
                    />
                </button>

                <span className="admin-review-photos-count">
                    {photoList.length > 0
                        ? `${currentIndex + 1}/${photoList.length}`
                        : "0/0"}
                </span>
            </header>

            <div
                className="admin-review-photos-main"
                onTouchStart={
                    handleMainTouchStart
                }
                onTouchEnd={
                    handleMainTouchEnd
                }
            >
                {photoList[currentIndex] ? (
                    <img
                        src={photoList[currentIndex]}
                        alt={`제출 사진 ${
                            currentIndex + 1
                        }`}
                        draggable="false"
                    />
                ) : (
                    <span>
                        제출 사진 없음
                    </span>
                )}
            </div>

            <div className="admin-review-photos-bottom">
                <div
                    ref={thumbnailRef}
                    className={`admin-review-photos-thumbnails ${
                        isDragging
                            ? "admin-review-photos-thumbnails-dragging"
                            : ""
                    }`}
                    onScroll={
                        handleThumbnailScroll
                    }
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={
                        handleMouseLeave
                    }
                >
                    {photoList.map(
                        (photo, index) => (
                            <button
                                key={photo}
                                ref={(element) => {
                                    thumbnailItemRefs.current[
                                        index
                                    ] = element;
                                }}
                                type="button"
                                className={`admin-review-photo-thumbnail ${
                                    currentIndex ===
                                    index
                                        ? "admin-review-photo-thumbnail-active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleThumbnailClick(
                                        index,
                                    )
                                }
                            >
                                <img
                                    src={photo}
                                    alt={`사진 ${
                                        index + 1
                                    }`}
                                    draggable="false"
                                />
                            </button>
                        ),
                    )}
                </div>

                {photoList.length > 3 && (
                    <div
                        className="admin-review-photos-scroll"
                        aria-hidden="true"
                    >
                        <div
                            className="admin-review-photos-scroll-thumb"
                            style={{
                                left: `${scrollProgress * 100}%`,
                                transform: `translateX(-${
                                    scrollProgress *
                                    74.5
                                }px)`,
                            }}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default AdminReviewPhotos;