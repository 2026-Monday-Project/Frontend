import "./AdminStatusBadge.css";

const statusInfo = {
    PENDING: {
        label: "검토중",
        className: "reviewing",
    },
    PUBLIC: {
        label: "공개",
        className: "public",
    },
    PRIVATE: {
        label: "비공개",
        className: "private",
    },
};

const AdminStatusBadge = ({ status }) => {
    const info = statusInfo[status];

    if (!info) {
        return null;
    }

    return (
        <span
            className={`admin-status-badge admin-status-${info.className}`}
        >
            {info.label}
        </span>
    );
};

export default AdminStatusBadge;