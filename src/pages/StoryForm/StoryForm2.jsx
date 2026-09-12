import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import stepIndicator from "@/assets/icons/step-indicator-2.svg";
import { useStoryForm } from "@/pages/StoryForm/storyFormContext";
import "@/pages/StoryForm/StoryForm1.css";
import "@/pages/StoryForm/StoryForm2.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";
const PHOTO_REQUIRED_MESSAGE = "*사진을 업로드 해주세요.";
const MAX_PHOTOS = 5;
const MAX_CONTENT_LENGTH = 500;

// 백엔드는 허용하지만 크롬/안드로이드에서 렌더링이 잘 안 되는 경우가 있어 HEIC는 프론트에서 막는다.
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const PHOTO_EXTENSION_MESSAGE =
  "*jpg, jpeg, png, gif, webp 형식만 업로드할 수 있어요.";

// 업로드 용량 절감을 위해 긴 변이 이 값을 넘는 이미지는 축소해서 올린다.
const MAX_IMAGE_DIMENSION = 1600;
const RESIZE_JPEG_QUALITY = 0.85;

const getExtension = (fileName) =>
  fileName.includes(".")
    ? fileName.split(".").pop().toLowerCase()
    : "";

// 큰 이미지를 캔버스로 축소해 업로드 용량을 줄인다. (긴 변이 기준값 이하이면 원본 그대로 사용)
// GIF는 캔버스를 거치면 애니메이션이 깨지므로 리사이즈 대상에서 제외한다.
const resizeImageFile = (file) =>
  new Promise((resolve) => {
    if (file.type === "image/gif") {
      resolve(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    const finish = (result) => {
      URL.revokeObjectURL(objectUrl);
      resolve(result);
    };

    image.onload = () => {
      const { width, height } = image;
      const longSide = Math.max(width, height);

      if (longSide <= MAX_IMAGE_DIMENSION) {
        finish(file);
        return;
      }

      const scale = MAX_IMAGE_DIMENSION / longSide;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            finish(file);
            return;
          }

          const resizedName = `${file.name.replace(/\.[^./]+$/, "")}.jpg`;
          finish(new File([blob], resizedName, { type: "image/jpeg" }));
        },
        "image/jpeg",
        RESIZE_JPEG_QUALITY,
      );
    };

    // 디코딩 실패 시 원본 그대로 업로드 시도
    image.onerror = () => finish(file);

    image.src = objectUrl;
  });

const StoryForm2 = ({ mode }) => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const isEdit = mode === "edit";
  const fileInputRef = useRef(null);
  const { story, setStory } = useStoryForm();

  const [formData, setFormData] = useState({
    title: story.title,
    content: story.content,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    photos: "",
  });

  const [photos, setPhotos] = useState(story.photos);
  const [viewerIndex, setViewerIndex] = useState(null);

  const isFormValid =
    formData.title.trim() && formData.content.trim() && photos.length > 0;

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
      photos: photos.length > 0 ? "" : PHOTO_REQUIRED_MESSAGE,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    setStory({
      title: formData.title,
      content: formData.content,
      photos,
    });

    navigate(isEdit ? `/story/edit/${storyId}/3` : "/story/send/3");
  };

  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoThumbClick = (index) => {
    setViewerIndex(index);
  };

  const handlePhotoRemove = (event, index) => {
    event.stopPropagation();

    setPhotos((prev) => {
      const target = prev[index];
      // 새로 추가한 사진(objectURL)만 해제. 기존(수정 진입 시) 사진은 URL을 만든 적이 없다.
      if (target?.file && target.url) {
        URL.revokeObjectURL(target.url);
      }

      const next = prev.filter((_, i) => i !== index);

      // 사진은 작성/수정 모두 필수 항목 → 마지막 한 장을 지우면 즉시 에러를 띄운다.
      setErrors((prevErrors) => ({
        ...prevErrors,
        photos: next.length > 0 ? "" : PHOTO_REQUIRED_MESSAGE,
      }));

      return next;
    });

    setViewerIndex((prev) => {
      if (prev === null) return prev;
      if (prev === index) return null;
      return prev > index ? prev - 1 : prev;
    });
  };

  const handleViewerClose = () => {
    setViewerIndex(null);
  };

  const handlePhotoChange = async (event) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) return;

    const hasUnsupported = files.some(
      (file) => !ALLOWED_EXTENSIONS.includes(getExtension(file.name)),
    );

    const supportedFiles = files.filter((file) =>
      ALLOWED_EXTENSIONS.includes(getExtension(file.name)),
    );

    if (supportedFiles.length === 0) {
      setErrors((prev) => ({ ...prev, photos: PHOTO_EXTENSION_MESSAGE }));
      return;
    }

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToAdd = supportedFiles.slice(0, remainingSlots);
    const resizedFiles = await Promise.all(filesToAdd.map(resizeImageFile));

    const newPhotos = resizedFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    setErrors((prev) => ({
      ...prev,
      photos: hasUnsupported ? PHOTO_EXTENSION_MESSAGE : "",
    }));
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

        <div className="story-form-scroll-area">
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

            <div
              className={`story-form2-textarea-wrapper ${errors.content ? "story-form-input-invalid" : ""}`}
            >
              <textarea
                className="story-form2-textarea"
                id="story-content"
                name="content"
                maxLength={MAX_CONTENT_LENGTH}
                value={formData.content}
                onChange={handleInputChange}
                placeholder="내용을 입력해주세요."
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
                <div className="story-form2-photo-thumb-wrapper" key={photo.id}>
                  <button
                    type="button"
                    className="story-form2-photo-thumb"
                    onClick={() => handlePhotoThumbClick(index)}
                    aria-label={`${index + 1}번째 사진 자세히 보기`}
                  >
                    <img src={photo.url} alt="" />
                  </button>

                  <button
                    type="button"
                    className="story-form2-photo-remove-button"
                    onClick={(event) => handlePhotoRemove(event, index)}
                    aria-label={`${index + 1}번째 사진 삭제`}
                  >
                    <svg
                      className="story-form2-photo-remove-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6l12 12M18 6L6 18"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {photos.length < MAX_PHOTOS && (
                <button
                  type="button"
                  className={`story-form2-photo-add-button ${errors.photos ? "story-form-input-invalid" : ""}`}
                  onClick={handlePhotoButtonClick}
                  aria-label="사진 추가"
                >
                  <svg
                    className="story-form2-photo-add-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {errors.photos && (
              <p className="story-form-error-message">{errors.photos}</p>
            )}

            <input
              ref={fileInputRef}
              className="story-form2-photo-input"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handlePhotoChange}
            />
          </div>
        </form>
        </div>

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
            className={`story-form2-next-button ${isFormValid ? "is-valid" : ""}`}
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
