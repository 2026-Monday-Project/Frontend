import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import mondayProjectLogo from "@/assets/icons/ConsentPage logo.png";
import "@/pages/ConsentPage/ConsentPage.css";

const ConsentPage1 = () => {
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

          <h1 className="consent-page-title">개인정보 수집·이용 동의 (필수)</h1>
        </header>

        <p className="consent-page-intro">
          먼데이프로젝트는 관객 사연 접수 및 운영을 위해 아래와 같이
          개인정보를 수집·이용합니다.
        </p>

        <div className="consent-page-content">
          <section className="consent-page-card">
            <h2 className="consent-page-card-title">1. 수집·이용 목적</h2>
            <p className="consent-page-card-text">
              사연 접수, 운영진 검토, 사연 공개 여부 안내, 공연 관련 안내,
              문의 대응을 위해 개인정보를 수집·이용합니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">2. 수집 항목</h2>
            <p className="consent-page-card-text">
              공개 닉네임, 이메일, 반려동물 이름, 반려동물 종류, 반려동물
              나이, 함께한 기간, 사연 제목, 사연 내용, 첨부 사진
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">3. 보유 및 이용 기간</h2>
            <p className="consent-page-card-text">
              수집된 개인정보는 공연 종료 후 3개월까지 보관하며, 이후 지체
              없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우 해당
              기간 동안 보관할 수 있습니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">
              4. 동의 거부 권리 및 불이익
            </h2>
            <p className="consent-page-card-text">
              귀하는 개인정보 수집·이용에 동의하지 않을 권리가 있습니다.
              다만, 필수 항목에 동의하지 않을 경우 사연 제출이 제한될 수
              있습니다.
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

export default ConsentPage1;
