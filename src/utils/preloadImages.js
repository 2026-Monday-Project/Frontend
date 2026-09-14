export const preloadImages = (
    imageSources,
) => {
    imageSources.forEach((src) => {
        const image = new Image();

        image.src = src;

        image.decode?.().catch(() => {});
    });
};