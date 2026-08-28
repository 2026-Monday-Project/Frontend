import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import grassesImg from '@/assets/images/custom/grasses.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import statusUnderReview from '@/assets/images/custom/status-under-review.svg';
import viewsIcon from '@/assets/images/custom/views.svg';
import likesIcon from '@/assets/images/custom/likes.svg';
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
                <div className="story-card">
                    <img src={louisProfile} alt="" className="story-thumbnail" />
                    <div className="story-content">
                        <div className="status-title">
                            <div className="story-status">
                                <img src={statusUnderReview} alt="검토중" />
                            </div>
                                <p className="story-title">산책 한마디에 대소동</p>
                        </div>
                        <p className="story-date">2026.07.15</p>
                    </div>
                    <div className="story-metrics">
                        <span className="metric">
                            <img src={viewsIcon} alt="조회수" className="views-icon" /> 1
                        </span>
                        <span className="metric">
                            <img src={likesIcon} alt="공감수" className="likes-icon" /> 1
                        </span>
                    </div>
                </div>
                
                <div className="story-card">
                    <img src={louisProfile} alt="" className="story-thumbnail" />
                    <div className="story-content">
                        <div className="status-title">
                            <div className="story-status">
                                <img src={statusUnderReview} alt="검토중" />
                            </div>
                                <p className="story-title">산책 한마디에 대소동</p>
                        </div>
                        <p className="story-date">2026.07.15</p>
                    </div>
                    <div className="story-metrics">
                        <span className="metric">
                            <img src={viewsIcon} alt="조회수" className="views-icon" /> 1
                        </span>
                        <span className="metric">
                            <img src={likesIcon} alt="공감수" className="likes-icon" /> 1
                        </span>
                    </div>
                </div>

                <div className="story-card">
                    <img src={louisProfile} alt="" className="story-thumbnail" />
                    <div className="story-content">
                        <div className="status-title">
                            <div className="story-status">
                                <img src={statusUnderReview} alt="검토중" />
                            </div>
                                <p className="story-title">산책 한마디에 대소동</p>
                        </div>
                        <p className="story-date">2026.07.15</p>
                    </div>
                    <div className="story-metrics">
                        <span className="metric">
                            <img src={viewsIcon} alt="조회수" className="views-icon" /> 1
                        </span>
                        <span className="metric">
                            <img src={likesIcon} alt="공감수" className="likes-icon" /> 1
                        </span>
                    </div>
                </div>

                <div className="story-card">
                    <img src={louisProfile} alt="" className="story-thumbnail" />
                    <div className="story-content">
                        <div className="status-title">
                            <div className="story-status">
                                <img src={statusUnderReview} alt="검토중" />
                            </div>
                                <p className="story-title">산책 한마디에 대소동</p>
                        </div>
                        <p className="story-date">2026.07.15</p>
                    </div>
                    <div className="story-metrics">
                        <span className="metric">
                            <img src={viewsIcon} alt="조회수" className="views-icon" /> 1
                        </span>
                        <span className="metric">
                            <img src={likesIcon} alt="공감수" className="likes-icon" /> 1
                        </span>
                    </div>
                </div>

                <div className="story-card">
                    <img src={louisProfile} alt="" className="story-thumbnail" />
                    <div className="story-content">
                        <div className="status-title">
                            <div className="story-status">
                                <img src={statusUnderReview} alt="검토중" />
                            </div>
                                <p className="story-title">산책 한마디에 대소동</p>
                        </div>
                        <p className="story-date">2026.07.15</p>
                    </div>
                    <div className="story-metrics">
                        <span className="metric">
                            <img src={viewsIcon} alt="조회수" className="views-icon" /> 1
                        </span>
                        <span className="metric">
                            <img src={likesIcon} alt="공감수" className="likes-icon" /> 1
                        </span>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default MyStoriesList;