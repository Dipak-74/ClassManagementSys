import React from "react";
import { GraduationCap, LogOut, User, LayoutDashboard, Home } from "lucide-react";

export default function Navbar({
  user,
  currentView,
  onNavigate,
  onLogout
}) {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => onNavigate("landing")}>
          <div className="brand-icon-box">
            <GraduationCap size={24} className="brand-icon" />
          </div>
          <div className="brand-text-group">
            <span className="brand-title">ClassFlow</span>
            <span className="brand-tag">Academic Suite</span>
          </div>
        </div>

        {/* Center / Nav Links */}
        <nav className="navbar-links">
          <button
            type="button"
            className={`nav-link-btn ${currentView === "landing" ? "active" : ""}`}
            onClick={() => onNavigate("landing")}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          {user && (
            <button
              type="button"
              className={`nav-link-btn ${currentView === "dashboard" ? "active" : ""}`}
              onClick={() => onNavigate("dashboard")}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
          )}
        </nav>

        {/* Right Section */}
        <div className="navbar-actions">
          {user ? (
            /* Logged In User Profile & Logout */
            <div className="user-profile-menu">
              <div
                className="user-badge-chip"
                onClick={() => onNavigate("dashboard")}
                title={`Signed in as ${user.email}`}
              >
                <div className="user-avatar-circle">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="user-info-text">
                  <span className="user-display-name">{user.name}</span>
                  <span className={`user-role-badge role-${user.role}`}>
                    {user.role === "teacher" ? "👨‍🏫 Instructor" : "🎓 Student"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="btn-logout"
                onClick={onLogout}
                title="Sign out of your account"
              >
                <LogOut size={16} />
                <span className="logout-text">Logout</span>
              </button>
            </div>
          ) : (
            /* Guest Actions */
            <div className="auth-btn-group">
              <button
                type="button"
                className="btn btn-secondary nav-btn"
                onClick={() => onNavigate("login")}
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn btn-primary nav-btn"
                onClick={() => onNavigate("register")}
              >
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
