import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import stepIndicator from "@/assets/icons/step-indicator-2.png";
import "@/pages/StoryForm/StoryForm1.css";
import "@/pages/StoryForm/StoryForm2.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";
const MAX_PHOTOS = 5;
const MAX_CONTENT_LENGTH = 500;

const StoryForm2 = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const photosRef = useRef([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [photos, setPhotos] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(null);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, []);

  useEffect(() => {
    if (viewerIndex === null) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [viewerIndex]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handlePrev = () => {
    navigate(-1);
  };

  const handleNext = () => {
    const newErrors = {
      title: formData.title.trim() ? "" : REQUIRED_MESSAGE,
      content: formData.content.trim() ? "" : REQUIRED_MESSAGE,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    navigate("/story/send/3");
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoThumbClick = (index) => {
    setViewerIndex(index);
  };

  const handleViewerClose = () => {
    setViewerIndex(null);
  };

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const newPhotos = files.slice(0, remainingSlots).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  return (
    <main className="story-form-page">
      <section className="story-form-container story-form2-container">
        <header className="story-form-header">
          <button
            className="story-form-back-button"
            type="button"
            onClick={handlePrev}
            aria-label="이전 페이지로 이동"
          >
            <img className="story-form-back-icon" src={arrowLeft} alt="" />
          </button>

          <h1 className="story-form-title">우리 이야기 보내기</h1>
        </header>

        <div className="story-form-step">
          <img
            className="story-form-step-image"
            src={stepIndicator}
            alt="2단계 / 총 3단계"
          />
        </div>

        <form className="story-form-content">
          <div className="story-form-group">
            <label className="story-form-label" htmlFor="story-title">
              사연 제목
            </label>

            <input
              className={`story-form-input ${errors.title ? "story-form-input-invalid" : ""}`}
              id="story-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="제목을 입력해주세요."
            />

            {errors.title && (
              <p className="story-form-error-message">{errors.title}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="story-content">
              사연 본문
            </label>

            <div className="story-form2-textarea-wrapper">
              <textarea
                className={`story-form2-textarea ${errors.content ? "story-form-input-invalid" : ""}`}
                id="story-content"
                name="content"
                maxLength={MAX_CONTENT_LENGTH}
                value={formData.content}
                onChange={handleInputChange}
                placeholder="반려동물과의 이야기를 들려주세요."
              />

              <span className="story-form2-textarea-count">
                {formData.content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>

            {errors.content && (
              <p className="story-form-error-message">{errors.content}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label">
              사진 업로드(최대 {MAX_PHOTOS}장)
            </label>

            <div className="story-form2-photo-grid">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  className="story-form2-photo-thumb"
                  key={photo.id}
                  onClick={() => handlePhotoThumbClick(index)}
                  aria-label={`${index + 1}번째 사진 자세히 보기`}
                >
                  <img src={photo.url} alt="" />
                </button>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className="story-form2-photo-add-button"
                  onClick={handlePhotoButtonClick}
                  aria-label="사진 추가"
                >
                  +
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              className="story-form2-photo-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
            />
          </div>
        </form>

        <div className="story-form2-footer">
          <button
            type="button"
            className="story-form2-prev-button"
            onClick={handlePrev}
          >
            이전
          </button>

          <button
            type="button"
            className="story-form2-next-button"
            onClick={handleNext}
          >
            다음
          </button>
        </div>

        {viewerIndex !== null && (
          <div className="story-photo-viewer">
            <header className="story-photo-viewer-header">
              <button
                type="button"
                className="story-photo-viewer-back"
                onClick={handleViewerClose}
                aria-label="사진 자세히 보기 닫기"
              >
                <img className="story-form-back-icon" src={arrowLeft} alt="" />
              </button>

              <span className="story-photo-viewer-count">
                {viewerIndex + 1}/{photos.length}
              </span>
            </header>

            <div className="story-photo-viewer-main">
              <img src={photos[viewerIndex].url} alt="" />
            </div>

            <div className="story-photo-viewer-thumbs">
              {photos.map((photo, index) => (
                <button
                  type="button"
                  key={photo.id}
                  className={`story-photo-viewer-thumb ${
                    index === viewerIndex ? "is-active" : ""
                  }`}
                  onClick={() => setViewerIndex(index)}
                  aria-label={`${index + 1}번째 사진 선택`}
                  aria-pressed={index === viewerIndex}
                >
                  <img src={photo.url} alt="" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default StoryForm2;
