import { useEffect, useState } from "react";

import Navbar from "@/components/common/Navbar";
import Drawer from "@/components/common/Drawer";
import NicknameChangeCompleted from "@/components/settings/NicknameChangeCompleted";
import {
    checkMyNickname,
    getMyProfile,
    updateNickname,
} from "@/api/accountApi";

import "./NicknameChange.css";

const NicknameChange = ({ onBack }) => {
    const [nickname, setNickname] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [nicknameCheckStatus, setNicknameCheckStatus] =
        useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const response = await getMyProfile();

                const currentNickname =
                    response.data.data.nickname;

                setNickname(currentNickname);
            } catch {
                setNickname("");
            }
        };

        fetchMyProfile();
    }, []);

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);

        // 닉네임을 수정하면 기존 중복 확인 결과 초기화
        setNicknameCheckStatus(null);
    };

    const handleDuplicateCheck = async () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname || isChecking) {
            return;
        }

        try {
            setIsChecking(true);

            const response =
                await checkMyNickname(trimmedNickname);

            const isAvailable =
                response.data.data.available;

            setNicknameCheckStatus(
                isAvailable ? "available" : "duplicate",
            );
        } catch {
            setNicknameCheckStatus(null);
        } finally {
            setIsChecking(false);
        }
    };

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleSubmit = async () => {
        const trimmedNickname = nickname.trim();

        if (
            !trimmedNickname ||
            nicknameCheckStatus !== "available" ||
            isSubmitting
        ) {
            return;
        }

        try {
            setIsSubmitting(true);

            await updateNickname(trimmedNickname);

            setIsCompleted(true);
        } catch {
            setIsSubmitting(false);
        }
    };

    if (isCompleted) {
        return <NicknameChangeCompleted />;
    }

    const isDuplicate =
        nicknameCheckStatus === "duplicate";

    const isAvailable =
        nicknameCheckStatus === "available";

    return (
        <main className="nickname-change">
            <Navbar
                title="설정"
                showBackButton
                onBack={onBack}
                showMenuButton
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />

            <Drawer
                isOpen={isMenuOpen}
                onClose={handleMenuClose}
            />

            <div className="nickname-change-content">
                <h2 className="nickname-change-title">
                    사연을 보낼 때 사용할
                    <br />
                    닉네임을 입력해주세요
                </h2>

                <div className="nickname-change-field">
                    <label
                        className="nickname-change-label"
                        htmlFor="nickname"
                    >
                        닉네임
                    </label>

                    <div
                        className={`nickname-change-input-box ${
                            isDuplicate
                                ? "nickname-change-input-box-error"
                                : ""
                        }`}
                    >
                        <input
                            id="nickname"
                            className="nickname-change-input"
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            maxLength={10}
                        />

                        <button
                            type="button"
                            className="nickname-duplicate-button"
                            disabled={
                                !nickname.trim() ||
                                isChecking
                            }
                            onClick={handleDuplicateCheck}
                        >
                            중복 확인
                        </button>
                    </div>

                    {isAvailable && (
                        <p className="nickname-change-message nickname-change-message-success">
                            사용 가능한 닉네임 입니다.
                        </p>
                    )}

                    {isDuplicate && (
                        <p className="nickname-change-message nickname-change-message-error">
                            * 이미 사용 중인 닉네임 입니다.
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    className="nickname-change-submit"
                    disabled={
                        !nickname.trim() ||
                        !isAvailable ||
                        isSubmitting
                    }
                    onClick={handleSubmit}
                >
                    변경하기
                </button>
            </div>
        </main>
    );
};

export default NicknameChange;