import api from "@/api/axios";

export const login = (email) => {
    return api.post("/accounts/login", {
        email,
    });
};

export const checkEmailAvailable = (email) => {
    return api.get("/accounts/email-check", {
        params: {
            email,
        },
    });
};

export const checkNicknameAvailable = (nickname) => {
    return api.get("/accounts/nickname-check", {
        params: {
            nickname,
        },
    });
};

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