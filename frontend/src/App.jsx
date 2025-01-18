import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignupPage from "./views/auth/SignupPage";
import LoginPage from "./views/auth/LoginPage";
import Navbar from "./views/Navbar";
import { useSelector } from "react-redux";
import { useCheckQuery } from "./store/api/authApiSlice";
import SettingsPage from "./views/SettingPage";
import NotFoundPage from "./views/NotFoundPage";
import ProfilePage from "./views/auth/ProfilePage";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import UpdateInfo from "./views/auth/UpdateInfo";
import Home from "./views/Home";
import { useEffect } from "react";
import CreateBlog from "./views/blogs/CreateBlog";
import Blogs from "./views/blogs/Blogs";

export default function App() {
  const { theme } = useSelector((state) => state.theme);
  const { data: user, isLoading } = useCheckQuery();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <main className="container" data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/update-info" element={<UpdateInfo />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/create-blog" element={<CreateBlog />} />
      </Routes>
      <Toaster />
    </main>
  );
}
