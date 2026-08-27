import { useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import chevronRight from "@/assets/icons/Vector green.png";
import stepIndicator from "@/assets/icons/step-indicator-3.png";
import "@/pages/StoryForm/StoryForm1.css";
import "@/pages/StoryForm/StoryForm3.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";

const REQUIRED_CONSENTS = [
  { key: "privacy", label: "개인정보 수집·이용 동의 (필수)" },
  { key: "content", label: "콘텐츠 처리 및 운영정책 확인 (필수)" },
  { key: "website", label: "웹사이트 공개 동의 (필수)" },
];

const OPTIONAL_CONSENTS = [
  { key: "intro", label: "공연 중 소개·낭독 동의 (선택)" },
  { key: "sns", label: "SNS·홍보물 활용 동의 (선택)" },
];

const ConsentList = ({ items, consents, errors = {}, onToggle }) => (
  <div className="story-form3-consent-list">
    {items.map(({ key, label }) => (
      <div className="story-form3-consent-item-wrapper" key={key}>
        <label
          className={`story-form3-consent-item ${errors[key] ? "story-form-input-invalid" : ""}`}
        >
          <input
            className="story-form3-consent-checkbox"
            type="checkbox"
            checked={consents[key]}
            onChange={() => onToggle(key)}
          />

          <span className="story-form3-consent-label">{label}</span>

          <img
            className="story-form3-consent-chevron"
            src={chevronRight}
            alt=""
          />
        </label>

        {errors[key] && (
          <p className="story-form-error-message">{errors[key]}</p>
        )}
      </div>
    ))}
  </div>
);

const StoryForm3 = () => {
  const navigate = useNavigate();

  const [consents, setConsents] = useState({
    privacy: false,
    content: false,
    website: false,
    intro: false,
    sns: false,
  });

  const [errors, setErrors] = useState({
    privacy: "",
    content: "",
    website: "",
  });

  const isAllRequiredChecked = REQUIRED_CONSENTS.every(
    ({ key }) => consents[key],
  );

  const handleConsentToggle = (key) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handlePrev = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    const newErrors = {
      privacy: consents.privacy ? "" : REQUIRED_MESSAGE,
      content: consents.content ? "" : REQUIRED_MESSAGE,
      website: consents.website ? "" : REQUIRED_MESSAGE,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    // TODO: 사연 제출 API 연결
  };

  return (
    <main className="story-form-page">
      <section className="story-form-container story-form3-container">
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
            alt="3단계 / 총 3단계"
          />
        </div>

        <div className="story-form3-consent-group">
          <h2 className="story-form3-consent-heading">필수 동의</h2>

          <ConsentList
            items={REQUIRED_CONSENTS}
            consents={consents}
            errors={errors}
            onToggle={handleConsentToggle}
          />
        </div>

        <div className="story-form3-consent-group">
          <h2 className="story-form3-consent-heading">선택 동의</h2>

          <ConsentList
            items={OPTIONAL_CONSENTS}
            consents={consents}
            onToggle={handleConsentToggle}
          />
        </div>

        <div className="story-form3-footer">
          <button
            type="button"
            className="story-form3-prev-button"
            onClick={handlePrev}
          >
            이전
          </button>

          <button
            type="button"
            className={`story-form3-submit-button ${isAllRequiredChecked ? "is-valid" : ""}`}
            onClick={handleSubmit}
          >
            사연 보내기
          </button>
        </div>
      </section>
    </main>
  );
};

export default StoryForm3;
