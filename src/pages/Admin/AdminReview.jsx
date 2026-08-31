import { useMemo, useState } from "react";

import AdminStoryCard from "@/components/admin/AdminStoryCard";
import reviewEmptyImage from "@/assets/images/custom/admin-review-empty.svg";
import homeDivider from "@/assets/images/custom/home-divider.svg";
import {
    ADMIN_STATUS,
    adminStoryList,
} from "@/data/adminMockData";

import "./AdminReview.css";

const filterList = [
    {
        value: ADMIN_STATUS.REVIEWING,
        label: "검토중",
    },
    {
        value: ADMIN_STATUS.PUBLIC,
        label: "공개",
    },
    {
        value: ADMIN_STATUS.PRIVATE,
        label: "비공개",
    },
    {
        value: "all",
        label: "전체",
    },
];

const AdminReview = () => {
    const [selectedFilter, setSelectedFilter] =
        useState(ADMIN_STATUS.REVIEWING);

    const reviewingCount = adminStoryList.filter(
        (story) => story.status === ADMIN_STATUS.REVIEWING,
    ).length;

    const publicCount = adminStoryList.filter(
        (story) => story.status === ADMIN_STATUS.PUBLIC,
    ).length;

    const privateCount = adminStoryList.filter(
        (story) => story.status === ADMIN_STATUS.PRIVATE,
    ).length;

    const filteredStoryList = useMemo(() => {
        if (selectedFilter === "all") {
            return adminStoryList;
        }

        return adminStoryList.filter(
            (story) => story.status === selectedFilter,
        );
    }, [selectedFilter]);

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    return (
        <main className="admin-review-page">
            <h1 className="admin-review-title">
                사연 검토
            </h1>

            <section className="admin-review-summary">
                <div className="admin-review-summary-main">
                    <span>검토 중</span>
                    <strong>{reviewingCount}</strong>
                </div>

                <div className="admin-review-summary-row">
                    <div className="admin-review-summary-small">
                        <span>공개</span>
                        <strong className="admin-review-public-count">
                            {publicCount}
                        </strong>
                    </div>

                    <div className="admin-review-summary-small">
                        <span>비공개</span>
                        <strong className="admin-review-private-count">
                            {privateCount}
                        </strong>
                    </div>
                </div>
            </section>

            <div className="admin-review-filters">
                {filterList.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        className={`admin-review-filter ${
                            selectedFilter === filter.value
                                ? "admin-review-filter-active"
                                : ""
                        }`}
                        onClick={() =>
                            handleFilterClick(filter.value)
                        }
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {filteredStoryList.length > 0 ? (
                <div className="admin-review-story-list">
                    {filteredStoryList.map((story) => (
                        <AdminStoryCard
                            key={story.id}
                            story={story}
                        />
                    ))}
                </div>
            ) : (
                <div className="admin-review-empty">
                    <img
                        className="admin-review-empty-image"
                        src={reviewEmptyImage}
                        alt=""
                    />

                    <p className="admin-review-empty-text">
                        검토가 필요한 사연이 없습니다.
                    </p>

                    <img
                        className="admin-review-empty-divider"
                        src={homeDivider}
                        alt=""
                    />
                </div>
            )}
        </main>
    );
};

export default AdminReview;