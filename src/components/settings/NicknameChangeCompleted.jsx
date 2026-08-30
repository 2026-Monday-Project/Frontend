import { useNavigate } from "react-router-dom";

import loginCompletedImage from "@/assets/images/custom/login-completed.svg";

import "./NicknameChangeCompleted.css";

const NicknameChangeCompleted = () => {
    const navigate = useNavigate();

    const handleMyGardenClick = () => {
        navigate("/my-garden");
    };

    const handleGardenClick = () => {
        navigate("/garden");
    };

    return (
        <main className="nickname-completed">
            <div className="nickname-completed-content">
                <img
                    className="nickname-completed-image"
                    src={loginCompletedImage}
                    alt=""
                />

                <h2 className="nickname-completed-title">
                    닉네임 변경이
                    <br />
                    완료 되었어요.
                </h2>

                <div className="nickname-completed-buttons">
                    <button
                        type="button"
                        className="nickname-completed-button nickname-completed-button-primary"
                        onClick={handleMyGardenClick}
                    >
                        내 정원으로 가기
                    </button>

                    <button
                        type="button"
                        className="nickname-completed-button nickname-completed-button-secondary"
                        onClick={handleGardenClick}
                    >
                        정원 둘러보기
                    </button>
                </div>
            </div>
        </main>
    );
};

export default NicknameChangeCompleted;