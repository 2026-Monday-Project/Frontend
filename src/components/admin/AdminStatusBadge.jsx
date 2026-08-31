import "./AdminStatusBadge.css";

const statusLabel = {
    reviewing: "검토중",
    public: "공개",
    private: "비공개",
};

const AdminStatusBadge = ({ status }) => {
    return (
        <span
            className={`admin-status-badge admin-status-${status}`}
        >
            {statusLabel[status]}
        </span>
    );
};

export default AdminStatusBadge;