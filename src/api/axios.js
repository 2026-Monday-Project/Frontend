import axios from "axios";

/*
 * 프로젝트에서 사용하는 Axios 공통 인스턴스입니다.
 *
 * API 요청 시 axios를 직접 가져오지 않고
 * 이 파일의 api를 가져와 사용합니다.
 *
 * baseURL은 .env의 VITE_API_URL 값을 사용합니다.
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const accessToken =
        localStorage.getItem("accessToken");

    if (accessToken) {
        config.headers.Authorization =
            `Bearer ${accessToken}`;
    }

    return config;
});

export default api;