import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/common/StoryCard';
import arrowDownIcon from '@/assets/icons/arrow-down.svg';
import grassesImg from '@/assets/images/custom/grasses.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import './LikedStories.css';

const SORT_OPTIONS = ["최신순", "조회순", "공감순"];

const SORT_VALUES = {
    최신순: "LATEST",
    조회순: "VIEWS",
    공감순: "LIKES",
};

const LikedStories = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    
    const selectedSort = SORT_OPTIONS.find((option) => SORT_VALUES[option] === searchParams.get("sort")) ?? SORT_OPTIONS[0];
    
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const sortRef = useRef(null);

    useEffect(() => {
        const fetchLikedStories = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/my-garden/liked-stories', {
                    params: { sort: SORT_VALUES[selectedSort] }
                });
                
                const fetchedContent = response.data?.data?.content || [];
                setStories(fetchedContent);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    console.error('공감한 사연 목록을 불러오지 못했습니다.', error);
                    setStories([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchLikedStories();
    }, [selectedSort, navigate]);

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

    const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);
    const handleDrawerClose = () => setIsMenuOpen(false);

    const handleSortSelect = (option) => {
        setSearchParams((previousParams) => {
            const nextParams = new URLSearchParams(previousParams);
            nextParams.set("sort", SORT_VALUES[option]);
            return nextParams;
        }, { replace: true });
        setIsSortOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className="liked-stories-page">
            <img src={grassesImg} alt="" className="grasses-bottom" />
            
            <Navbar 
                title="공감한 사연"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            <div className="liked-stories-header" ref={sortRef}>
                <div className="garden-sort-row">
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
            </div>

            <div className="story-list-scroll">
                {!isLoading && stories.length === 0 ? (
                    <div className="empty-state-card">
                        <p className="empty-state-text">아직 공감한 사연이 없어요.</p>
                    </div>
                ) : (
                    stories.map(story => (
                        <StoryCard 
                            key={story.storyId}
                            image={story.thumbnailUrl || story.imageUrl || louisProfile}
                            title={story.title}
                            petName={story.petName} 
                            breed={story.petType}   
                            age={story.petAge}      
                            date={formatDate(story.createdAt)}
                            viewCount={story.viewCount || 0}
                            likeCount={story.likeCount || 0}
                            onClick={() => navigate(`/garden/${story.storyId}`)} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default LikedStories;