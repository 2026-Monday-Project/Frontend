import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/common/Navbar';
import Drawer from '@/components/common/Drawer';
import Status from '@/components/myGarden/Status';
import StoryPhotoViewer from '@/components/garden/StoryPhotoViewer';
import currentPicIcon from '@/assets/images/custom/current-pic.svg';
import otherPicIcon from '@/assets/images/custom/other-pic.svg';
import checkedIcon from '@/assets/images/custom/checked.svg';
import uncheckedIcon from '@/assets/images/custom/unchecked-icon.svg';
import micIcon from '@/assets/images/custom/mic.svg';
import phoneIcon from '@/assets/images/custom/phone.svg';
import './MyStoryDetail.css';

const MyStoryDetail = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [story, setStory] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    useEffect(() => {
        const fetchStoryDetail = async () => {
            try {
                const response = await api.get(`/my-garden/stories/${storyId}`);
                setStory(response.data.data);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('accessToken');
                    navigate('/mygarden/unlogged-in');
                } else {
                    console.error(error);
                    alert('사연을 불러오는 중 오류가 발생했습니다.');
                    navigate(-1);
                }
            }
        };

        if (storyId) {
            fetchStoryDetail();
        }
    }, [storyId, navigate]);

    if (!story) return null;

    // 상세 응답의 이미지 표현이 두 가지: images: [{ imageId, imageUrl }] 또는 imageUrls: string[]
    const storyImages = Array.isArray(story.images)
        ? story.images.map((image) => image.imageUrl)
        : Array.isArray(story.imageUrls)
          ? story.imageUrls
          : [];

    const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);
    const handleDrawerClose = () => setIsMenuOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const handleDeleteStory = async () => {
        try {
            await api.delete(`/my-garden/stories/${storyId}`);
            alert('사연이 삭제되었습니다.');
            navigate('/mystories/list', { replace: true });
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('accessToken');
                navigate('/mygarden/unlogged-in');
            } else {
                console.error(error);
                alert('사연 삭제에 실패했습니다.');
            }
        } finally {
            closeDeleteModal();
        }
    };

    const formatStatus = (status) => {
        if (status === 'PENDING') return '검토중';
        if (status === 'PUBLIC') return '공개';
        return '비공개';
    };

    const statusKorean = formatStatus(story.status);

    const onDragStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.type.includes('mouse') ? e.clientX : e.targetTouches[0].clientX);
    };

    const onDragMove = (e) => {
        if (touchStart === null) return;
        setTouchEnd(e.type.includes('mouse') ? e.clientX : e.targetTouches[0].clientX);
    };

    const onDragEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance && currentImageIndex < storyImages.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
        }
        
        if (distance < -minSwipeDistance && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        }
    };

    const onMouseLeave = () => {
        if (touchStart !== null && touchEnd !== null) {
            onDragEnd();
        }
        setTouchStart(null);
        setTouchEnd(null);
    };

    const handleImageClick = () => {
        if (storyImages.length === 0) return;
        if (touchStart !== null && touchEnd !== null) {
            const distance = Math.abs(touchStart - touchEnd);
            if (distance > 10) return;
        }
        setIsPhotoViewerOpen(true);
    };

    const closePhotoViewer = () => {
        setIsPhotoViewerOpen(false);
    };

    const renderBottomButtons = () => {
        if (statusKorean === '검토중') {
            return (
                <div className="bottom-button-area dual-buttons">
                    <button className="btn-delete-half" onClick={openDeleteModal}>삭제</button>
                    <button
                        className="btn-edit-half"
                        onClick={() =>
                            navigate(`/story/edit/${story.storyId}`, {
                                state: { editStory: story },
                            })
                        }
                    >
                        사연 수정하기
                    </button>
                </div>
            );
        }
        return (
            <div className="bottom-button-area single-button">
                <button className="btn-delete-full" onClick={openDeleteModal}>사연 삭제하기</button>
            </div>
        );
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

            <div className="detail-scroll-area">
                <div className="detail-header">
                    <Status
                        type={statusKorean}
                        subText={statusKorean === '검토중' ? ' · 수정가능' : '· 수정불가능'}
                    />
                    <h2 className="detail-title">{story.title}</h2>
                </div>

                {storyImages.length > 0 && (
                    <div 
                        className="detail-image-container" 
                        onClick={handleImageClick}
                        onTouchStart={onDragStart}
                        onTouchMove={onDragMove}
                        onTouchEnd={onDragEnd}
                        onMouseDown={onDragStart}
                        onMouseMove={onDragMove}
                        onMouseUp={onDragEnd}
                        onMouseLeave={onMouseLeave}
                        style={{ cursor: 'pointer' }}
                    >
                        <img 
                            src={storyImages[currentImageIndex]} 
                            alt="사연 이미지" 
                            className="detail-image" 
                            onDragStart={(e) => e.preventDefault()} 
                        />

                        <span className="image-indicator">{currentImageIndex + 1}/{storyImages.length}</span>

                        <div className="image-dots-wrapper">
                            {storyImages.map((_, index) => (
                                <img
                                    key={index}
                                    src={index === currentImageIndex ? currentPicIcon : otherPicIcon}
                                    alt={`indicator-${index}`}
                                    className="dot-icon"
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="detail-body">
                    <p className="detail-text">{story.content}</p>
                    <div className="detail-metrics">
                        <span className="metric">조회 {story.viewCount}</span>
                        <span className="metric-dot">·</span>
                        <span className="metric">공감 {story.likeCount}</span>
                    </div>
                </div>

                <div className="detail-divider"></div>

                <div className="consent-section">
                    <div className="consent-header">
                        <h3 className="consent-title">선택 동의 현황</h3>
                        <span className="consent-desc">이 사연에 적용된 동의 항목</span>
                    </div>
                    <div className="consent-list">
                        <label className="consent-item" style={{ cursor: 'default' }}>
                            <div className="consent-label">
                                <img src={micIcon} alt="" className="consent-icon" />
                                공연 중 소개·낭독 동의
                            </div>
                            <input
                                type="checkbox"
                                name="performance"
                                checked={story.introduceConsent}
                                readOnly
                                className="hidden-checkbox"
                            />
                            <img
                                src={story.introduceConsent ? checkedIcon : uncheckedIcon}
                                alt="동의 체크"
                                className={story.introduceConsent ? 'checked-icon' : 'unchecked-icon'}
                            />
                        </label>

                        <label className="consent-item" style={{ cursor: 'default' }}>
                            <div className="consent-label">
                                <img src={phoneIcon} alt="" className="consent-icon" />
                                SNS·홍보물 활용 동의
                            </div>
                            <input
                                type="checkbox"
                                name="sns"
                                checked={story.snsConsent}
                                readOnly
                                className="hidden-checkbox"
                            />
                            <img
                                src={story.snsConsent ? checkedIcon : uncheckedIcon}
                                alt="동의 체크"
                                className={story.snsConsent ? 'checked-icon' : 'unchecked-icon'}
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
                            <button className="btn-edit-half" onClick={handleDeleteStory}>사연 삭제하기</button>
                        </div>
                    </div>
                </div>
            )}

            {isPhotoViewerOpen && storyImages.length > 0 && (
                <StoryPhotoViewer
                    images={storyImages}
                    currentIndex={currentImageIndex}
                    onChange={setCurrentImageIndex}
                    onClose={closePhotoViewer}
                    title={story.title}
                />
            )}
        </div>
    );
};

export default MyStoryDetail;