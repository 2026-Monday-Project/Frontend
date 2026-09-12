import arrowBackIcon from "@/assets/icons/arrow-back.svg";

import "./AdminHeader.css";

const AdminHeader = ({
    title,
    onBack,
    showBackButton = true,
}) => {
    return (
        <header
            className={`admin-header ${
                !showBackButton
                    ? "admin-header-no-back"
                    : ""
            }`}
        >
            {showBackButton && (
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
            )}

            <h1 className="admin-header-title">
                {title}
            </h1>
        </header>
    );
};

export default AdminHeader;