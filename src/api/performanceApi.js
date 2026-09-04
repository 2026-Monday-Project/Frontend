import api from "@/api/axios";

export const getMondayOneSong = () => {
    return api.get("/performance/one-song");
};