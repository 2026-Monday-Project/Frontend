import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import drawerDivider from "@/assets/images/custom/drawer-divider.png";
import detailDecoration from "@/assets/images/custom/story-detail-decoration.png";
import filledHeartIcon from "@/assets/icons/heart.svg";
import outlineHeartIcon from "@/assets/icons/heart-outline.svg";
import pawIcon from "@/assets/icons/story-detail-paw.svg";
import Drawer from "@/components/common/Drawer";
import Navbar from "@/components/common/Navbar";
import StoryPhotoSlider from "@/components/garden/StoryPhotoSlider";
import StoryPhotoViewer from "@/components/garden/StoryPhotoViewer";
import {
    getStoryDetail,
    likeStory,
    unlikeStory,
} from "@/api/storyApi";

import "./GardenDetail.css";

const formatDate = (createdAt) => createdAt?.slice(0, 10).replaceAll("-", ".") ?? "";

const toStoryDetailData = (story) => ({
    id: story.storyId,
    title: story.title,
    nickname: story.nickname,
    petName: story.petName,
    breed: story.petType,
    age: story.petAge,
    content: story.content,
    images: Array.isArray(story.imageUrls) ? story.imageUrls : [],
    date: formatDate(story.createdAt),
    viewCount: story.viewCount,
    likeCount: story.likeCount,
    liked: story.liked,
});

const GardenDetail = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLikePending, setIsLikePending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isNotFound, setIsNotFound] = useState(false);
    const handlePhotoViewerClose = useCallback(() => setIsPhotoViewerOpen(false), []);

    useEffect(() => {
        let isActive = true;

        const loadStory = async () => {
            setIsLoading(true);
            setErrorMessage("");
            setIsNotFound(false);

            try {
                const response = await getStoryDetail(storyId);
                const responseStory = response.data?.data;

                if (!responseStory) throw new Error("사연 상세 응답 데이터가 없습니다.");

                if (isActive) {
                    const nextStory = toStoryDetailData(responseStory);
                    setStory(nextStory);
                    setLikeCount(nextStory.likeCount ?? 0);
                    setIsLiked(nextStory.liked);
                    setCurrentPhotoIndex(0);
                    setIsPhotoViewerOpen(false);
                }
            } catch (error) {
                if (!isActive) return;

                console.error("사연 상세를 불러오지 못했습니다.", error);
                if (error.response?.status === 404) {
                    setIsNotFound(true);
                } else {
                    setErrorMessage("사연을 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
                }
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        loadStory();

        return () => {
            isActive = false;
        };
    }, [storyId]);

    const handleLikeToggle = async () => {
        if (!story || isLikePending) return;

        const previousLiked = isLiked;
        const previousLikeCount = likeCount;
        const nextLiked = !previousLiked;

        setIsLikePending(true);
        setIsLiked(nextLiked);
        setLikeCount(Math.max(0, previousLikeCount + (nextLiked ? 1 : -1)));

        try {
            if (nextLiked) {
                await likeStory(story.id);
            } else {
                await unlikeStory(story.id);
            }
        } catch (error) {
            console.error(nextLiked ? "공감을 등록하지 못했습니다." : "공감을 취소하지 못했습니다.", error);
            setIsLiked(previousLiked);
            setLikeCount(previousLikeCount);
        } finally {
            setIsLikePending(false);
        }
    };

    if (isNotFound) {
        return <Navigate to="/garden" replace />;
    }

    return (
        <main className="garden-detail-page">
            <Navbar
                title="정원 둘러보기"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            />
            <Drawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {isLoading ? (
                <p className="garden-detail-status" role="status">사연을 불러오는 중이에요.</p>
            ) : errorMessage ? (
                <p className="garden-detail-status" role="alert">{errorMessage}</p>
            ) : story ? (
                <>
                    {story.images.length > 0 && (
                        <StoryPhotoSlider
                            images={story.images}
                            currentIndex={currentPhotoIndex}
                            onChange={setCurrentPhotoIndex}
                            onOpen={() => setIsPhotoViewerOpen(true)}
                            title={story.title}
                        />
                    )}

                    <article className="garden-detail-content">
                        <header className="garden-detail-heading">
                            <h1>{story.title}</h1>
                            <time dateTime={story.date.replaceAll(".", "-")}>{story.date}</time>
                        </header>

                        <div className="garden-detail-profile-row">
                            <div className="garden-detail-profile">
                                <span className="garden-detail-paw-circle" aria-hidden="true">
                                    <img src={pawIcon} alt="" />
                                </span>
                                <div>
                                    <strong>{story.nickname}</strong>
                                    <p>
                                        <span>{story.petName}</span>
                                        <span className="garden-detail-pet-detail">
                                            <span className="garden-detail-separator" aria-hidden="true" />
                                            <span>{story.breed}</span>
                                        </span>
                                        <span className="garden-detail-pet-detail">
                                            <span className="garden-detail-separator" aria-hidden="true" />
                                            <span>{story.age}살</span>
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="garden-detail-like">
                                <button
                                    type="button"
                                    onClick={handleLikeToggle}
                                    disabled={isLikePending}
                                    aria-label={isLiked ? "공감 취소" : "이 사연에 공감하기"}
                                    aria-pressed={isLiked}
                                    aria-busy={isLikePending}
                                >
                                    <img src={isLiked ? filledHeartIcon : outlineHeartIcon} alt="" aria-hidden="true" />
                                </button>
                                <span>{likeCount}</span>
                            </div>
                        </div>

                        <div className="garden-detail-divider-frame" aria-hidden="true">
                            <img className="garden-detail-divider" src={drawerDivider} alt="" />
                        </div>

                        <p className="garden-detail-story-text">{story.content}</p>
                    </article>

                    <img className="garden-detail-decoration" src={detailDecoration} alt="" aria-hidden="true" />

                    {isPhotoViewerOpen && story.images.length > 0 && (
                        <StoryPhotoViewer
                            images={story.images}
                            currentIndex={currentPhotoIndex}
                            onChange={setCurrentPhotoIndex}
                            onClose={handlePhotoViewerClose}
                            title={story.title}
                        />
                    )}
                </>
            ) : null}
        </main>
    );
};

export default GardenDetail;
