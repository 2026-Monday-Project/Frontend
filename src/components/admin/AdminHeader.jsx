import arrowBackIcon from "@/assets/icons/arrow-back.svg";

import "./AdminHeader.css";

const AdminHeader = ({ title, onBack }) => {
    return (
        <header className="admin-header">
            <button
                type="button"
                className="admin-header-back"
                onClick={onBack}
                aria-label="뒤로 가기"
            >
                <img
                    src={arrowBackIcon}
                    alt=""
                    aria-hidden="true"
                />
            </button>

            <h1 className="admin-header-title">
                {title}
            </h1>
        </header>
    );
};

export default AdminHeader;