import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import MyActivity from "./pages/MyActivity";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminComments from "./pages/AdminComments";
import Footer from "./components/Footer";

export default function App() {
  return (
    // <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen bg-slate-950 text-slate-50">

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-activity" element={<MyActivity />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/comments" element={<AdminComments />} />

      </Routes>

      <Footer />
    </div>
  );
}
