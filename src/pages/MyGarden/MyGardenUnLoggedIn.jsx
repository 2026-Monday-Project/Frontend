import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import footprintIcon from '@/assets/images/custom/footprint.svg';
import seperateLine from '@/assets/images/custom/seperate-line.svg';
import arrowViewAll from '@/assets/images/custom/arrow-view-all.svg';
import leavesLeftTop from '@/assets/images/custom/leaves-left-top.svg';
import leavesLeftBottom from '@/assets/images/custom/leaves-left-bottom.svg';
import leavesRightBottom from '@/assets/images/custom/leaves-right-bottom.svg';
import requiresStory from '@/assets/images/custom/requires-story.svg';
import seperatePaw from '@/assets/images/custom/seperate-paw.svg';
import './MyGardenUnLoggedIn.css';

const MyGardenUnLoggedIn = () => {
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
                        <div className="profile-text-wrap">
                            <div className="profile-text">내가 보낸 사연을 이곳에서 확인할 수 있어요</div>
                            <div className="profile-text">사연을 보내고 나만의 정원을 만들어 보세요</div>
                        </div>
                    </div>
                </section>    

                <section className="stats-section">
                    <div className="stat-item">
                        <p className="stat-label">보낸 사연</p>
                        <p className="stat-value">0</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선" />
                    <div className="stat-item">
                        <p className="stat-label">받은 공감</p>
                        <p className="stat-value">0</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선" />
                    <div className="stat-item">
                        <p className="stat-label">공감한 사연</p>
                        <p className="stat-value">0</p>
                    </div>
                </section>

                <section className="list-section">
                    <div className="section-header">
                        <h3 className="section-title">내 사연</h3>
                        <button className="view-all-button" onClick={handleGoToMyStories}>
                            전체보기 <img src={arrowViewAll} alt="" />
                        </button>
                    </div>
                    <div className="empty-state-card">
                        <img src={requiresStory} alt="" className="empty-state-icon" />
                        <p className="empty-state-text">사연을 보낸 후 이용할 수 있어요</p>
                        <img src={seperatePaw} alt="" className="empty-state-divider" />
                        <p className="empty-state-subtext">사연을 보내고 나만의 정원을 만들어보세요.</p>
                    </div>
                </section>

                <section className="list-section">
                    <div className="section-header">
                        <h3 className="section-title">편지함</h3>
                        <button className="view-all-button" onClick={handleGoToMailbox}>
                            전체보기 <img src={arrowViewAll} alt="" />
                        </button>
                    </div>
                    <div className="empty-state-card">
                        <img src={requiresStory} alt="" className="empty-state-icon" />
                        <p className="empty-state-text">사연을 보낸 후 이용할 수 있어요</p>
                        <img src={seperatePaw} alt="" className="empty-state-divider" />
                        <p className="empty-state-subtext">사연을 보내고 나만의 정원을 만들어보세요.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyGardenUnLoggedIn;