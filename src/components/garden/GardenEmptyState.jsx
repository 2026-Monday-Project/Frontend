import emptyStateImage from "@/assets/images/custom/garden-empty-state.png";
import dividerImage from "@/assets/images/custom/drawer-divider.png";
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
                <p className="garden-empty-state-title">
                    {title}
                </p>
                {subtitle && (
                    <p className="garden-empty-state-subtitle">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className={`garden-empty-state-guide ${!subtitle ? "no-subtitle" : ""}`}>
                <img src={dividerImage} alt="" aria-hidden="true" />
                <p>{guide}</p>
            </div>
        </div>
    );
};

export default GardenEmptyState;