import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";

import "./App.css";

export default function App() {
  return (
    <Routes>

      {/* Default route - Landing Page with modal-based authentication */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tasks" element={<Tasks />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}
