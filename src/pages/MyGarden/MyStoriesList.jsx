import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/myGarden/StoryCard';
import grassesImg from '@/assets/images/custom/grasses.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import './MyStoriesList.css';

const MyStoriesList = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('전체');

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    const tabs = ['전체', '공개', '검토중', '비공개'];

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

            <div className="story-list-scroll">
                <StoryCard 
                    thumbnail={louisProfile}
                    status="검토중"
                    title="산책 한마디에 대소동"
                    date="2026.07.15"
                    views={1}
                    likes={1}
                />
                <StoryCard 
                    thumbnail={louisProfile}
                    status="비공개"
                    title="산책 한마디에 대소동"
                    date="2026.07.15"
                    views={1}
                    likes={1}
                />
                <StoryCard 
                    thumbnail={louisProfile}
                    status="공개"
                    title="산책 한마디에 대소동"
                    date="2026.07.15"
                    views={1}
                    likes={1}
                />
            </div>
        </div>
    );
};

export default MyStoriesList;