import {
    BrowserRouter,
    Routes,
    Route,
    Link,
} from "react-router-dom";

import Home from "@/pages/Home/Home";
import Performance from "@/pages/Performance/Performance";
import Garden from "@/pages/Garden/Garden";
import GardenDetail from "@/pages/Garden/GardenDetail";
import StoryForm1 from "@/pages/StoryForm/StoryForm1";
import StoryForm2 from "@/pages/StoryForm/StoryForm2";
import StoryForm3 from "@/pages/StoryForm/StoryForm3";
import StoryComplete from "@/pages/StoryForm/StoryComplete";
import ConsentPage1 from "@/pages/ConsentPage/ConsentPage1";
import ConsentPage2 from "@/pages/ConsentPage/ConsentPage2";
import ConsentPage3 from "@/pages/ConsentPage/ConsentPage3";
import ConsentPage4 from "@/pages/ConsentPage/ConsentPage4";
import ConsentPage5 from "@/pages/ConsentPage/ConsentPage5";
import Login from "@/pages/Login/Login";
import LoginCompleted from "@/pages/Login/LoginCompleted";
import MyGarden from "@/pages/MyGarden/MyGarden";
import MyGardenUnLoggedIn from "@/pages/MyGarden/MyGardenUnLoggedIn";
import MyStoriesList from "@/pages/MyGarden/MyStoriesList";
import MyStoryDetail from "@/pages/MyGarden/MyStoryDetail";
import Mailbox from "@/pages/Mailbox/Mailbox";
import MailUnderReview from "@/pages/Mailbox/MailUnderReview";
import MailHidden from "@/pages/Mailbox/MailHidden";
import MailPublic from "@/pages/Mailbox/MailPublic";
import MailDeleted from "@/pages/Mailbox/MailDeleted";
import Settings from "@/pages/Settings/Settings";
import NotFound from "@/pages/NotFound/NotFound";

import AdminReview from "@/pages/Admin/AdminReview";
import AdminReviewDetail from "@/pages/Admin/AdminReviewDetail";
import AdminReviewPhotos from "@/pages/Admin/AdminReviewPhotos";
import AdminNotification from "@/pages/Admin/AdminNotification";
import AdminCompleted from "@/pages/Admin/AdminCompleted";

import ScrollToTop from "@/components/common/ScrollToTop";

/*
 * 프로젝트의 페이지 경로를 관리합니다.
 *
 * 새로운 페이지를 추가할 경우
 * 해당 페이지를 import한 뒤 Routes 내부에 Route를 추가합니다.
 */

const Router = () => {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Routes>
                {/* 홈 */}
                <Route path="/" element={<Home />} />

                {/* 공연 안내 */}
                <Route path="/performance" element={<Performance />} />

                {/* 정원 둘러보기 */}
                <Route path="/garden" element={<Garden />} />
                <Route
                    path="/garden/:storyId"
                    element={<GardenDetail />}
                />

                {/* 사연 작성 */}
                <Route path="/story" element={<StoryForm1 />} />
                <Route path="/story/send/2" element={<StoryForm2 />} />
                <Route path="/story/send/3" element={<StoryForm3 />} />
                <Route
                    path="/story/complete"
                    element={<StoryComplete />}
                />

                {/* 사연 수정 */}
                <Route
                    path="/story/edit"
                    element={<StoryForm1 mode="edit" />}
                />
                <Route
                    path="/story/edit/2"
                    element={<StoryForm2 mode="edit" />}
                />
                <Route
                    path="/story/edit/3"
                    element={<StoryForm3 mode="edit" />}
                />
                <Route
                    path="/story/edit/complete"
                    element={<StoryComplete mode="edit" />}
                />

                {/* 동의서 세부내용 */}
                <Route
                    path="/story/consent/1"
                    element={<ConsentPage1 />}
                />
                <Route
                    path="/story/consent/2"
                    element={<ConsentPage2 />}
                />
                <Route
                    path="/story/consent/3"
                    element={<ConsentPage3 />}
                />
                <Route
                    path="/story/consent/4"
                    element={<ConsentPage4 />}
                />
                <Route
                    path="/story/consent/5"
                    element={<ConsentPage5 />}
                />

                {/* 로그인 */}
                <Route path="/login" element={<Login />} />
                <Route
                    path="/login-completed"
                    element={<LoginCompleted />}
                />

            {/* 내 정원 */}
            <Route path="/my-garden" element={<MyGarden />} />
            <Route path="/my-garden-unlogged-in" element={<MyGardenUnLoggedIn />} />
            <Route path="/my-stories-list" element={<MyStoriesList />} />
            <Route path="/my-story-detail" element={<MyStoryDetail />} />

                {/* 편지함 */}
                <Route path="/mailbox" element={<Mailbox />} />
                <Route
                    path="/mail-public"
                    element={<MailPublic />}
                />
                <Route
                    path="/mail-under-review"
                    element={<MailUnderReview />}
                />
                <Route
                    path="/mail-hidden"
                    element={<MailHidden />}
                />
                <Route
                    path="/mail-deleted"
                    element={<MailDeleted />}
                />

                {/* 설정 */}
                <Route path="/settings" element={<Settings />} />

                {/* 관리자 */}
                <Route
                    path="/admin/reviews"
                    element={<AdminReview />}
                />
                <Route
                    path="/admin/reviews/:storyId"
                    element={<AdminReviewDetail />}
                />
                <Route
                    path="/admin/reviews/:storyId/photos"
                    element={<AdminReviewPhotos />}
                />
                <Route
                    path="/admin/notifications/:storyId"
                    element={<AdminNotification />}
                />
                <Route
                    path="/admin/completed"
                    element={<AdminCompleted />}
                />

                {/* 존재하지 않는 주소 */}
                <Route path="*" element={<NotFound />} />
            </Routes>

            {/* TODO: 임시 버튼 - 사연 작성 플로우 테스트용, 정식 진입 동선이 생기면 제거 */}
            <Link
                to="/story"
                style={{
                    position: "fixed",
                    bottom: "16px",
                    right: "16px",
                    zIndex: 9999,
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px dashed #315338",
                    background: "#faf6eb",
                    color: "#315338",
                    fontSize: "12px",
                    fontWeight: 600,
                }}
            >
                사연 작성 (임시)
            </Link>
        </BrowserRouter>
    );
};

export default Router;