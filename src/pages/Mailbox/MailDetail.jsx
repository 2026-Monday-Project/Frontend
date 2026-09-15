import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";
import Navbar from "@/components/common/Navbar";
import Drawer from "@/components/common/Drawer";

import letterBackground from "@/assets/images/custom/letter-background.svg";
import letterOnly from "@/assets/images/custom/letter-only.svg";
import letterDivider from "@/assets/images/custom/letter-divider.svg";
import letterDividerLeaf from "@/assets/images/custom/letter-divider-leaf.svg";
import letterEnvelope from "@/assets/images/custom/letter-envelope.svg";

import "./MailDetail.css";

const MailDetail = () => {
    const navigate = useNavigate();
    const { notificationId } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mailDetail, setMailDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMailDetail = async () => {
            try {
                const response = await api.get(`/my-garden/notifications/${notificationId}`);
                setMailDetail(response.data.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("accessToken");
                    navigate("/mygarden/unlogged-in");
                } else {
                    window.alert("알림을 불러오는 중 오류가 발생했습니다.");
                    navigate(-1);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (notificationId) {
            fetchMailDetail();
        }
    }, [notificationId, navigate]);

    const handleMenuClick = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleDrawerClose = () => {
        setIsMenuOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}.${month}.${day}`;
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

            {isLoading ? (
                <div className="mail-detail-loading">
                    <p>알림을 불러오는 중입니다...</p>
                </div>
            ) : mailDetail ? (
                <div 
                    className="mail-scroll-area"
                    style={{ backgroundImage: `url(${letterBackground})` }}
                >
                    <div className="mail-content-wrapper">
                        <div className="mail-inner-content">
                            <img src={letterOnly} alt="편지지 아이콘" className="mail-icon" />
                            
                            <h2 className="mail-detail-title">{mailDetail.title}</h2>
                            <p className="mail-detail-date">{formatDate(mailDetail.createdAt)}</p>
                            
                            <img src={letterDivider} alt="구분선" className="mail-divider" />
                            
                            <p className="mail-detail-text">{mailDetail.content}</p>
                        </div>    
                        
                        <div className="mail-envelope-wrapper">
                            <img src={letterDividerLeaf} alt="나뭇잎 구분선" className="mail-divider-leaf" />
                            <img src={letterEnvelope} alt="편지 봉투 하단" className="mail-envelope-bottom" />
                        </div>
                        
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default MailDetail;