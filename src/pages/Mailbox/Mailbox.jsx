import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import mailboxImg from '@/assets/images/custom/mailbox.svg';
import grassesImg from '@/assets/images/custom/grasses.svg';
import unreadDot from '@/assets/images/custom/unread-dot.svg';
import './Mailbox.css';

const Mailbox = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/my-garden/notifications');
                const fetchedContent = response.data?.data?.content;
                setNotifications(Array.isArray(fetchedContent) ? fetchedContent : []);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    console.error(error);
                    setNotifications([]);
                }
            }
        };

        fetchNotifications();
    }, [navigate]);

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

    return (
        <div className="mailbox-page">
            <img src={grassesImg} alt="" className="grasses-bottom" />
            <Navbar 
                title="편지함"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />
            <img src={mailboxImg} alt="우체통" className="mailbox-image" />
            <div className="mailbox-container">
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
            </div>
        </div>
    );
};

export default Mailbox;