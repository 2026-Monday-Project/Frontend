import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "@/api/adminApi";
import checkboxDefaultIcon from "@/assets/icons/admin-checkbox-default.svg";
import checkboxSelectedIcon from "@/assets/icons/admin-checkbox-selected.svg";
import passwordVisibleIcon from "@/assets/icons/password-visible.svg";
import passwordHiddenIcon from "@/assets/icons/password-hidden.svg";

import "./AdminLogin.css";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] =
        useState(false);
    const [isPasswordVisible, setIsPasswordVisible] =
        useState(false);
    const [hasLoginError, setHasLoginError] =
        useState(false);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const isLoginEnabled =
        username.trim() !== "" &&
        password.trim() !== "" &&
        !isSubmitting;

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setHasLoginError(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setHasLoginError(false);
    };

    const handleKeepLoggedInClick = () => {
        setKeepLoggedIn((prev) => !prev);
    };

    const handlePasswordVisibilityClick = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isLoginEnabled) {
            return;
        }

        try {
            setIsSubmitting(true);
            setHasLoginError(false);

            const response = await loginAdmin(
                username.trim(),
                password,
            );

            const accessToken =
                response.data.data.accessToken;

            if (keepLoggedIn) {
                localStorage.setItem(
                    "adminAccessToken",
                    accessToken,
                );

                sessionStorage.removeItem(
                    "adminAccessToken",
                );
            } else {
                sessionStorage.setItem(
                    "adminAccessToken",
                    accessToken,
                );

                localStorage.removeItem(
                    "adminAccessToken",
                );
            }

            navigate("/admin/reviews");
        } catch {
            setHasLoginError(true);
            setIsSubmitting(false);
        }
    };

    return (
        <main className="admin-login-page">
            <form
                className="admin-login-form"
                onSubmit={handleSubmit}
            >
                <h1 className="admin-login-title">
                    로그인
                </h1>

                <div className="admin-login-fields">
                    <div
                        className={`admin-login-input-box ${
                            hasLoginError
                                ? "admin-login-input-box-error"
                                : ""
                        }`}
                    >
                        <input
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="아이디"
                            autoComplete="username"
                            className="admin-login-input"
                        />
                    </div>

                    <div
                        className={`admin-login-input-box ${
                            hasLoginError
                                ? "admin-login-input-box-error"
                                : ""
                        }`}
                    >
                        <input
                            type={
                                isPasswordVisible
                                    ? "text"
                                    : "password"
                            }
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="비밀번호"
                            autoComplete="current-password"
                            className="admin-login-input"
                        />

                        <button
                            type="button"
                            className="admin-login-password-toggle"
                            onClick={
                                handlePasswordVisibilityClick
                            }
                            aria-label={
                                isPasswordVisible
                                    ? "비밀번호 숨기기"
                                    : "비밀번호 보기"
                            }
                        >
                            <img
                                src={
                                    isPasswordVisible
                                        ? passwordVisibleIcon
                                        : passwordHiddenIcon
                                }
                                alt=""
                            />
                        </button>
                    </div>
                </div>

                <button
                    type="button"
                    className="admin-login-keep"
                    onClick={handleKeepLoggedInClick}
                >
                    <img
                        src={
                            keepLoggedIn
                                ? checkboxSelectedIcon
                                : checkboxDefaultIcon
                        }
                        alt=""
                    />

                    <span>로그인 상태 유지</span>
                </button>

                <div className="admin-login-action">
                    {hasLoginError && (
                        <p className="admin-login-error">
                            아이디와 비밀번호를 확인해주세요
                        </p>
                    )}

                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={!isLoginEnabled}
                    >
                        로그인
                    </button>
                </div>
            </form>
        </main>
    );
};

export default AdminLogin;