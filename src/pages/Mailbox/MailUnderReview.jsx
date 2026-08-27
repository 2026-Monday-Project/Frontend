import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import letterImg from '@/assets/images/custom/letter.svg';
import './MailDetail.css';

const MailUnderReview = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="mail-detail-page">
            <Navbar 
                title="편지함"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />
            
            <div className="letter-wrapper">
                <img src={letterImg} alt="편지 배경" className="letter-bg" />
                
                <div className="letter-content">
                    <h2 className="letter-title">당신의 이야기가 정원에 도착했어요.</h2>
                    <p className="letter-date">2026.07.09</p>
                    
                    
                    <p className="letter-text">
                        운영팀 검수 후 공개 여부와 상태를 내 정원에서 확인 할 수 있어요.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MailUnderReview;