import { useState } from "react";
import { useLocation, useNavigate, useParams, } from "react-router-dom";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import arrowRight from "@/assets/icons/arrow-right.svg";

import "./AdminNotification.css";

const notificationTemplate = {
    "reviewing-public": {
        title: "당신의 이야기가 정원에 공개되었어요.",
        content:
            "운영팀 검수 후 사연이 정원에 공개되었어요. 다른 사용자가 당신의 사연을 읽고 공감할 수 있어요.",
        reason: "",
    },

    "private-public": {
        title: "당신의 이야기가 정원에 공개되었어요.",
        content:
            "운영팀 검수 후 사연이 정원에 공개되었어요. 다른 사용자가 당신의 사연을 읽고 공감할 수 있어요.",
        reason: "",
    },

    "reviewing-private": {
        title: "당신의 이야기가 숨겨졌어요.",
        content:
            "운영팀 검수 결과, 사연 방침에 어긋나 공개하지 못했어요. 사연을 수정하고 다시 제출해 보세요.",
        reason: "위반항목:",
    },

    "public-private": {
        title: "당신의 이야기가 숨겨졌어요.",
        content:
            "운영팀 검수 결과, 사연 방침에 어긋나 공개하지 못했어요. 사연을 수정하고 다시 제출해 보세요.",
        reason: "위반항목:",
    },
};

const AUTO_REASON_PREFIX = "위반항목:";

const AdminNotification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { storyId } = useParams();

    const previousStatus =
        location.state?.previousStatus ?? "reviewing";

    const nextStatus =
        location.state?.nextStatus ?? "public";

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [reason, setReason] = useState("");

    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const templateKey = `${previousStatus}-${nextStatus}`;

    const template = notificationTemplate[templateKey];

    const canAutoComplete = Boolean(template);

    const needsReason = nextStatus === "private";

    const handleBack = () => {
        navigate(`/admin/reviews/${storyId}`);
    };

    const handleAutoComplete = () => {
        if (!canAutoComplete) {
            return;
        }

        if (isAutoFilled) {
            setTitle("");
            setContent("");
            setReason("");

            setIsAutoFilled(false);
            setIsConfirmed(false);

            return;
        }

        setTitle(template.title);
        setContent(template.content);
        setReason(template.reason);

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

        /*
         * 자동완성으로 "위반항목:"이 입력된 경우에는
         * 뒤에 실제 사유가 2글자 이상 입력되어야 함.
         */
        if (isAutoFilled) {
            const reasonDetail = reason
                .replace(AUTO_REASON_PREFIX, "")
                .trim();

            return reasonDetail.length >= 2;
        }

        /*
         * 자동완성을 사용하지 않은 경우에는
         * 사유 칸이 비어있지만 않으면 됨.
         */
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

    const handleNotificationSend = () => {
        if (!isConfirmed) {
            return;
        }

        navigate("/admin/completed", {
            state: {
                type: "notification",
            },
        });
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
                        onChange={handleTitleChange}
                    />
                </div>

                <div className="admin-notification-field">
                    <label htmlFor="notification-content">
                        내용
                    </label>

                    <textarea
                        id="notification-content"
                        value={content}
                        onChange={handleContentChange}
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
                            onChange={handleReasonChange}
                        />
                    </div>
                )}

                <div className="admin-notification-actions">
                    <div className="admin-notification-top-buttons">
                        <button
                            type="button"
                            className="admin-notification-auto"
                            onClick={handleAutoComplete}
                            disabled={!canAutoComplete}
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
                            disabled={!isFormFilled}
                            onClick={handleConfirm}
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
                        disabled={!isConfirmed}
                        onClick={handleNotificationSend}
                    >
                        알림 발송
                    </button>
                </div>
            </div>
        </main>
    );
};

export default AdminNotification;