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
    getAdminNotificationDraft,
    sendAdminNotification,
} from "@/api/adminApi";

import "./AdminNotification.css";

const AUTO_REASON_PREFIX = "위반항목:";

const AdminNotification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { storyId } = useParams();

    const previousStatus =
        location.state?.previousStatus ?? "PENDING";

    const nextStatus =
        location.state?.nextStatus ?? "PUBLIC";

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
        navigate(`/admin/reviews/${storyId}`);
    };

    const handleAutoComplete = async () => {
        if (isAutoFilled) {
            setTitle("");
            setContent("");
            setReason("");
            setIsAutoFilled(false);
            setIsConfirmed(false);

            return;
        }

        try {
            const response =
                await getAdminNotificationDraft(
                    storyId,
                );

            const draft =
                response.data.data;

            setTitle(draft.title ?? "");
            setContent(draft.content ?? "");

            if (needsReason) {
                setReason(AUTO_REASON_PREFIX);
            }

            setIsAutoFilled(true);
            setIsConfirmed(false);
        } catch {
            setTitle("");
            setContent("");
            setReason("");
            setIsAutoFilled(false);
            setIsConfirmed(false);
        }
    };

    const isReasonValid = (() => {
        if (!needsReason) {
            return true;
        }

        if (!reason.trim()) {
            return false;
        }

        if (isAutoFilled) {
            const reasonDetail = reason
                .replace(
                    AUTO_REASON_PREFIX,
                    "",
                )
                .trim();

            return reasonDetail.length >= 2;
        }

        return true;
    })();

    const isFormFilled =
        title.trim() !== "" &&
        content.trim() !== "" &&
        isReasonValid;

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setIsConfirmed(false);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
        setIsConfirmed(false);
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
        setIsConfirmed(false);
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
            isSending
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

                    <AdminStatusBadge
                        status={nextStatus}
                    />
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
                            onClick={
                                handleAutoComplete
                            }
                        >
                            자동완성
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
                        알림 발송
                    </button>
                </div>
            </div>
        </main>
    );
};

export default AdminNotification;