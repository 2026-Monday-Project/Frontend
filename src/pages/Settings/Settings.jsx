import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/common/Navbar";
import Drawer from "@/components/common/Drawer";
import NicknameChange from "@/components/settings/NicknameChange";
import settingsFlower from "@/assets/images/custom/settings-flower.svg";
import { logout } from "@/api/accountApi";

import "@/pages/Settings/Settings.css";

const Settings = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNicknameChangeOpen, setIsNicknameChangeOpen] =
        useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleNicknameChangeClick = () => {
        setIsNicknameChangeOpen(true);
    };

    const handleNicknameChangeBack = () => {
        setIsNicknameChangeOpen(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // 서버 로그아웃 실패 여부와 관계없이
            // 클라이언트 로그인 정보는 제거
        } finally {
            localStorage.removeItem("accessToken");
            navigate("/");
        }
    };

    if (isNicknameChangeOpen) {
        return (
            <NicknameChange
                onBack={handleNicknameChangeBack}
            />
        );
    }

    return (
        <main className="settings-page">
            <Navbar
                title="설정"
                showBackButton
                onBack={handleBack}
                showMenuButton
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />

            <Drawer
                isOpen={isMenuOpen}
                onClose={handleMenuClose}
            />

            <div className="settings-content">
                <button
                    type="button"
                    className="settings-menu-button"
                    onClick={handleNicknameChangeClick}
                >
                    닉네임 변경하기
                </button>

                <button
                    type="button"
                    className="settings-menu-button"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>
            </div>

            <img
                className="settings-flower"
                src={settingsFlower}
                alt=""
            />
        </main>
    );
};

export default Settings;