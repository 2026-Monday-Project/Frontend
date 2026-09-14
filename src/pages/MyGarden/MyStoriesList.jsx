import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/myGarden/StoryCard';
import GardenEmptyState from '@/components/garden/GardenEmptyState';
import grassesImg from '@/assets/images/custom/grasses.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import './MyStoriesList.css';

const MyStoriesList = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('전체');
    const [stories, setStories] = useState([]);
    const [isTotallyEmpty, setIsTotallyEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const tabs = ['전체', '공개', '검토중', '비공개'];

    const statusMap = {
        '전체': null,
        '공개': 'PUBLIC',
        '검토중': 'PENDING',
        '비공개': 'PRIVATE'
    };

    useEffect(() => {
        if (activeTab === null && isTotallyEmpty) return;

        const fetchStories = async () => {
            try {
                setIsLoading(true);
                const currentStatus = statusMap[activeTab] ?? null;
                const params = currentStatus ? { status: currentStatus } : {};
                
                const response = await api.get('/my-garden/stories', { params });
                const fetchedContent = response.data?.data?.content;
                const storyArray = Array.isArray(fetchedContent) ? fetchedContent : [];
                
                setStories(storyArray);

                if (!currentStatus && storyArray.length === 0) {
                    setIsTotallyEmpty(true);
                    setActiveTab(null);
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    console.error(error);
                    setStories([]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStories();
    }, [activeTab, isTotallyEmpty, navigate]);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const formatStatus = (status) => {
        if (status === 'PENDING') return '검토중';
        if (status === 'PUBLIC') return '공개';
        return '비공개';
    };

    return (
        <div className="my-stories-page">
            <img src={grassesImg} alt="" className="grasses-bottom" />
            
            <Navbar 
                title="내 사연"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            {!isTotallyEmpty && (
                <div className="tabs-section">
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            )}

            <div className="story-list-scroll">
                {!isLoading && isTotallyEmpty ? (
                    <div className="empty-state-wrapper">
                        <GardenEmptyState 
                            title="아직 보낸 사연이 없어요."
                            subtitle="가장 먼저 우리 이야기를 들려주세요."
                            guide="사연을 보내고 나만의 정원을 만들어 보세요."
                        />
                    </div>
                ) : (
                    stories.map(story => (
                        <StoryCard 
                            key={story.storyId}
                            thumbnail={story.thumbnailUrl || story.imageUrl || louisProfile}
                            status={formatStatus(story.status)}
                            title={story.title}
                            date={formatDate(story.createdAt)}
                            views={story.viewCount}
                            likes={story.likeCount}
                            onClick={() => navigate(`/mystories/detail/${story.storyId}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MyStoriesList;