import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import arrowDownIcon from "@/assets/icons/arrow-down.svg";
import plusIcon from "@/assets/icons/plus.svg";
import Drawer from "@/components/common/Drawer";
import Navbar from "@/components/common/Navbar";
import GardenEmptyState from "@/components/garden/GardenEmptyState";
import GardenStoryList from "@/components/garden/GardenStoryList";
import { getStories } from "@/api/storyApi";

import "./Garden.css";

const SORT_OPTIONS = ["최신순", "조회순", "공감순"];

const SORT_VALUES = {
    최신순: "LATEST",
    조회순: "VIEWS",
    공감순: "LIKES",
};

const formatDate = (createdAt) => createdAt?.slice(0, 10).replaceAll("-", ".") ?? "";

const toStoryCardData = (story) => ({
    id: story.storyId,
    image: story.thumbnailUrl,
    title: story.title,
    petName: story.petName,
    date: formatDate(story.createdAt),
    viewCount: story.viewCount,
    likeCount: story.likeCount,
});

const Garden = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const sortRef = useRef(null);

    useEffect(() => {
        let isActive = true;

        const loadStories = async () => {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const response = await getStories({
                    sort: SORT_VALUES[selectedSort],
                    page: 0,
                    size: 20,
                });
                const responseStories = response.data?.data?.stories;

                if (isActive) {
                    setStories(Array.isArray(responseStories) ? responseStories.map(toStoryCardData) : []);
                }
            } catch (error) {
                if (isActive) {
                    console.error("정원 사연 목록을 불러오지 못했습니다.", error);
                    setErrorMessage("사연을 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
                }
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        loadStories();

        return () => {
            isActive = false;
        };
    }, [selectedSort]);

    useEffect(() => {
        if (!isSortOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!sortRef.current?.contains(event.target)) {
                setIsSortOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsSortOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSortOpen]);

    const handleMenuClick = () => {
        setIsMenuOpen((isOpen) => !isOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    const handleStoryCreate = () => {
        navigate("/story");
    };

    const handleSortSelect = (option) => {
        setSelectedSort(option);
        setIsSortOpen(false);
    };

    return (
        <main className="garden-page">
            <Navbar
                title="정원 둘러보기"
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            <section className="garden-content" aria-label="정원 사연 목록">
                <div ref={sortRef} className="garden-sort-row">
                    <button
                        className="garden-sort"
                        type="button"
                        onClick={() => setIsSortOpen((isOpen) => !isOpen)}
                        aria-label={`사연 정렬 기준: ${selectedSort}`}
                        aria-haspopup="listbox"
                        aria-expanded={isSortOpen}
                        aria-controls="garden-sort-options"
                    >
                        <span>{selectedSort}</span>
                        <img
                            className={isSortOpen ? "garden-sort-icon-open" : ""}
                            src={arrowDownIcon}
                            alt=""
                            aria-hidden="true"
                        />
                    </button>

                    {isSortOpen && (
                        <div
                            id="garden-sort-options"
                            className="garden-sort-options"
                            role="listbox"
                            aria-label="사연 정렬 기준"
                        >
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    className={`garden-sort-option ${selectedSort === option ? "garden-sort-option-selected" : ""}`}
                                    type="button"
                                    role="option"
                                    aria-selected={selectedSort === option}
                                    onClick={() => handleSortSelect(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <p className="garden-status" role="status">사연을 불러오는 중이에요.</p>
                ) : errorMessage ? (
                    <p className="garden-status" role="alert">{errorMessage}</p>
                ) : stories.length === 0 ? (
                    <GardenEmptyState />
                ) : (
                    <GardenStoryList
                        stories={stories}
                        onStoryClick={(storyId) => navigate(`/garden/${storyId}`)}
                    />
                )}
            </section>

            <div className="garden-cta-wrapper">
                <button
                    className="garden-cta-button"
                    type="button"
                    onClick={handleStoryCreate}
                >
                    <img src={plusIcon} alt="" aria-hidden="true" />
                    <span>우리 이야기 보내기</span>
                </button>
            </div>
        </main>
    );
};

export default Garden;
