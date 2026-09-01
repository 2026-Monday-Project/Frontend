import emptyStateImage from "@/assets/images/custom/garden-empty-state.png";
import dividerImage from "@/assets/images/custom/drawer-divider.png";

import "./GardenEmptyState.css";

const GardenEmptyState = () => {
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
                    아직 등록된 사연이 없어요.
                </p>
                <p className="garden-empty-state-subtitle">
                    가장 먼저 우리 이야기를 들려주세요.
                </p>
            </div>

            <div className="garden-empty-state-guide">
                <img src={dividerImage} alt="" aria-hidden="true" />
                <p>보내주신 사연은 정원에 차곡차곡 쌓여요.</p>
            </div>
        </div>
    );
};

export default GardenEmptyState;
