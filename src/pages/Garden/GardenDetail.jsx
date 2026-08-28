import { useCallback, useState } from "react";
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
import { gardenStories } from "@/data/gardenStories";

import "./GardenDetail.css";

const GardenDetail = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const story = gardenStories.find((item) => String(item.id) === storyId);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const handlePhotoViewerClose = useCallback(() => setIsPhotoViewerOpen(false), []);

    if (!story) {
        return <Navigate to="/garden" replace />;
    }

    const displayedLikeCount = story.likeCount + (isLiked ? 1 : 0);

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

            <StoryPhotoSlider
                images={story.images}
                currentIndex={currentPhotoIndex}
                onChange={setCurrentPhotoIndex}
                onOpen={() => setIsPhotoViewerOpen(true)}
                title={story.title}
            />

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
                            <strong>참쥬</strong>
                            <p>
                                <span>{story.petName}</span>
                                <span className="garden-detail-separator" aria-hidden="true" />
                                <span>{story.age}살</span>
                                <span className="garden-detail-separator" aria-hidden="true" />
                                <span>{story.breed}</span>
                            </p>
                        </div>
                    </div>

                    <div className="garden-detail-like">
                        <button
                            type="button"
                            onClick={() => setIsLiked((liked) => !liked)}
                            aria-label={isLiked ? "공감 취소" : "이 사연에 공감하기"}
                            aria-pressed={isLiked}
                        >
                            <img src={isLiked ? filledHeartIcon : outlineHeartIcon} alt="" aria-hidden="true" />
                        </button>
                        <span>{displayedLikeCount}</span>
                    </div>
                </div>

                <div className="garden-detail-divider-frame" aria-hidden="true">
                    <img className="garden-detail-divider" src={drawerDivider} alt="" />
                </div>

                <p className="garden-detail-story-text">{story.content}</p>
            </article>

            <img className="garden-detail-decoration" src={detailDecoration} alt="" aria-hidden="true" />

            {isPhotoViewerOpen && (
                <StoryPhotoViewer
                    images={story.images}
                    currentIndex={currentPhotoIndex}
                    onChange={setCurrentPhotoIndex}
                    onClose={handlePhotoViewerClose}
                    title={story.title}
                />
            )}
        </main>
    );
};

export default GardenDetail;
