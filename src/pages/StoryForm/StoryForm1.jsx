import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import stepIndicator from "@/assets/icons/step-indicator-1.png";
import "@/pages/StoryForm/StoryForm1.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";

const StoryForm1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    petName: "",
    petAge: "",
    petType: "",
    nickname: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    petName: "",
    petAge: "",
    petType: "",
    nickname: "",
    email: "",
  });

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

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    const newErrors = {
      petName: formData.petName.trim() ? "" : REQUIRED_MESSAGE,
      petAge: formData.petAge.trim() ? "" : REQUIRED_MESSAGE,
      petType: formData.petType.trim() ? "" : REQUIRED_MESSAGE,
      nickname: formData.nickname.trim() ? "" : REQUIRED_MESSAGE,
      email: formData.email.trim() ? "" : REQUIRED_MESSAGE,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    navigate("/story/send/2");
  };

  const handleNicknameCheck = () => {
    // TODO: 닉네임 중복 확인 API 연결
  };

  const handleEmailCheck = () => {
    // TODO: 이메일 중복 확인 API 연결
  };

  return (
    <main className="story-form-page">
      <section className="story-form-container">
        <header className="story-form-header">
          <button
            className="story-form-back-button"
            type="button"
            onClick={handleBack}
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
            alt="1단계 / 총 3단계"
          />
        </div>

        <form className="story-form-content">
          <div className="story-form-group">
            <label className="story-form-label" htmlFor="pet-name">
              반려동물 이름
            </label>

            <input
              className={`story-form-input ${errors.petName ? "story-form-input-invalid" : ""}`}
              id="pet-name"
              name="petName"
              type="text"
              value={formData.petName}
              onChange={handleInputChange}
              placeholder="이름을 입력해주세요."
            />

            {errors.petName && (
              <p className="story-form-error-message">{errors.petName}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="pet-age">
              반려동물 나이
            </label>

            <div className="story-form-age-wrapper">
              <input
                className={`story-form-input ${errors.petAge ? "story-form-input-invalid" : ""}`}
                id="pet-age"
                name="petAge"
                type="number"
                value={formData.petAge}
                onChange={handleInputChange}
                placeholder="나이를 입력해주세요."
              />

              <span className="story-form-age-unit">살</span>
            </div>

            {errors.petAge && (
              <p className="story-form-error-message">{errors.petAge}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="pet-type">
              반려동물 종류
            </label>

            <input
              className={`story-form-input ${errors.petType ? "story-form-input-invalid" : ""}`}
              id="pet-type"
              name="petType"
              type="text"
              value={formData.petType}
              onChange={handleInputChange}
              placeholder="예: 골든리트리버"
            />

            {errors.petType && (
              <p className="story-form-error-message">{errors.petType}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="nickname">
              공개 닉네임
            </label>

            <div className="story-form-input-button-wrapper">
              <input
                className={`story-form-input story-form-input-with-button ${errors.nickname ? "story-form-input-invalid" : ""}`}
                id="nickname"
                name="nickname"
                type="text"
                maxLength={10}
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="10자 이내로 입력해주세요."
              />

              <button
                className="story-form-check-button"
                type="button"
                onClick={handleNicknameCheck}
              >
                중복 확인
              </button>
            </div>

            {errors.nickname && (
              <p className="story-form-error-message">{errors.nickname}</p>
            )}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="email">
              이메일
            </label>

            <div className="story-form-input-button-wrapper">
              <input
                className={`story-form-input story-form-input-with-button ${errors.email ? "story-form-input-invalid" : ""}`}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="나중에 이 이메일로 로그인 해요."
              />

              <button
                className="story-form-check-button"
                type="button"
                onClick={handleEmailCheck}
              >
                중복 확인
              </button>
            </div>

            {errors.email && (
              <p className="story-form-error-message">{errors.email}</p>
            )}
          </div>
        </form>

        <button
          className="story-form-next-button"
          type="button"
          onClick={handleNext}
        >
          다음
        </button>
      </section>
    </main>
  );
};

export default StoryForm1;
