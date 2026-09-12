import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import StoryCard from '@/components/myGarden/StoryCard';
import footprintIcon from '@/assets/images/custom/footprint.svg';
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
            const results = await Promise.allSettled([
                api.get('/accounts/me'),
                api.get('/my-garden/summary'),
                api.get('/my-garden/stories/preview'),
                api.get('/my-garden/notifications/preview')
            ]);

            const isUnauthorized = results.some(
                result => result.status === 'rejected' && result.reason?.response?.status === 401
            );

            if (isUnauthorized) {
                localStorage.removeItem('accessToken');
                navigate('/mygarden/unlogged-in');
                return;
            }

            if (results[0].status === 'fulfilled') setProfile(results[0].value.data.data);
            if (results[1].status === 'fulfilled') setStats(results[1].value.data.data);
            if (results[2].status === 'fulfilled') setStories(results[2].value.data.data);
            if (results[3].status === 'fulfilled') setNotifications(results[3].value.data.data);
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
                    <div 
                        className="stat-item" 
                        onClick={() => navigate('/mystories/list')} 
                        style={{ cursor: 'pointer' }}
                    >
                        <p className="stat-label">보낸 사연</p>
                        <p className="stat-value">{stats.sentStoryCount}</p>
                    </div>
                    <div className="seperate-line"></div>
                    <div 
                        className="stat-item" 
                        onClick={() => navigate('/mygarden/earned-likes')} 
                        style={{ cursor: 'pointer' }}
                    >
                        <p className="stat-label">받은 공감</p>
                        <p className="stat-value">{stats.receivedLikeCount}</p>
                    </div>
                    <div className="seperate-line"></div>
                    <div 
                        className="stat-item" 
                        onClick={() => navigate('/mygarden/liked-stories')} 
                        style={{ cursor: 'pointer' }}
                    >
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
                                thumbnail={story.thumbnailUrl || story.imageUrl || louisProfile}
                                status={formatStatus(story.status)}
                                title={story.title}
                                date={formatDate(story.createdAt)}
                                views={story.viewCount}
                                likes={story.likeCount}
                                onClick={() => navigate(`/mystories/detail/${story.storyId}`)}
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
                        {notifications.map(mail => {
                            const isExplicitlyUnread = mail.isRead === false;

                            return (
                                <div 
                                    key={mail.notificationId} 
                                    className={isExplicitlyUnread ? "mail-item" : "mail-item-read"} 
                                    onClick={() => navigate(`/mailbox/${mail.notificationId}`)} 
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className={isExplicitlyUnread ? "mail-content" : "mail-content-read"}>
                                        <p className={isExplicitlyUnread ? "mail-title" : "mail-title-read"}>{mail.title}</p>
                                        <p className={isExplicitlyUnread ? "mail-desc" : "mail-desc-read"}>{mail.content}</p>
                                        <p className={isExplicitlyUnread ? "mail-date" : "mail-date-read"}>{formatDate(mail.createdAt)}</p>
                                    </div>
                                    {isExplicitlyUnread && <img src={unreadDot} alt="" className="unread-dot" />}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyGarden;