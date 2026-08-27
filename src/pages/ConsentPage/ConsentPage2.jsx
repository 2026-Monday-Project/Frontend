import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import mondayProjectLogo from "@/assets/icons/ConsentPage logo.png";
import "@/pages/ConsentPage/ConsentPage.css";

const ConsentPage2 = () => {
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

          <h1 className="consent-page-title">콘텐츠 처리 및 운영정책 확인 (필수)</h1>
        </header>

        <p className="consent-page-intro">
          먼데이프로젝트는 안전한 사연 공간 운영을 위해 제출된 콘텐츠를 아래
          기준에 따라 검토합니다.
        </p>

        <div className="consent-page-content">
          <section className="consent-page-card">
            <h2 className="consent-page-card-title">1. 콘텐츠 처리 목적</h2>
            <p className="consent-page-card-text">
              사연 게시 공간의 안전한 운영, 부적절한 콘텐츠 방지, 공연 취지에
              맞는 사연 관리를 위해 제출된 내용을 확인합니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">
              2. 비공개 또는 삭제될 수 있는 내용
            </h2>
            <p className="consent-page-card-text">
              다음에 해당하는 내용은 운영진 검토 후 비공개 처리되거나 삭제될 수
              있습니다.
            </p>
            <ul className="consent-page-card-list">
              <li>욕설, 비방, 혐오 표현</li>
              <li>광고성 또는 홍보성 내용</li>
              <li>연락처, 주소 등 개인정보가 포함된 내용</li>
              <li>타인의 권리나 저작권을 침해하는 내용</li>
              <li>공연 및 사연 모집 취지와 맞지 않는 내용</li>
            </ul>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">3. 운영 방식</h2>
            <p className="consent-page-card-text">
              제출된 사연은 즉시 공개되지 않으며, 운영진 검토 후 공개 여부가
              결정됩니다. 검토 결과에 따라 일부 문구가 수정 요청되거나 비공개
              처리될 수 있습니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">
              4. 동의 거부 권리 및 불이익
            </h2>
            <p className="consent-page-card-text">
              본 운영정책 확인에 동의하지 않을 경우 사연 제출이 제한될 수
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

export default ConsentPage2;
