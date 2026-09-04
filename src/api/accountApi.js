import api from "@/api/axios";

export const checkMyNickname = (nickname) => {
    return api.get("/accounts/me/nickname-check", {
        params: {
            nickname,
        },
    });
};

export const updateNickname = (nickname) => {
    return api.patch("/accounts/me/nickname", {
        nickname,
    });
};

export const logout = () => {
    return api.post("/accounts/logout");
};

export const getMyProfile = () => {
    return api.get("/accounts/me");
};