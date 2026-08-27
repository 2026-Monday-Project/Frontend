import { useState } from "react";

import "./PerformanceFaq.css";

const faqList = [
    {
        question: "공연 예매자가 아닌데 사연을 보내도 되나요?",
        answer: (
            <>
                네, 제출 가능합니다!
                <br />
                <br />
                먼데이프로젝트의 관객 참여 이벤트는
                <br />
                예매자 / 비예매자 모두 공모 가능합니다.
            </>
        ),
    },
    {
        question: "보낸 사연은 어떻게 사용되나요?",
        answer: (
            <>
                사연 중 일부는 공연 진행에 사용됩니다!
                <br />
                매기스가든의 일부 사연을 선정하여
                <br />
                사연과 어울리는 곡을 연주할 예정입니다.
                <br />
                <br />
                소개되지 않는 사연도 공연 요소의 일부로서
                <br />
                관객들이 서로 소통할 수 있는 창구로 활용됩니다.
            </>
        ),
    },
    {
        question: "사연을 여러 개 보내도 되나요?",
        answer: (
            <>
                네, 여러 개의 사연도 제출 가능합니다.
                <br />
                <br />
                반려동물과 함께한 순간들을
                <br />
                자유롭게 공유해주세요!
            </>
        ),
    },
    {
        question: "선택 항목에 동의하지 않아도 되나요?",
        answer: (
            <>
                네, 선택 항목 동의 여부와 상관 없이
                <br />
                이벤트 참여가 가능합니다.
                <br />
                다만, 공연 중 소개되는 사연으로 선정되지는 않으니
                <br />
                이 점 참고 부탁드립니다.
            </>
        ),
    },
];

const PerformanceFaq = () => {
    const [openIndexes, setOpenIndexes] = useState([]);

    const handleFaqClick = (index) => {
        setOpenIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((item) => item !== index)
                : [...prev, index],
        );
    };

    return (
        <section className="performance-faq">
            <p className="performance-faq-label">
                F&Q
            </p>

            <h2 className="performance-faq-title">
                자주 묻는 질문
            </h2>

            <div className="performance-faq-list">
                {faqList.map((faq, index) => {
                    const isOpen = openIndexes.includes(index);

                    return (
                        <div
                            key={faq.question}
                            className="performance-faq-item"
                        >
                            <button
                                type="button"
                                className="performance-faq-question"
                                onClick={() => handleFaqClick(index)}
                                aria-expanded={isOpen}
                            >
                                <span>{faq.question}</span>
                                <span
                                    className={`performance-faq-arrow ${
                                        isOpen
                                            ? "performance-faq-arrow-open"
                                            : ""
                                    }`}
                                >
                                    ⌄
                                </span>
                            </button>

                            {isOpen && (
                                <div className="performance-faq-answer">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div
                className="performance-faq-logo"
                aria-hidden="true"
            >
                Monday
                <br />
                Project
            </div>
        </section>
    );
};

export default PerformanceFaq;