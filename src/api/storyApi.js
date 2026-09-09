import api from "@/api/axios";

const buildStoryFormData = (request, images) => {
    const formData = new FormData();

    formData.append(
        "request",
        new Blob([JSON.stringify(request)], {
            type: "application/json",
        }),
    );

    images.forEach((file) => {
        formData.append("images", file);
    });

    return formData;
};

export const createStory = (request, images = []) => {
    return api.post("/stories", buildStoryFormData(request, images));
};

export const updateStory = (storyId, request, images = []) => {
    return api.patch(
        `/stories/${storyId}`,
        buildStoryFormData(request, images),
    );
};

export const getStories = ({ sort = "LATEST", page = 0, size = 20 } = {}) => {
    return api.get("/stories", {
        params: { sort, page, size },
    });
};

export const getStoryDetail = (storyId) => {
    return api.get(`/stories/${storyId}`, {
        withCredentials: true,
    });
};

export const likeStory = (storyId) => {
    return api.post(`/stories/${storyId}/likes`, undefined, {
        withCredentials: true,
    });
};

export const unlikeStory = (storyId) => {
    return api.delete(`/stories/${storyId}/likes`, {
        withCredentials: true,
    });
};
