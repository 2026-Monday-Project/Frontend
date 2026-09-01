import { useState } from "react";

import Navbar from "@/components/common/Navbar";
import Drawer from "@/components/common/Drawer";
import NicknameChangeCompleted from "@/components/settings/NicknameChangeCompleted";

import "./NicknameChange.css";

const NicknameChange = ({ onBack }) => {
    const [nickname, setNickname] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    };

    const handleDuplicateCheck = () => {
        // TODO: 닉네임 중복 확인 API 연결
    };

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleSubmit = () => {
        if (!nickname.trim()) {
            return;
        }

        // TODO: 추후 닉네임 변경 API 성공 후 처리
        setIsCompleted(true);
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

                    <div className="nickname-change-input-box">
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
                            onClick={handleDuplicateCheck}
                        >
                            중복 확인
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="nickname-change-submit"
                    disabled={!nickname.trim()}
                    onClick={handleSubmit}
                >
                    변경하기
                </button>
            </div>
        </main>
    );
};

export default NicknameChange;