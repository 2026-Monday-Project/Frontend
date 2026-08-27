import "./PerformanceDetails.css";

const PerformanceDetails = () => {
    const handleReservationClick = () => {
        window.open(
            "https://www.melon.com/ticket/",
            "_blank",
            "noopener,noreferrer",
        );
    };

    return (
        <>
            <section className="performance-details">
                <p className="performance-details-category">
                    매기스가든 단독콘서트
                </p>

                <h1 className="performance-details-title">
                    pouring love and letters
                </h1>

                <div className="performance-information">
                    <dl className="performance-information-list">
                        <div className="performance-information-row">
                            <dt>일시</dt>
                            <dd>2026.10.15(목) 오후 8시</dd>
                        </div>

                        <div className="performance-information-row">
                            <dt>장소</dt>
                            <dd>살롱문보우</dd>
                        </div>

                        <div className="performance-information-row">
                            <dt>좌석</dt>
                            <dd>전석 지정석 70석</dd>
                        </div>

                        <div className="performance-information-row">
                            <dt>티켓</dt>
                            <dd>44,000원</dd>
                        </div>
                    </dl>

                    <button
                        type="button"
                        className="performance-reservation-button"
                        onClick={handleReservationClick}
                    >
                        멜론티켓에서 예매하기
                    </button>
                </div>
            </section>

            <section className="performance-about">
                <p className="performance-section-label">
                    ABOUT THE SHOW
                </p>

                <h2 className="performance-about-title">
                    매기의 정원에
                    <br />
                    편지가 도착했습니다.
                </h2>

                <p className="performance-about-description">
                    당신의 온 우린 집 정원들이,
                    <br />
                    사랑을 시작합니다.
                    <br />
                    답장은 매기스가든의 노래로 보내드립니다!
                </p>
            </section>

            <section className="performance-song">
                <p className="performance-section-label">
                    MONDAY ONE SONG
                </p>

                <h2 className="performance-song-title">
                    공연 전에 먼저
                    <br />
                    곡을 만나보세요.
                </h2>

                <p className="performance-song-description">
                    매기스가든이 직접 전하는 비하인드 스토리
                </p>

                <div className="performance-song-placeholder">
                    <span>COMING SOON</span>
                    <small>2026.09.27 공개 예정</small>
                </div>
            </section>

            <section className="performance-location">
                <p className="performance-section-label">
                    찾아오시는 길
                </p>
0
                <h2 className="performance-location-title">
                    살롱문보우
                </h2>

                <p className="performance-location-address">
                    서울 마포구 잔다리로 113 지층
                </p>

                <div className="performance-map-placeholder">
                    지도 이미지 영역
                </div>
            </section>
        </>
    );
};

export default PerformanceDetails;