import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import mondayProjectLogo from "@/assets/icons/ConsentPage logo.png";
import "@/pages/ConsentPage/ConsentPage.css";

const ConsentPage4 = () => {
  const navigate = useNavigate();

  const handlePrev = () => {
    navigate(-1);
  };

  return (
    <main className="consent-page">
      <section className="consent-page-container">
        <header className="consent-page-header">
          <button
            className="consent-page-back-button"
            type="button"
            onClick={handlePrev}
            aria-label="이전 페이지로 이동"
          >
            <img className="consent-page-back-icon" src={arrowLeft} alt="" />
          </button>

          <h1 className="consent-page-title">
            공연 중 소개·낭독 동의{" "}
            <span className="consent-page-title-tag">(선택)</span>
          </h1>
        </header>

        <p className="consent-page-intro">
          제출한 사연은 공연 중 일부 소개되거나
          <br />
          낭독될 수 있습니다.
        </p>

        <div className="consent-page-content">
          <section className="consent-page-card">
            <h2 className="consent-page-card-title">1. 활용 목적</h2>
            <p className="consent-page-card-text">
              공연 중 관객 사연 소개, 낭독, 곡 또는 멘트와의 연결을 위해
              활용됩니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">2. 편집 가능성</h2>
            <p className="consent-page-card-text">
              공연 흐름과 시간에 맞게 사연의 일부 문장이 축약되거나 자연스럽게
              편집될 수 있습니다. 단, 사연의 핵심 의미가 왜곡되지 않도록
              주의합니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">3. 동의 거부 시 불이익</h2>
            <p className="consent-page-card-text">
              동의하지 않아도 사연 제출 및 웹사이트 공개에는 영향을 주지
              않습니다. 다만, 공연 중 소개·낭독 대상에서는 제외됩니다.
            </p>
          </section>
        </div>

        <img
          className="consent-page-logo"
          src={mondayProjectLogo}
          alt="Monday Project"
        />
      </section>
    </main>
  );
};

export default ConsentPage4;
