import { useEffect, useState } from "react";

import AdminStoryCard from "@/components/admin/AdminStoryCard";
import reviewEmptyImage from "@/assets/images/custom/admin-review-empty.svg";
import homeDivider from "@/assets/images/custom/home-divider.svg";
import {
    getAdminStoryList,
    getAdminStorySummary,
} from "@/api/adminApi";

import "./AdminReview.css";

const filterList = [
    {
        value: "PENDING",
        label: "검토중",
    },
    {
        value: "PUBLIC",
        label: "공개",
    },
    {
        value: "PRIVATE",
        label: "비공개",
    },
    {
        value: "ALL",
        label: "전체",
    },
];

const AdminReview = () => {
    const [selectedFilter, setSelectedFilter] =
        useState("PENDING");

    const [storyList, setStoryList] = useState([]);

    const [summary, setSummary] = useState({
        pendingCount: 0,
        publicCount: 0,
        privateCount: 0,
        totalCount: 0,
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response =
                    await getAdminStorySummary();

                setSummary(response.data.data);
            } catch {
                setSummary({
                    pendingCount: 0,
                    publicCount: 0,
                    privateCount: 0,
                    totalCount: 0,
                });
            }
        };

        fetchSummary();
    }, []);

    useEffect(() => {
        const fetchStoryList = async () => {
            try {
                const response =
                    await getAdminStoryList({
                        status: selectedFilter,
                        page: 0,
                        size: 20,
                    });

                setStoryList(
                    response.data.data.stories,
                );
            } catch {
                setStoryList([]);
            }
        };

        fetchStoryList();
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

                    <strong>
                        {summary.pendingCount}
                    </strong>
                </div>

                <div className="admin-review-summary-row">
                    <div className="admin-review-summary-small">
                        <span>공개</span>

                        <strong className="admin-review-public-count">
                            {summary.publicCount}
                        </strong>
                    </div>

                    <div className="admin-review-summary-small">
                        <span>비공개</span>

                        <strong className="admin-review-private-count">
                            {summary.privateCount}
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

            {storyList.length > 0 ? (
                <div className="admin-review-story-list">
                    {storyList.map((story) => (
                        <AdminStoryCard
                            key={story.storyId}
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