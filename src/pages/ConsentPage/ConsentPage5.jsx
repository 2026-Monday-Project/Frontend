import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import mondayProjectLogo from "@/assets/icons/ConsentPage logo.png";
import "@/pages/ConsentPage/ConsentPage.css";

const ConsentPage5 = () => {
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
            SNS·홍보물 활용 동의{" "}
            <span className="consent-page-title-tag">(선택)</span>
          </h1>
        </header>

        <p className="consent-page-intro">
          제출한 사연 또는 사진은 공연 홍보 목적의 콘텐츠에 활용될 수 있습니다.
        </p>

        <div className="consent-page-content">
          <section className="consent-page-card">
            <h2 className="consent-page-card-title">1. 활용 목적</h2>
            <p className="consent-page-card-text">
              공연 홍보, 사연 모집 안내, 공연 후기 콘텐츠, 카드뉴스 및 SNS
              게시물 제작을 위해 활용됩니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">2. 동의 거부 시 불이익</h2>
            <p className="consent-page-card-text">
              동의하지 않아도 사연 제출, 웹사이트 공개, 공연 중 소개 여부에는
              영향을 주지 않습니다. 다만, SNS 및 홍보물에는 사연이 활용되지
              않습니다.
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

export default ConsentPage5;
