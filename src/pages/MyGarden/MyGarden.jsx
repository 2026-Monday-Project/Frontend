import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/myGarden/StoryCard';
import footprintIcon from '@/assets/images/custom/footprint.svg';
import seperateLine from '@/assets/images/custom/seperate-line.svg';
import settingsIcon from '@/assets/images/custom/settings.svg';
import arrowViewAll from '@/assets/images/custom/arrow-view-all.svg';
import louisProfile from '@/assets/images/custom/louis-profile.svg';
import unreadDot from '@/assets/images/custom/unread-dot.svg';
import leavesLeftTop from '@/assets/images/custom/leaves-left-top.svg'
import leavesLeftBottom from '@/assets/images/custom/leaves-left-bottom.svg'
import leavesRightBottom from '@/assets/images/custom/leaves-right-bottom.svg'
import './MyGarden.css';

const MyGarden = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleGoToMyStories = () => {
        navigate('/my-stories');
    };

    const handleGoToMailbox = () => {
        navigate('/mailbox');
    };

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="my-garden-page">
            <img src={leavesLeftTop} alt="" className="leaf-left-top" />
            <img src={leavesLeftBottom} alt="" className="leaf-left-bottom" />
            <img src={leavesRightBottom} alt="" className="leaf-right-bottom" />
            <Navbar 
                title="내 정원"
                showMenuButton={true}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            <div className="my-garden-container">
                <section className="profile-section">
                    <div className="profile-info">
                        <div className="profile-img-wrap">
                            <img src={footprintIcon} alt="기본 프사" className="profile-image" />
                        </div>
                        <div className="profile-text">
                            <p className="greeting">안녕하세요, 챱츄 님!</p>
                            <p className="email">loveme@naver.com</p>
                        </div>
                    </div>
                    <img src={settingsIcon} alt="설정" className="settings-icon"></img>
                </section>    

                <section className="stats-section">
                    <div className="stat-item">
                        <p className="stat-label">보낸 사연</p>
                        <p className="stat-value">12</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선"></img>
                    <div className="stat-item">
                        <p className="stat-label">받은 공감</p>
                        <p className="stat-value">4</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선"></img>
                    <div className="stat-item">
                        <p className="stat-label">공감한 사연</p>
                        <p className="stat-value">4</p>
                    </div>
                </section>

                <section className="list-section">
                    <div className="section-header">
                        <h3 className="section-title">내 사연</h3>
                        <button className="view-all-button" onClick={handleGoToMyStories}>
                            전체보기 <img src={arrowViewAll} alt="" />
                        </button>
                    </div>
                    
                    <div className="story-list">
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
                    </div>
                </section>

                <section className="list-section">
                    <div className="section-header">
                        <h3 className="section-title">편지함</h3>
                        <button className="view-all-button" onClick={handleGoToMailbox}>
                            전체보기 <img src={arrowViewAll} alt="" />
                        </button>
                    </div>
                    <div className="mail-list">
                        <div className="mail-item">
                            <div className="mail-content">
                                <p className="mail-title">당신의 이야기가 정원에 도착했어요.</p>
                                <p className="mail-desc">운영팀 검수 후 공개여부와 상태를 내 정원에서 확인할 수 있어요ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</p>
                                <p className="mail-date">2026.07.05</p>
                            </div>
                            <img src={unreadDot} alt="" className="unread-dot" />
                        </div>
                        <div className="mail-item">
                            <div className="mail-content">
                                <p className="mail-title">정원에 오신 걸 환영합니다.</p>
                                <p className="mail-desc">따뜻한 이야기를 함께 나눠보세요.</p>
                                <p className="mail-date">2026.07.01</p>
                            </div>
                        </div>
                        <div className="mail-item-read">
                            <div className="mail-content-read">
                                <p className="mail-title-read">정원에 오신 걸 환영합니다.</p>
                                <p className="mail-desc-read">따뜻한 이야기를 함께 나눠보세요.</p>
                                <p className="mail-date-read">2026.07.01</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyGarden;