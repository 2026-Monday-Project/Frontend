import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home/Home";
import Login from "@/pages/Login/Login";
import LoginCompleted from "@/pages/Login/LoginCompleted";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-completed" element={<LoginCompleted />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;