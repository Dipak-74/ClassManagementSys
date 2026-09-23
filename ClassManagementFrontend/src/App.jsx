import React, { useState } from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import Toast from "./components/Toast";
import { getStoredUser, clearStoredUser } from "./resigterAndLogin";
import "./App.css";

export default function App() {
  // Session persistence: restore user from localStorage if exists
  const [user, setUser] = useState(() => getStoredUser());

  // Views: "landing" | "dashboard" | "login" | "register"
  const [currentView, setCurrentView] = useState(() => {
    const savedUser = getStoredUser();
    // As requested: if user is already logged in, navigate directly to dashboard!
    return savedUser ? "dashboard" : "landing";
  });

  const [toasts, setToasts] = useState([]);

  // Toast notifier
  const showToast = (message, type = "info", title = "") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Success Handler
  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setCurrentView("dashboard"); // Directly route to role dashboard!
  };

  // Logout Handler
  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
    setCurrentView("landing");
    showToast("You have been signed out safely.", "info");
  };

  // Navigation Router
  const handleNavigate = (view) => {
    if (view === "dashboard" && !user) {
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-root-layout">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="main-content-area">
        {/* LANDING PAGE */}
        {currentView === "landing" && (
          <LandingPage user={user} onNavigate={handleNavigate} />
        )}

        {/* AUTH SCREENS (LOGIN & REGISTER) */}
        {(currentView === "login" || currentView === "register") && (
          <AuthModal
            initialMode={currentView}
            onAuthSuccess={handleAuthSuccess}
            onBackToHome={() => handleNavigate("landing")}
            showToast={showToast}
          />
        )}

        {/* ROLE-BASED DASHBOARD */}
        {currentView === "dashboard" && user && (
          <>
            {user.role === "teacher" ? (
              <TeacherDashboard user={user} showToast={showToast} />
            ) : (
              <StudentDashboard user={user} showToast={showToast} />
            )}
          </>
        )}
      </main>
    </div>
  );
}