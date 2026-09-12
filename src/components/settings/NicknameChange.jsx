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
        const inputValue = event.target.value;

        /*
         * 영어, 숫자, 특수문자는 제거
         * 한글 완성형 + 한글 자모만 입력 가능
         * 최대 10자
         */
        const koreanOnlyNickname = inputValue
            .replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, "")
            .slice(0, 10);

        setNickname(koreanOnlyNickname);

        /*
         * 입력값이 변경되면
         * 이전 중복 확인 결과 초기화
         */
        setNicknameCheckStatus(null);
    };

    /*
     * 완성된 한글만 1~10자일 때 유효
     * ㄱ, ㄴ, ㅏ 등의 자모는 유효하지 않음
     */
    const isNicknameValid =
        /^[가-힣]{1,10}$/.test(nickname);

    /*
     * 입력값에 초성/중성 등의
     * 미완성 한글 자모가 있는지 확인
     */
    const hasIncompleteKorean =
        nickname.length > 0 &&
        /[ㄱ-ㅎㅏ-ㅣ]/.test(nickname);

    const isDuplicate =
        nicknameCheckStatus === "duplicate";

    const isAvailable =
        nicknameCheckStatus === "available";

    const hasError =
        hasIncompleteKorean || isDuplicate;

    const handleDuplicateCheck = async () => {
        const trimmedNickname = nickname.trim();

        if (
            !isNicknameValid ||
            isChecking
        ) {
            return;
        }

        try {
            setIsChecking(true);

            const response =
                await checkMyNickname(
                    trimmedNickname,
                );

            const isNicknameAvailable =
                response.data.data.available;

            setNicknameCheckStatus(
                isNicknameAvailable
                    ? "available"
                    : "duplicate",
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
            !isNicknameValid ||
            !isAvailable ||
            isSubmitting
        ) {
            return;
        }

        try {
            setIsSubmitting(true);

            await updateNickname(
                trimmedNickname,
            );

            setIsCompleted(true);
        } catch {
            setIsSubmitting(false);
        }
    };

    if (isCompleted) {
        return <NicknameChangeCompleted />;
    }

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
                            hasError
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
                            placeholder="10자 이내 한글로 입력해 주세요."
                            maxLength={10}
                            autoComplete="off"
                        />

                        <button
                            type="button"
                            className="nickname-duplicate-button"
                            disabled={
                                !isNicknameValid ||
                                isChecking
                            }
                            onClick={handleDuplicateCheck}
                        >
                            {isChecking
                                ? "확인 중"
                                : "중복 확인"}
                        </button>
                    </div>

                    {hasIncompleteKorean && (
                        <p className="nickname-change-message nickname-change-message-error">
                            * 완성된 한글로 입력해 주세요.
                        </p>
                    )}

                    {!hasIncompleteKorean &&
                        isAvailable && (
                            <p className="nickname-change-message nickname-change-message-success">
                                사용 가능한 닉네임 입니다.
                            </p>
                        )}

                    {!hasIncompleteKorean &&
                        isDuplicate && (
                            <p className="nickname-change-message nickname-change-message-error">
                                * 이미 사용 중인 닉네임 입니다.
                            </p>
                        )}
                </div>

                <button
                    type="button"
                    className="nickname-change-submit"
                    disabled={
                        !isNicknameValid ||
                        !isAvailable ||
                        isSubmitting
                    }
                    onClick={handleSubmit}
                >
                    {isSubmitting
                        ? "변경 중"
                        : "변경하기"}
                </button>
            </div>
        </main>
    );
};

export default NicknameChange;