import { useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import arrowRight from "@/assets/icons/arrow-right.svg";

import {
    sendAdminNotification,
    updateAdminStoryReview,
} from "@/api/adminApi";

import "./AdminNotification.css";

const AUTO_REASON_PREFIX = "위반항목:";

const AUTO_NOTIFICATION = {
    PUBLIC: {
        title: "당신의 이야기가 정원에 공개되었어요.",
        content:
            "운영팀 검수 후 사연이 정원에 공개되었어요. 다른 사용자가 당신의 사연을 읽고 공감할 수 있어요.",
    },
    PRIVATE: {
        title: "당신의 이야기가 숨겨졌어요",
        content:
            "운영팀 검수 결과, 사연 방침에 어긋나 공개하지 못했어요. 사연을 수정하고 다시 제출해 보세요.",
    },
};

const AdminNotification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { storyId } = useParams();

    const previousStatus =
        location.state?.previousStatus ??
        "PENDING";

    const nextStatus =
        location.state?.nextStatus ?? null;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [reason, setReason] = useState("");

    const [isAutoFilled, setIsAutoFilled] =
        useState(false);

    const [isConfirmed, setIsConfirmed] =
        useState(false);

    const [isSending, setIsSending] =
        useState(false);

    const needsReason =
        nextStatus === "PRIVATE";

    const handleBack = () => {
        navigate(
            `/admin/reviews/${storyId}`,
        );
    };

    const handleAutoComplete = () => {
        if (isAutoFilled) {
            setTitle("");
            setContent("");
            setReason("");
            setIsAutoFilled(false);
            setIsConfirmed(false);

            return;
        }

        if (!nextStatus) {
            return;
        }

        const draft =
            AUTO_NOTIFICATION[nextStatus];

        if (!draft) {
            return;
        }

        setTitle(draft.title);
        setContent(draft.content);

        if (needsReason) {
            setReason(AUTO_REASON_PREFIX);
        } else {
            setReason("");
        }

        setIsAutoFilled(true);
        setIsConfirmed(false);
    };

    const isReasonValid = (() => {
        if (!needsReason) {
            return true;
        }

        if (!reason.trim()) {
            return false;
        }

        const reasonDetail = reason
            .replace(
                AUTO_REASON_PREFIX,
                "",
            )
            .trim();

        return reasonDetail.length >= 2;
    })();

    const isFormFilled =
        title.trim() !== "" &&
        content.trim() !== "" &&
        isReasonValid &&
        nextStatus !== null;

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setIsConfirmed(false);
        setIsAutoFilled(false);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
        setIsConfirmed(false);
        setIsAutoFilled(false);
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
        setIsConfirmed(false);
        setIsAutoFilled(false);
    };

    const handleConfirm = () => {
        if (!isFormFilled) {
            return;
        }

        setIsConfirmed(true);
    };

    const handleNotificationSend = async () => {
        if (
            !isConfirmed ||
            isSending ||
            !nextStatus
        ) {
            return;
        }

        const notificationContent =
            needsReason
                ? `${content.trim()}\n\n${reason.trim()}`
                : content.trim();

        try {
            setIsSending(true);

            await sendAdminNotification(
                storyId,
                title.trim(),
                notificationContent,
            );

            await updateAdminStoryReview(
                storyId,
                nextStatus,
            );

            navigate("/admin/completed", {
                state: {
                    type: "notification",
                },
            });
        } catch {
            setIsSending(false);
        }
    };

    return (
        <main className="admin-notification-page">
            <AdminHeader
                title="알림 발송"
                onBack={handleBack}
            />

            <div className="admin-notification-content">
                <div className="admin-notification-status">
                    <AdminStatusBadge
                        status={previousStatus}
                    />

                    <img
                        src={arrowRight}
                        alt=""
                    />

                    {nextStatus && (
                        <AdminStatusBadge
                            status={nextStatus}
                        />
                    )}
                </div>

                <div className="admin-notification-field">
                    <label htmlFor="notification-title">
                        제목
                    </label>

                    <input
                        id="notification-title"
                        type="text"
                        value={title}
                        onChange={
                            handleTitleChange
                        }
                    />
                </div>

                <div className="admin-notification-field">
                    <label htmlFor="notification-content">
                        내용
                    </label>

                    <textarea
                        id="notification-content"
                        value={content}
                        onChange={
                            handleContentChange
                        }
                    />
                </div>

                {needsReason && (
                    <div className="admin-notification-field">
                        <label htmlFor="notification-reason">
                            사유
                        </label>

                        <input
                            id="notification-reason"
                            type="text"
                            value={reason}
                            onChange={
                                handleReasonChange
                            }
                        />
                    </div>
                )}

                <div className="admin-notification-actions">
                    <div className="admin-notification-top-buttons">
                        <button
                            type="button"
                            className="admin-notification-auto"
                            disabled={!nextStatus}
                            onClick={
                                handleAutoComplete
                            }
                        >
                            {isAutoFilled
                                ? "자동완성 취소"
                                : "자동완성"}
                        </button>

                        <button
                            type="button"
                            className={`admin-notification-confirm ${
                                isFormFilled
                                    ? "admin-notification-button-active"
                                    : ""
                            }`}
                            disabled={
                                !isFormFilled
                            }
                            onClick={
                                handleConfirm
                            }
                        >
                            확인
                        </button>
                    </div>

                    <button
                        type="button"
                        className={`admin-notification-send ${
                            isConfirmed
                                ? "admin-notification-button-active"
                                : ""
                        }`}
                        disabled={
                            !isConfirmed ||
                            isSending
                        }
                        onClick={
                            handleNotificationSend
                        }
                    >
                        {isSending
                            ? "발송 중"
                            : "알림 발송"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default AdminNotification;