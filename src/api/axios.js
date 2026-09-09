import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const isAdminRequest =
        config.url?.startsWith("/admin");

    const isAdminLoginRequest =
        config.url === "/admin/login";

    let accessToken = null;

    if (isAdminRequest && !isAdminLoginRequest) {
        accessToken =
            localStorage.getItem("adminAccessToken") ||
            sessionStorage.getItem("adminAccessToken");
    } else if (!isAdminRequest) {
        accessToken =
            localStorage.getItem("accessToken");
    }

    if (accessToken) {
        config.headers.Authorization =
            `Bearer ${accessToken}`;
    }

    return config;
});

export default api;