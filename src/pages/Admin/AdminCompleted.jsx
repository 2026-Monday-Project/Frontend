import { useNavigate } from "react-router-dom";

import checkCircle from "@/assets/icons/check-circle.svg";

import "./AdminCompleted.css";

const AdminCompleted = () => {
    const navigate = useNavigate();

    const handleMainClick = () => {
        navigate("/admin/reviews");
    };

    return (
        <main className="admin-completed">
            <div className="admin-completed-result">
                <img
                    className="admin-completed-icon"
                    src={checkCircle}
                    alt=""
                />

                <p className="admin-completed-text">
                    완료
                </p>
            </div>

            <button
                type="button"
                className="admin-completed-main-button"
                onClick={handleMainClick}
            >
                메인으로
            </button>
        </main>
    );
};

export default AdminCompleted;