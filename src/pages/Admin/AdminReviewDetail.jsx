import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

import caretRight from "@/assets/icons/caret-right.svg";
import checkboxUnchecked from "@/assets/icons/checkbox-unchecked.svg";
import checkboxChecked from "@/assets/icons/checkbox-checked.svg";

import {
    getAdminStoryDetail,
    updateAdminStoryReview,
} from "@/api/adminApi";

import "./AdminReviewDetail.css";

const reviewItemList = [
    {
        key: "policy",
        title: "운영정책 위반 요소 없음",
        description: "욕설·혐오·광고성 내용 확인",
    },
    {
        key: "privacy",
        title: "개인정보·연락처 노출 없음",
        description: "본문과 첨부 이미지 모두 확인",
    },
    {
        key: "image",
        title: "이미지 공개 가능 여부 확인",
        description: "초상권·민감정보 노출 확인",
    },
];

const AdminReviewDetail = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();

    const photoListRef = useRef(null);
    const dragStartX = useRef(0);
    const dragStartScrollLeft = useRef(0);

    const [story, setStory] = useState(null);

    const [isPhotoDragging, setIsPhotoDragging] =
        useState(false);

    const [photoScrollProgress, setPhotoScrollProgress] =
        useState(0);

    const [reviewChecks, setReviewChecks] = useState({
        policy: false,
        privacy: false,
        image: false,
    });

    const [selectedVisibility, setSelectedVisibility] =
        useState(null);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    useEffect(() => {
        const fetchStoryDetail = async () => {
            try {
                const response =
                    await getAdminStoryDetail(storyId);

                setStory(response.data.data);
            } catch {
                setStory(null);
            }
        };

        fetchStoryDetail();
    }, [storyId]);

    const handleBack = () => {
        navigate("/admin/reviews");
    };

    const handleCheckClick = (key) => {
        setReviewChecks((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handlePhotosClick = () => {
        navigate(
            `/admin/reviews/${story.storyId}/photos`,
        );
    };

    const handleVisibilityClick = (visibility) => {
        setSelectedVisibility(visibility);
    };

    const handlePhotoScroll = () => {
        const element = photoListRef.current;

        if (!element) {
            return;
        }

        const maxScrollLeft =
            element.scrollWidth - element.clientWidth;

        if (maxScrollLeft <= 0) {
            setPhotoScrollProgress(0);
            return;
        }

        setPhotoScrollProgress(
            element.scrollLeft / maxScrollLeft,
        );
    };

    const handlePhotoPointerDown = (event) => {
        const element = photoListRef.current;

        if (!element) {
            return;
        }

        setIsPhotoDragging(true);

        dragStartX.current = event.clientX;
        dragStartScrollLeft.current =
            element.scrollLeft;

        element.setPointerCapture(event.pointerId);
    };

    const handlePhotoPointerMove = (event) => {
        if (!isPhotoDragging) {
            return;
        }

        const element = photoListRef.current;

        if (!element) {
            return;
        }

        const dragDistance =
            event.clientX - dragStartX.current;

        element.scrollLeft =
            dragStartScrollLeft.current -
            dragDistance;
    };

    const handlePhotoPointerUp = (event) => {
        const element = photoListRef.current;

        if (
            element &&
            element.hasPointerCapture(event.pointerId)
        ) {
            element.releasePointerCapture(
                event.pointerId,
            );
        }

        setIsPhotoDragging(false);
    };

    const allChecked =
        Object.values(reviewChecks).every(Boolean);

    const isConfirmEnabled =
        allChecked &&
        selectedVisibility !== null &&
        !isSubmitting;

    const handleConfirm = async () => {
        if (!isConfirmEnabled || !story) {
            return;
        }

        try {
            setIsSubmitting(true);

            await updateAdminStoryReview(
                story.storyId,
                selectedVisibility,
            );

            navigate(
                `/admin/notifications/${story.storyId}`,
                {
                    state: {
                        previousStatus: story.status,
                        nextStatus:
                            selectedVisibility,
                    },
                },
            );
        } catch {
            setIsSubmitting(false);
        }
    };

    if (!story) {
        return null;
    }

    const photoList = story.imageUrls ?? [];

    return (
        <main className="admin-review-detail-page">
            <AdminHeader
                title="사연 검토"
                onBack={handleBack}
            />

            <div className="admin-review-detail-content">
                <AdminStatusBadge
                    status={story.status}
                />

                <h2 className="admin-review-detail-title">
                    {story.title}
                </h2>

                <p className="admin-review-detail-author">
                    {story.nickname} · {story.email}
                </p>

                <section className="admin-review-submission">
                    <h3>제출 내용</h3>

                    <p className="admin-review-pet">
                        {story.petName} · {story.petAge} ·{" "}
                        {story.petType}
                    </p>

                    <p className="admin-review-story-content">
                        {story.content}
                    </p>
                </section>

                <section className="admin-review-photo-section">
                    <div className="admin-review-photo-heading">
                        <h3>제출 사진</h3>

                        {photoList.length > 0 && (
                            <button
                                type="button"
                                onClick={
                                    handlePhotosClick
                                }
                            >
                                사진 자세히 보기

                                <img
                                    src={caretRight}
                                    alt=""
                                />
                            </button>
                        )}
                    </div>

                    <div
                        ref={photoListRef}
                        className={`admin-review-photo-list ${
                            isPhotoDragging
                                ? "admin-review-photo-list-dragging"
                                : ""
                        }`}
                        onScroll={handlePhotoScroll}
                        onPointerDown={
                            handlePhotoPointerDown
                        }
                        onPointerMove={
                            handlePhotoPointerMove
                        }
                        onPointerUp={
                            handlePhotoPointerUp
                        }
                        onPointerCancel={
                            handlePhotoPointerUp
                        }
                    >
                        {photoList.map(
                            (image, index) => (
                                <div
                                    key={image}
                                    className="admin-review-photo-item"
                                >
                                    <img
                                        src={image}
                                        alt={`제출 사진 ${
                                            index + 1
                                        }`}
                                        draggable="false"
                                    />
                                </div>
                            ),
                        )}
                    </div>

                    {photoList.length > 3 && (
                        <div
                            className="admin-review-photo-scroll"
                            aria-hidden="true"
                        >
                            <div
                                className="admin-review-photo-scroll-thumb"
                                style={{
                                    left: `${photoScrollProgress * 100}%`,
                                    transform: `translateX(-${
                                        photoScrollProgress *
                                        74.5
                                    }px)`,
                                }}
                            />
                        </div>
                    )}
                </section>

                <section className="admin-review-check-list">
                    {reviewItemList.map((item) => {
                        const checked =
                            reviewChecks[item.key];

                        return (
                            <button
                                key={item.key}
                                type="button"
                                className="admin-review-check-item"
                                onClick={() =>
                                    handleCheckClick(
                                        item.key,
                                    )
                                }
                            >
                                <img
                                    src={
                                        checked
                                            ? checkboxChecked
                                            : checkboxUnchecked
                                    }
                                    alt=""
                                />

                                <span>
                                    <strong>
                                        {item.title}
                                    </strong>

                                    <small>
                                        {item.description}
                                    </small>
                                </span>
                            </button>
                        );
                    })}
                </section>

                <div className="admin-review-action-area">
                    <div className="admin-review-visibility-buttons">
                        <button
                            type="button"
                            className={`admin-review-visibility ${
                                selectedVisibility ===
                                "PUBLIC"
                                    ? "admin-review-visibility-active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleVisibilityClick(
                                    "PUBLIC",
                                )
                            }
                        >
                            공개
                        </button>

                        <button
                            type="button"
                            className={`admin-review-visibility ${
                                selectedVisibility ===
                                "PRIVATE"
                                    ? "admin-review-visibility-active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleVisibilityClick(
                                    "PRIVATE",
                                )
                            }
                        >
                            비공개
                        </button>
                    </div>

                    <button
                        type="button"
                        className={`admin-review-confirm ${
                            isConfirmEnabled
                                ? "admin-review-confirm-active"
                                : ""
                        }`}
                        disabled={!isConfirmEnabled}
                        onClick={handleConfirm}
                    >
                        확인
                    </button>
                </div>
            </div>
        </main>
    );
};

export default AdminReviewDetail;