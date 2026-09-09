import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import chevronRight from "@/assets/icons/Vector green.png";
import stepIndicator from "@/assets/icons/step-indicator-3.png";
import { createStory, updateStory } from "@/api/storyApi";
import { login } from "@/api/accountApi";
import { useStoryForm } from "@/pages/StoryForm/storyFormContext";
import "@/pages/StoryForm/StoryForm1.css";
import "@/pages/StoryForm/StoryForm3.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";

const REQUIRED_CONSENTS = [
  {
    key: "privacy",
    label: "개인정보 수집·이용 동의 (필수)",
    detailPath: "/story/consent/1",
  },
  {
    key: "content",
    label: "콘텐츠 처리 및 운영정책 확인 (필수)",
    detailPath: "/story/consent/2",
  },
  {
    key: "website",
    label: "웹사이트 공개 동의 (필수)",
    detailPath: "/story/consent/3",
  },
];

const OPTIONAL_CONSENTS = [
  {
    key: "intro",
    label: "공연 중 소개·낭독 동의 (선택)",
    detailPath: "/story/consent/4",
  },
  {
    key: "sns",
    label: "SNS·홍보물 활용 동의 (선택)",
    detailPath: "/story/consent/5",
  },
];

const ConsentList = ({ items, consents, errors = {}, onToggle, onViewDetail }) => (
  <div className="story-form3-consent-list">
    {items.map(({ key, label, detailPath }) => (
      <div className="story-form3-consent-item-wrapper" key={key}>
        <div
          className={`story-form3-consent-item ${errors[key] ? "story-form-input-invalid" : ""}`}
        >
          <label className="story-form3-consent-toggle">
            <input
              className="story-form3-consent-checkbox"
              type="checkbox"
              checked={consents[key]}
              onChange={() => onToggle(key)}
            />

            <span className="story-form3-consent-label">{label}</span>
          </label>

          {detailPath ? (
            <button
              type="button"
              className="story-form3-consent-detail-button"
              onClick={() => onViewDetail(detailPath)}
              aria-label={`${label} 자세히 보기`}
            >
              <img className="story-form3-consent-chevron" src={chevronRight} alt="" />
            </button>
          ) : (
            <img
              className="story-form3-consent-chevron"
              src={chevronRight}
              alt=""
              aria-hidden="true"
            />
          )}
        </div>

        {errors[key] && (
          <p className="story-form-error-message">{errors[key]}</p>
        )}
      </div>
    ))}
  </div>
);

const StoryForm3 = ({ mode }) => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const isEdit = mode === "edit";
  const { info, story, consents, setConsents, reset } = useStoryForm();

  const [errors, setErrors] = useState({
    privacy: "",
    content: "",
    website: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setSubmitError("");
  };

  const handlePrev = () => {
    navigate(-1);
  };

  const handleViewDetail = (detailPath) => {
    navigate(detailPath);
  };

  const handleSubmit = async () => {
    // 이전 단계를 건너뛰고 3단계에 직접 접근한 경우(공유 상태가 비어 있음) 차단
    const infoIncomplete =
      !info.petName?.trim() ||
      !String(info.petAge ?? "").trim() ||
      !info.petType?.trim() ||
      (!isEdit && (!info.nickname?.trim() || !info.email?.trim()));
    const storyIncomplete =
      !story.title?.trim() ||
      !story.content?.trim() ||
      story.photos.length === 0;

    if (infoIncomplete || storyIncomplete) {
      if (isEdit) {
        navigate("/my-garden", { replace: true });
      } else {
        navigate(infoIncomplete ? "/story" : "/story/send/2", {
          replace: true,
        });
      }
      return;
    }

    const newErrors = {
      privacy: consents.privacy ? "" : REQUIRED_MESSAGE,
      content: consents.content ? "" : REQUIRED_MESSAGE,
      website: consents.website ? "" : REQUIRED_MESSAGE,
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    const newImages = story.photos
      .map((photo) => photo.file)
      .filter(Boolean);

    const request = isEdit
      ? {
          petName: info.petName,
          petType: info.petType,
          petAge: Number(info.petAge),
          title: story.title,
          content: story.content,
          keepImageIds: story.photos
            .filter((photo) => photo.imageId != null)
            .map((photo) => photo.imageId),
          introduceConsent: consents.intro,
          snsConsent: consents.sns,
        }
      : {
          nickname: info.nickname,
          email: info.email,
          petName: info.petName,
          petType: info.petType,
          petAge: Number(info.petAge),
          title: story.title,
          content: story.content,
          privacyConsent: consents.privacy,
          contentPolicyConsent: consents.content,
          publicConsent: consents.website,
          introduceConsent: consents.intro,
          snsConsent: consents.sns,
        };

    setSubmitError("");
    setIsSubmitting(true);

    try {
      if (isEdit) {
        await updateStory(storyId, request, newImages);
      } else {
        await createStory(request, newImages);

        // 사연 제출 직후 방금 입력한 이메일로 자동 로그인 → 내 정원 진입 가능하도록 토큰 저장.
        // 로그인이 실패해도 사연은 이미 등록됐으므로 완료 화면으로는 이동한다.
        try {
          const { data } = await login(info.email);
          const token = data?.data?.accessToken;
          if (token) {
            localStorage.setItem("accessToken", token);
          }
        } catch (loginError) {
          console.error("사연 제출 후 자동 로그인 실패:", loginError);
        }
      }

      reset();
      navigate(isEdit ? `/story/edit/${storyId}/complete` : "/story/complete");
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ??
          (isEdit
            ? "사연 수정에 실패했어요. 잠시 후 다시 시도해주세요."
            : "사연 제출에 실패했어요. 잠시 후 다시 시도해주세요."),
      );
    } finally {
      setIsSubmitting(false);
    }
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
            onViewDetail={handleViewDetail}
          />
        </div>

        <div className="story-form3-consent-group">
          <h2 className="story-form3-consent-heading">선택 동의</h2>

          <ConsentList
            items={OPTIONAL_CONSENTS}
            consents={consents}
            onToggle={handleConsentToggle}
            onViewDetail={handleViewDetail}
          />
        </div>

        {submitError && (
          <p className="story-form-error-message">{submitError}</p>
        )}

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
            disabled={isSubmitting}
          >
            {isEdit
              ? isSubmitting
                ? "수정 중..."
                : "수정 완료"
              : isSubmitting
                ? "보내는 중..."
                : "사연 보내기"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default StoryForm3;
