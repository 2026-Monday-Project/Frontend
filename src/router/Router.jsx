import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home/Home";
import Performance from "@/pages/Performance/Performance";
import Garden from "@/pages/Garden/Garden";
import StoryForm1 from "@/pages/StoryForm/StoryForm1";
import StoryForm2 from "@/pages/StoryForm/StoryForm2";
import Login from "@/pages/Login/Login";
import LoginCompleted from "@/pages/Login/LoginCompleted";
import MyGarden from "@/pages/MyGarden/MyGarden";
import Mailbox from "@/pages/Mailbox/Mailbox";
import Settings from "@/pages/Settings/Settings";
import NotFound from "@/pages/NotFound/NotFound";

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

            {/* 사연 작성 및 수정 */}
            <Route path="/story" element={<StoryForm1 />} />
            <Route path="/story/send/2" element={<StoryForm2 />} />

            {/* 로그인 */}
            <Route path="/login" element={<Login />} />
            <Route path="/login-completed" element={<LoginCompleted />} />

            {/* 내 정원 */}
            <Route path="/my-garden" element={<MyGarden />} />

            {/* 편지함 */}
            <Route path="/mailbox" element={<Mailbox />} />

            {/* 설정 */}
            <Route path="/settings" element={<Settings />} />

            {/* 존재하지 않는 주소 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
    );
};

export default Router;