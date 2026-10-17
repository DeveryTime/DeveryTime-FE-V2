import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "../pages/loginPage/loginPage";
import Info from "../pages/myInfoPage";
import SignupPage1 from "../pages/signupPage/signupPage1/signupPage1";
import SignupPage2 from "../pages/signupPage/signupPage2/signupPage2";
import SignupPage3 from "../pages/signupPage/signupPage3/signupPage3";

const SignupPageRoutes = () => (
  <Routes>
    <Route path="/" element={<Info />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<Navigate to="/signup/1" replace />} />
    <Route path="/signup/1" element={<SignupPage1 />} />
    <Route path="/signup/2" element={<SignupPage2 />} />
    <Route path="/signup/3" element={<SignupPage3 />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default SignupPageRoutes;
