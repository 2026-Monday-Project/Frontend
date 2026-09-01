import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import Status from '@/components/myGarden/Status';
import puppyRunningImg from '@/assets/images/custom/puppy-running.svg';
import prevPicIcon from '@/assets/images/custom/prev-pic.svg';
import nextPicIcon from '@/assets/images/custom/next-pic.svg';
import currentPicIcon from '@/assets/images/custom/current-pic.svg';
import otherPicIcon from '@/assets/images/custom/other-pic.svg';
import checkedIcon from '@/assets/images/custom/checked.svg';
import uncheckedIcon from '@/assets/images/custom/unchecked-icon.svg';
import micIcon from '@/assets/images/custom/mic.svg';
import phoneIcon from '@/assets/images/custom/phone.svg';
import './MyStoryDetail.css';

const MyStoryDetail = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [status, setStatus] = useState('검토중');

    const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);
    const handleDrawerClose = () => setIsMenuOpen(false);

    const [consents, setConsents] = useState({
        performance: true,
        sns: true
    });

    const handleConsentChange = (e) => {
        const { name, checked } = e.target;
        setConsents(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const renderBottomButtons = () => {
        if (status === '검토중') {
            return (
                <div className="bottom-button-area dual-buttons">
                    <button className="btn-delete-half" onClick={openDeleteModal}>삭제</button>
                    <button className="btn-edit-half">사연 수정하기</button>
                </div>
            );
        }
        return (
            <div className="bottom-button-area single-button">
                <button className="btn-delete-full" onClick={openDeleteModal}>사연 삭제하기</button>
            </div>
        );
    };

    const handleStatusToggle = () => {
        if (status === '검토중') setStatus('공개');
        else if (status === '공개') setStatus('비공개');
        else setStatus('검토중');
    };

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const mockImages = [puppyRunningImg, puppyRunningImg, puppyRunningImg];

    const handlePrevClick = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const handleNextClick = () => {
        if (currentImageIndex < mockImages.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
    };

    return (
        <div className="my-story-detail-page">
            <Navbar
                title="내 사연"
                showBackButton={true}
                onBack={() => navigate(-1)}
                showMenuButton={true}
                isMenuOpen={isMenuOpen}
                onMenuClick={handleMenuClick}
            />
            <Drawer isOpen={isMenuOpen} onClose={handleDrawerClose} />

            <button
                onClick={handleStatusToggle}
                style={{ padding: '8px', background: '#333', color: '#fff', fontSize: '12px' }}
            >
                현재 상태: {status} (클릭해서 변경 테스트 - 백엔드 연동 시 삭제 예정)
            </button>

            <div className="detail-scroll-area">
                <div className="detail-header">
                    <Status
                        type={status}
                        subText={status === '검토중' ? ' · 수정가능' : '· 수정불가능'}
                    />
                    <h2 className="detail-title">산책 한마디에 대소동</h2>
                </div>

                <div className="detail-image-container">
                    <img src={mockImages[currentImageIndex]} alt="사연 이미지" className="detail-image" />

                    <span className="image-indicator">{currentImageIndex + 1}/{mockImages.length}</span>

                    {mockImages.length > 1 && currentImageIndex > 0 && (
                        <img
                            src={prevPicIcon}
                            alt="이전 사진"
                            className="nav-arrow prev-arrow"
                            onClick={handlePrevClick}
                        />
                    )}

                    {mockImages.length > 1 && currentImageIndex < mockImages.length - 1 && (
                        <img
                            src={nextPicIcon}
                            alt="다음 사진"
                            className="nav-arrow next-arrow"
                            onClick={handleNextClick}
                        />
                    )}
                    <span className="image-indicator">{currentImageIndex + 1}/{mockImages.length}</span>

                    <div className="image-dots-wrapper">
                        {mockImages.map((_, index) => (
                            <img
                                key={index}
                                src={index === currentImageIndex ? currentPicIcon : otherPicIcon}
                                alt={`indicator-${index}`}
                                className="dot-icon"
                            />
                        ))}
                    </div>
                </div>

                <div className="detail-body">
                    <p className="detail-text">
                        '산책 가자' 한마디만 들으면 자다가도 벌떡 일어나요. 리드줄을 꺼내는 소리만 나도 현관을 전력 질주하고, 제가 신발을 신기도 전에 빙글빙글 돌며 꼬리를 흔들어요. 너무 신난 나머지 제 신발 한 짝을 물고 도망간 적도 있어요. 매번 정신없지만 그 모습 때문에 꼭 웃게 되어요.
                    </p>
                    <div className="detail-metrics">
                        <span className="metric">조회 123</span>
                        <span className="metric-dot">·</span>
                        <span className="metric">공감 12</span>
                    </div>
                </div>

                <div className="detail-divider"></div>

                <div className="consent-section">
                    <div className="consent-header">
                        <h3 className="consent-title">선택 동의 현황</h3>
                        <span className="consent-desc">이 사연에 적용된 동의 항목</span>
                    </div>
                    <div className="consent-list">
                        <label className="consent-item">
                            <div className="consent-label">
                                <img src={micIcon} alt="" className="consent-icon" />
                                공연 중 소개·낭독 동의
                            </div>
                            <input
                                type="checkbox"
                                name="performance"
                                checked={consents.performance}
                                onChange={handleConsentChange}
                                className="hidden-checkbox"
                            />
                            <img
                                src={consents.performance ? checkedIcon : uncheckedIcon}
                                alt="동의 체크"
                                className={consents.performance ? 'checked-icon' : 'unchecked-icon'}
                            />
                        </label>

                        <label className="consent-item">
                            <div className="consent-label">
                                <img src={phoneIcon} alt="" className="consent-icon" />
                                SNS·홍보물 활용 동의
                            </div>
                            <input
                                type="checkbox"
                                name="sns"
                                checked={consents.sns}
                                onChange={handleConsentChange}
                                className="hidden-checkbox"
                            />
                            <img
                                src={consents.sns ? checkedIcon : uncheckedIcon}
                                alt="동의 체크"
                                className={consents.sns ? 'checked-icon' : 'unchecked-icon'}
                            />
                        </label>
                    </div>
                </div>
                {renderBottomButtons()}
            </div>

            {isDeleteModalOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-handle"></div>
                        <h3 className="modal-title">사연을 정말 삭제할까요?</h3>
                        <p className="modal-desc">삭제된 사연은 다시 복구할 수 없어요.</p>

                        <div className="modal-button-area">
                            <button className="btn-delete-half" onClick={closeDeleteModal}>취소</button>
                            <button className="btn-edit-half">사연 삭제하기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyStoryDetail;