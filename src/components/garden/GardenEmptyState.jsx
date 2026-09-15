import emptyStateImage from "@/assets/images/custom/garden-empty-state.png";
import emptyStateDivider from "@/assets/images/custom/empty-state-divider.svg";
import "./GardenEmptyState.css";

const GardenEmptyState = ({
    title = "아직 등록된 사연이 없어요.",
    subtitle = "가장 먼저 우리 이야기를 들려주세요.",
    guide = "보내주신 사연은 정원에 차곡차곡 쌓여요."
}) => {
    return (
        <div className="garden-empty-state">
            <img
                className="garden-empty-state-image"
                src={emptyStateImage}
                alt=""
                aria-hidden="true"
            />

            <div className="garden-empty-state-copy">
                <p className="garden-empty-state-title">{title}</p>
                {subtitle && (
                    <p className="garden-empty-state-subtitle">{subtitle}</p>
                )}
            </div>

            {/* 👇 74px 투명 여백을 15px로 잘라낼 강제 크롭 래퍼 */}
            <div className={`garden-empty-state-divider-crop ${!subtitle ? "no-subtitle" : ""}`}>
                <img src={emptyStateDivider} alt="" aria-hidden="true" />
            </div>
            
            <p className="garden-empty-state-guide-text">{guide}</p>
        </div>
    );
};

export default GardenEmptyState;