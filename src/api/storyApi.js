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
