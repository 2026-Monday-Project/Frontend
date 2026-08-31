import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "@/pages/Home/Home";
import Performance from "@/pages/Performance/Performance";
import Garden from "@/pages/Garden/Garden";
import StoryForm1 from "@/pages/StoryForm/StoryForm1";
import StoryForm2 from "@/pages/StoryForm/StoryForm2";
import StoryForm3 from "@/pages/StoryForm/StoryForm3";
import StoryComplete from "@/pages/StoryForm/StoryComplete";
import Login from "@/pages/Login/Login";
import LoginCompleted from "@/pages/Login/LoginCompleted";
import MyGarden from "@/pages/MyGarden/MyGarden";
import Mailbox from "@/pages/Mailbox/Mailbox";
import MailUnderReview from "@/pages/Mailbox/MailUnderReview";
import MailHidden from "@/pages/Mailbox/MailHidden";
import MailPublic from "@/pages/Mailbox/MailPublic";
import MailDeleted from "@/pages/Mailbox/MailDeleted";
import Settings from "@/pages/Settings/Settings";
import NotFound from "@/pages/NotFound/NotFound";
import MyGardenUnLoggedIn from "@/pages/MyGarden/MyGardenUnLoggedIn";

/*
 * 프로젝트의 페이지 경로를 관리합니다.
 *
 * 새로운 페이지를 추가할 경우
 * 해당 페이지를 import한 뒤 Routes 내부에 Route를 추가합니다.
 */

const Router = () => {
    return (
        <BrowserRouter>
        <Routes>
            {/* 홈 */}
            <Route path="/" element={<Home />} />

            {/* 공연 안내 */}
            <Route path="/performance" element={<Performance />} />

            {/* 정원 둘러보기 */}
            <Route path="/garden" element={<Garden />} />

            {/* 사연 작성 */}
            <Route path="/story" element={<StoryForm1 />} />
            <Route path="/story/send/2" element={<StoryForm2 />} />
            <Route path="/story/send/3" element={<StoryForm3 />} />
            <Route path="/story/complete" element={<StoryComplete />} />

            {/* 사연 수정 */}
            <Route path="/story/edit" element={<StoryForm1 mode="edit" />} />
            <Route path="/story/edit/2" element={<StoryForm2 mode="edit" />} />
            <Route path="/story/edit/3" element={<StoryForm3 mode="edit" />} />
            <Route
                path="/story/edit/complete"
                element={<StoryComplete mode="edit" />}
            />

            {/* 로그인 */}
            <Route path="/login" element={<Login />} />
            <Route path="/login-completed" element={<LoginCompleted />} />

            {/* 내 정원 */}
            <Route path="/my-garden" element={<MyGarden />} />
            <Route path="/my-garden-unlogged-in" element={<MyGardenUnLoggedIn />} />

            {/* 편지함 */}
            <Route path="/mailbox" element={<Mailbox />} />
            <Route path="/mail-public" element={<MailPublic />} />
            <Route path="/mail-under-review" element={<MailUnderReview />} />
            <Route path="/mail-hidden" element={<MailHidden />} />
            <Route path="/mail-deleted" element={<MailDeleted />} />

            {/* 설정 */}
            <Route path="/settings" element={<Settings />} />

            {/* 존재하지 않는 주소 */}
            <Route path="*" element={<NotFound />} />
        </Routes>

        {/* TODO: 임시 버튼 - 사연 작성/수정 플로우 테스트용, 정식 진입 동선이 생기면 제거 */}
        <div
            style={{
                position: "fixed",
                bottom: "16px",
                right: "16px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            }}
        >
            <Link
                to="/story"
                style={{
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

            <Link
                to="/story/edit"
                style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px dashed #315338",
                    background: "#faf6eb",
                    color: "#315338",
                    fontSize: "12px",
                    fontWeight: 600,
                }}
            >
                사연 수정 (임시)
            </Link>
        </div>
        </BrowserRouter>
    );
};

export default Router;