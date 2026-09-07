import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import stepIndicator from "@/assets/icons/step-indicator-1.png";
import { checkEmailAvailable, checkNicknameAvailable } from "@/api/accountApi";
import { useStoryForm } from "@/pages/StoryForm/storyFormContext";
import "@/pages/StoryForm/StoryForm1.css";

const REQUIRED_MESSAGE = "*필수 항목입니다.";

const EMPTY_DATA = {
  petName: "",
  petAge: "",
  petType: "",
  nickname: "",
  email: "",
};

const StoryForm1 = ({ mode }) => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const isEdit = mode === "edit";
  const { info, setInfo } = useStoryForm();

  const [formData, setFormData] = useState({ ...EMPTY_DATA, ...info });

  // 중복 확인 응답이 도착했을 때 입력값이 그새 바뀌었는지 판별하기 위한 최신값 참조
  const latestFormDataRef = useRef(formData);
  useEffect(() => {
    latestFormDataRef.current = formData;
  }, [formData]);

  const [errors, setErrors] = useState({
    petName: "",
    petAge: "",
    petType: "",
    nickname: "",
    email: "",
  });

  const [emailSuccessMessage, setEmailSuccessMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState("");
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const isReadyForNext =
    formData.petName.trim() &&
    formData.petAge.trim() &&
    formData.petType.trim() &&
    (isEdit || (isNicknameChecked && isEmailChecked));

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

    if (name === "email") {
      setEmailSuccessMessage("");
      setIsEmailChecked(false);
    }

    if (name === "nickname") {
      setNicknameSuccessMessage("");
      setIsNicknameChecked(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    const newErrors = {
      petName: formData.petName.trim() ? "" : REQUIRED_MESSAGE,
      petAge: formData.petAge.trim() ? "" : REQUIRED_MESSAGE,
      petType: formData.petType.trim() ? "" : REQUIRED_MESSAGE,
      nickname: isEdit || formData.nickname.trim() ? "" : REQUIRED_MESSAGE,
      email: isEdit || formData.email.trim() ? "" : REQUIRED_MESSAGE,
    };

    if (!isEdit) {
      if (!newErrors.nickname && !isNicknameChecked) {
        newErrors.nickname = "*닉네임 중복 확인을 해주세요.";
      }
      if (!newErrors.email && !isEmailChecked) {
        newErrors.email = "*이메일 중복 확인을 해주세요.";
      }
    }

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((message) => message);
    if (hasError) return;

    setInfo(formData);

    navigate(isEdit ? `/story/edit/${storyId}/2` : "/story/send/2");
  };

  const handleNicknameCheck = async () => {
    const nickname = formData.nickname.trim();

    if (!nickname) {
      setNicknameSuccessMessage("");
      setErrors((prev) => ({ ...prev, nickname: "*닉네임을 입력해주세요." }));
      return;
    }

    setIsCheckingNickname(true);

    try {
      const { data } = await checkNicknameAvailable(nickname);

      if (nickname !== latestFormDataRef.current.nickname.trim()) return;

      if (data.data.available) {
        setErrors((prev) => ({ ...prev, nickname: "" }));
        setNicknameSuccessMessage("사용 가능한 닉네임이에요.");
        setIsNicknameChecked(true);
      } else {
        setNicknameSuccessMessage("");
        setIsNicknameChecked(false);
        setErrors((prev) => ({
          ...prev,
          nickname: "이미 사용 중인 닉네임이에요.",
        }));
      }
    } catch (error) {
      if (nickname !== latestFormDataRef.current.nickname.trim()) return;

      setNicknameSuccessMessage("");
      setIsNicknameChecked(false);
      setErrors((prev) => ({
        ...prev,
        nickname: error.response?.data?.message ?? "잠시 후 다시 시도해주세요.",
      }));
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleEmailCheck = async () => {
    const email = formData.email.trim();

    if (!email) {
      setEmailSuccessMessage("");
      setErrors((prev) => ({ ...prev, email: "*이메일을 입력해주세요." }));
      return;
    }

    setIsCheckingEmail(true);

    try {
      const { data } = await checkEmailAvailable(email);

      if (email !== latestFormDataRef.current.email.trim()) return;

      if (data.data.available) {
        setErrors((prev) => ({ ...prev, email: "" }));
        setEmailSuccessMessage("사용 가능한 이메일이에요.");
        setIsEmailChecked(true);
      } else {
        setEmailSuccessMessage("");
        setIsEmailChecked(false);
        setErrors((prev) => ({ ...prev, email: "이미 사용 중인 이메일이에요." }));
      }
    } catch (error) {
      if (email !== latestFormDataRef.current.email.trim()) return;

      setEmailSuccessMessage("");
      setIsEmailChecked(false);
      setErrors((prev) => ({
        ...prev,
        email: error.response?.data?.message ?? "잠시 후 다시 시도해주세요.",
      }));
    } finally {
      setIsCheckingEmail(false);
    }
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

            {isEdit ? (
              <input
                className="story-form-input"
                id="nickname"
                name="nickname"
                type="text"
                value={formData.nickname}
                disabled
              />
            ) : (
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
                  disabled={isCheckingNickname}
                >
                  중복 확인
                </button>
              </div>
            )}

            {isEdit ? (
              <p className="story-form-hint">
                닉네임은 설정에서 변경할 수 있어요.
              </p>
            ) : errors.nickname ? (
              <p className="story-form-error-message">{errors.nickname}</p>
            ) : nicknameSuccessMessage ? (
              <p className="story-form-success-message">
                {nicknameSuccessMessage}
              </p>
            ) : null}
          </div>

          <div className="story-form-group">
            <label className="story-form-label" htmlFor="email">
              이메일
            </label>

            {isEdit ? (
              <input
                className="story-form-input"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
              />
            ) : (
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
                  disabled={isCheckingEmail}
                >
                  중복 확인
                </button>
              </div>
            )}

            {isEdit ? (
              <p className="story-form-hint">이메일은 수정할 수 없어요.</p>
            ) : errors.email ? (
              <p className="story-form-error-message">{errors.email}</p>
            ) : emailSuccessMessage ? (
              <p className="story-form-success-message">{emailSuccessMessage}</p>
            ) : null}
          </div>
        </form>

        <button
          className={`story-form-next-button ${isReadyForNext ? "is-valid" : ""}`}
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
