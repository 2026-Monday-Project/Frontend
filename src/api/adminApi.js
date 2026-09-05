import api from "@/api/axios";

export const loginAdmin = (username, password) => {
    return api.post("/admin/login", {
        username,
        password,
    });
};

export const getAdminStorySummary = () => {
    return api.get("/admin/stories/summary");
};

export const getAdminStoryList = ({
    status = "PENDING",
    page = 0,
    size = 20,
} = {}) => {
    return api.get("/admin/stories", {
        params: {
            status,
            page,
            size,
        },
    });
};

export const getAdminStoryDetail = (storyId) => {
    return api.get(`/admin/stories/${storyId}`);
};

export const updateAdminStoryReview = (
    storyId,
    status,
) => {
    return api.patch(`/admin/stories/${storyId}/review`, {
        status,
    });
};

export const getAdminNotificationDraft = (storyId) => {
    return api.get(
        `/admin/stories/${storyId}/notification-draft`,
    );
};

export const sendAdminNotification = (
    storyId,
    title,
    content,
) => {
    return api.post(
        `/admin/stories/${storyId}/notifications`,
        {
            title,
            content,
        },
    );
};