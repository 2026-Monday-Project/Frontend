import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import arrowDownIcon from "@/assets/icons/arrow-down.svg";
import plusIcon from "@/assets/icons/plus.svg";
import Drawer from "@/components/common/Drawer";
import Navbar from "@/components/common/Navbar";
import GardenEmptyState from "@/components/garden/GardenEmptyState";
import GardenStoryList from "@/components/garden/GardenStoryList";
import { gardenStories } from "@/data/gardenStories";

import "./Garden.css";

const SORT_OPTIONS = ["최신순", "조회순", "공감순"];

const SORT_COMPARATORS = {
    최신순: (firstStory, secondStory) => secondStory.date.localeCompare(firstStory.date),
    조회순: (firstStory, secondStory) => secondStory.viewCount - firstStory.viewCount,
    공감순: (firstStory, secondStory) => secondStory.likeCount - firstStory.likeCount,
};

const Garden = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);
    const sortRef = useRef(null);
    const stories = gardenStories;
    const sortedStories = useMemo(
        () => [...stories].sort(SORT_COMPARATORS[selectedSort]),
        [selectedSort, stories],
    );

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

                {stories.length === 0 ? (
                    <GardenEmptyState />
                ) : (
                    <GardenStoryList
                        stories={sortedStories}
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
