import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import letterImg from '@/assets/images/custom/letter.svg';
import './MailDetail.css';

const MailDetail = () => {
    const navigate = useNavigate();
    const { notificationId } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mailDetail, setMailDetail] = useState(null);

    useEffect(() => {
        const fetchMailDetail = async () => {
            try {
                const response = await api.get(`/my-garden/notifications/${notificationId}`);
                setMailDetail(response.data.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    console.error(error);
                    alert('알림을 불러오는 중 오류가 발생했습니다.');
                    navigate(-1);
                }
            }
        };

        if (notificationId) {
            fetchMailDetail();
        }
    }, [notificationId, navigate]);

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

    if (!mailDetail) return null;

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
                    <h2 className="letter-title">{mailDetail.title}</h2>
                    <p className="letter-date">{formatDate(mailDetail.createdAt)}</p>
                    
                    <p className="letter-text" style={{ whiteSpace: 'pre-wrap' }}>
                        {mailDetail.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MailDetail;