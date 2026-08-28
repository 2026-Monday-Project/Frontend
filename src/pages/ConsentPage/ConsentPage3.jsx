import { useNavigate } from "react-router-dom";
import arrowLeft from "@/assets/icons/arrow-left.png";
import mondayProjectLogo from "@/assets/icons/ConsentPage logo.png";
import "@/pages/ConsentPage/ConsentPage.css";

const ConsentPage3 = () => {
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
            웹사이트 공개 동의{" "}
            <span className="consent-page-title-tag">(필수)</span>
          </h1>
        </header>

        <p className="consent-page-intro">
          먼데이프로젝트는 제출된 사연을 웹사이트에 공개하기 위해 아래와 같이
          공개 위치와 범위를 안내합니다.
        </p>

        <div className="consent-page-content">
          <section className="consent-page-card">
            <h2 className="consent-page-card-title">1. 공개 위치</h2>
            <p className="consent-page-card-text">
              먼데이프로젝트 웹사이트 내 ‘정원 둘러보기’ 페이지
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">2. 공개되는 정보</h2>
            <p className="consent-page-card-text">
              공개 닉네임, 반려동물 이름, 반려동물 종류, 반려동물 나이, 사연
              제목, 사연 내용, 첨부 사진
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">3. 공개 목적</h2>
            <p className="consent-page-card-text">
              다른 관객이 사연을 읽고 공감할 수 있도록 하며, 공연 전 관객
              참여형 콘텐츠 공간을 운영하기 위함입니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">4. 공개 기간 / 철회 안내</h2>
            <p className="consent-page-card-text">
              공개된 사연은 공연 종료 후 3개월까지 게시될 수 있으며, 사연 공개
              후에도 운영진에게 비공개 또는 삭제를 요청할 수 있습니다. 다만, 이미
              공연 운영 또는 홍보물 제작에 활용된 경우 즉시 반영이 어려울 수
              있습니다.
            </p>
          </section>

          <section className="consent-page-card">
            <h2 className="consent-page-card-title">
              5. 동의 거부 권리 및 불이익
            </h2>
            <p className="consent-page-card-text">
              본 웹사이트 공개에 동의하지 않을 경우 사연 제출이 제한될 수
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

export default ConsentPage3;
