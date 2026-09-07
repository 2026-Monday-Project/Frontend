import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
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
    
    const [profile, setProfile] = useState({ nickname: '', email: '' });
    const [stats, setStats] = useState({ sentStoryCount: 0, receivedLikeCount: 0, likedStoryCount: 0 });
    const [stories, setStories] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/mygarden/unlogged-in');
            return;
        }

        const fetchMyGardenData = async () => {
            try {
                const [profileRes, statsRes, storiesRes, notificationsRes] = await Promise.all([
                    api.get('/accounts/me'),
                    api.get('/my-garden/summary'),
                    api.get('/my-garden/stories/preview'),
                    api.get('/my-garden/notifications/preview')
                ]);

                setProfile(profileRes.data.data);
                setStats(statsRes.data.data);
                setStories(storiesRes.data.data);
                setNotifications(notificationsRes.data.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                }
            }
        };

        fetchMyGardenData();
    }, [navigate]);

    const handleGoToMyStories = () => navigate('/mystories/list');
    const handleGoToMailbox = () => navigate('/mailbox');
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

    const formatStatus = (status) => {
        if (status === 'PENDING') return '검토중';
        if (status === 'PUBLIC') return '공개';
        return '비공개';
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
                            <p className="greeting">안녕하세요, {profile.nickname} 님!</p>
                            <p className="email">{profile.email}</p>
                        </div>
                    </div>
                    <img 
                        src={settingsIcon} 
                        alt="설정" 
                        className="settings-icon" 
                        onClick={() => navigate('/settings')} 
                        style={{ cursor: 'pointer' }}
                    />
                </section>    

                <section className="stats-section">
                    <div className="stat-item">
                        <p className="stat-label">보낸 사연</p>
                        <p className="stat-value">{stats.sentStoryCount}</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선"></img>
                    <div className="stat-item">
                        <p className="stat-label">받은 공감</p>
                        <p className="stat-value">{stats.receivedLikeCount}</p>
                    </div>
                    <img className="seperate-line" src={seperateLine} alt="세로 구분선"></img>
                    <div className="stat-item">
                        <p className="stat-label">공감한 사연</p>
                        <p className="stat-value">{stats.likedStoryCount}</p>
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
                        {stories.map(story => (
                            <StoryCard 
                                key={story.storyId}
                                thumbnail={louisProfile}
                                status={formatStatus(story.status)}
                                title={story.title}
                                date={formatDate(story.createdAt)}
                                views={0}
                                likes={story.likeCount}
                                onClick={() => navigate('/mystories/detail')}
                            />
                        ))}
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
                        {notifications.map(mail => (
                            <div 
                                key={mail.notificationId} 
                                className={mail.isRead ? "mail-item-read" : "mail-item"} 
                                onClick={() => navigate('/mailbox')} 
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={mail.isRead ? "mail-content-read" : "mail-content"}>
                                    <p className={mail.isRead ? "mail-title-read" : "mail-title"}>{mail.title}</p>
                                    <p className={mail.isRead ? "mail-date-read" : "mail-date"}>{formatDate(mail.createdAt)}</p>
                                </div>
                                {!mail.isRead && <img src={unreadDot} alt="" className="unread-dot" />}
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyGarden;