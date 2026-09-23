import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { apiLogin, apiRegister, getErrorMessage } from "../resigterAndLogin";

export default function AuthModal({ initialMode = "login", onAuthSuccess, onBackToHome, showToast }) {
  const [mode, setMode] = useState(initialMode); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("student"); // default to student

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast("Please enter both email and password", "warning");
      return;
    }

    setLoading(true);
    try {
      const user = await apiLogin(loginEmail, loginPassword);
      showToast(`Welcome back, ${user.name}!`, "success");
      onAuthSuccess(user);
    } catch (err) {
      showToast(getErrorMessage(err, "Login failed. Check credentials or server."), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regRole) {
      showToast("Please fill in all registration fields", "warning");
      return;
    }
    if (!regEmail.includes("@")) {
      showToast("Please enter a valid email address", "warning");
      return;
    }
    if (regPassword.trim().length < 5) {
      showToast("Password must be at least 5 characters long", "warning");
      return;
    }

    setLoading(true);
    try {
      const msg = await apiRegister(regName, regEmail, regPassword, regRole);
      showToast(msg || "Registration successful! You can now log in.", "success");
      // Auto fill login email and switch to login tab
      setLoginEmail(regEmail.trim().toLowerCase());
      setLoginPassword("");
      setMode("login");
    } catch (err) {
      showToast(getErrorMessage(err, "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card-container auth-card">
        {/* Top bar with back to home button */}
        <div className="auth-card-topbar">
          <button
            type="button"
            className="back-btn"
            onClick={onBackToHome}
            title="Back to Landing Page"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </button>
          <div className="auth-tab-pills">
            <button
              type="button"
              className={`auth-tab-pill ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-pill ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form className="custom-form" onSubmit={handleLoginSubmit}>
            <div className="form-header-group">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">
                Enter your credentials to access your student or teacher dashboard
              </p>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="custom-input with-left-icon"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="custom-input with-left-icon with-right-icon"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="auth-footer-prompt">
              <span>Don&apos;t have an account?</span>{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode("register")}
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form className="custom-form" onSubmit={handleRegisterSubmit}>
            <div className="form-header-group">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">
                Join ClassFlow to enroll in courses or start teaching
              </p>
            </div>

            {/* Role Selector Cards */}
            <div className="input-field-wrapper">
              <label className="field-label">Choose Account Type</label>
              <div className="role-selector-grid">
                <div
                  className={`role-select-card ${regRole === "student" ? "selected" : ""}`}
                  onClick={() => setRegRole("student")}
                >
                  <GraduationCap size={24} className="role-select-icon student-icon" />
                  <div className="role-select-details">
                    <span className="role-select-title">Student</span>
                    <span className="role-select-desc">Browse & enroll in courses</span>
                  </div>
                </div>

                <div
                  className={`role-select-card ${regRole === "teacher" ? "selected" : ""}`}
                  onClick={() => setRegRole("teacher")}
                >
                  <Users size={24} className="role-select-icon teacher-icon" />
                  <div className="role-select-details">
                    <span className="role-select-title">Teacher</span>
                    <span className="role-select-desc">Create courses & track rosters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="custom-input with-left-icon"
                  placeholder="e.g. Rahul Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="custom-input with-left-icon"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-field-wrapper">
              <label className="field-label">Password (Min 5 chars)</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="custom-input with-left-icon with-right-icon"
                  placeholder="Create a strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  minLength={5}
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Register Account</span>
                </>
              )}
            </button>

            <div className="auth-footer-prompt">
              <span>Already registered?</span>{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

