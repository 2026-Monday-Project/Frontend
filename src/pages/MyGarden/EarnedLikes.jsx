import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/common/StoryCard';
import GardenEmptyState from '@/components/garden/GardenEmptyState';
import grassesImg from '@/assets/images/custom/grasses.svg';
import earnedLikesTotal from '@/assets/images/custom/earned-likes-total.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import './EarnedLikes.css';

const EarnedLikes = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [stories, setStories] = useState([]);
    const [totalLikes, setTotalLikes] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEarnedLikes = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/my-garden/received-likes');
                const fetchedContent = response.data?.data?.content || [];
                console.log("받은 공감 사연 데이터:", fetchedContent[0]);
                
                setStories(fetchedContent);
                setTotalLikes(response.data?.data?.totalCount || fetchedContent.length);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    setStories([]);
                    setTotalLikes(0);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarnedLikes();
    }, [navigate]);

    const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);
    const handleDrawerClose = () => setIsMenuOpen(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    return (
        <div className="earned-likes-page">
            <img src={grassesImg} alt="" className="grasses-bottom" />
            
            <Navbar 
                title="받은 공감"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            <div className="earned-likes-header">
                <img src={earnedLikesTotal} alt="하트" className="heart-icon" />
                <div className="total-count-text">{totalLikes}</div>
            </div>

            <div className="story-list-scroll">
                {!isLoading && totalLikes === 0 ? (
                    <div className="empty-state-wrapper">
                        <GardenEmptyState 
                            title="아직 받은 공감이 없어요."
                            subtitle="첫 공감을 기다리고 있어요."
                            guide="마음이 닿은 사연들이 이곳에 모여요."
                        />
                    </div>
                ) : (
                    stories.map(story => (
                        <StoryCard 
                            key={story.storyId}
                            image={story.thumbnailUrl || louisProfile}
                            title={story.storyTitle}
                            petName={story.petName}
                            breed={story.petType}
                            age={story.petAge}
                            date={formatDate(story.createdAt)}
                            viewCount={story.viewCount}
                            likeCount={story.likeCount}
                            onClick={() => navigate(`/mystories/detail/${story.storyId}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default EarnedLikes;