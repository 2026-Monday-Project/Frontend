import axios from "axios";

/*
 * 프로젝트에서 사용하는 Axios 공통 인스턴스입니다.
 *
 * API 요청 시 axios를 직접 import하지 않고 이 파일의 api 인스턴스를 import해서 사용합니다.
 *
 * baseURL은 .env의 VITE_API_BASE_URL 값을 사용합니다.
 *
 * 사용 예시)
 * import api from "@/api/axios";
 *
 * api.get("/stories");
 * api.post("/stories", data);
 */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default api;