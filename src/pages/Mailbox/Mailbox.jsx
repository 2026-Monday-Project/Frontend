import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import mailboxImg from '@/assets/images/custom/mailbox.svg';
import grassesImg from '@/assets/images/custom/grasses.svg';
import unreadDot from '@/assets/images/custom/unread-dot.svg';
import './Mailbox.css';

const Mailbox = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
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
                <div className="mailbox-banner">
                </div>
                <div className="mail-list">
                    <div className="mail-item">
                        <div className="mail-content">
                            <p className="mail-title">당신의 이야기가 정원에 도착했어요.</p>
                            <p className="mail-desc">운영팀 검수 후 공개여부와 상태를 내 정원에서 확인할 수...</p>
                            <p className="mail-date">2026.07.05</p>
                        </div>
                        <img src={unreadDot} alt="" className="unread-dot" />
                    </div>
                    <div className="mail-item-read">
                        <div className="mail-content-read">
                            <p className="mail-title-read">정원에 오신 것을 환영합니다.</p>
                            <p className="mail-desc-read">따뜻한 이야기를 함께 나눠보세요.</p>
                            <p className="mail-date-read">2026.07.01</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mailbox;