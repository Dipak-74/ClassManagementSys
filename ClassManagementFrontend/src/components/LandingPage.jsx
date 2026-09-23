import React from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  CheckCircle2
} from "lucide-react";

export default function LandingPage({ user, onNavigate }) {
  const isStudent = user?.role === "student";
  const isTeacher = user?.role === "teacher";

  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={16} className="text-primary" />
          <span>Next-Gen Academic & Course Management</span>
        </div>

        <h1 className="hero-title">
          Empowering Next-Gen <br />
          <span className="gradient-text">Learning & Teaching</span>
        </h1>

        <p className="hero-subtitle">
          A modern, unified classroom ecosystem connecting educators and learners.
          Seamlessly publish courses, track real-time student rosters, and empower
          academic growth in one intuitive workspace.
        </p>

        {/* Dynamic CTA depending on login state */}
        <div className="hero-cta-group">
          {user ? (
            <>
              <button
                type="button"
                className="btn btn-primary hero-btn"
                onClick={() => onNavigate("dashboard")}
              >
                <span>Go to {isTeacher ? "Teacher Portal" : "Student Portal"}</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn btn-secondary hero-btn"
                onClick={() => onNavigate("dashboard")}
              >
                <BookOpen size={18} />
                <span>Browse Courses</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-primary hero-btn"
                onClick={() => onNavigate("register")}
              >
                <span>Get Started Now</span>
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn btn-secondary hero-btn"
                onClick={() => onNavigate("login")}
              >
                <span>Sign In to Account</span>
              </button>
            </>
          )}
        </div>

        {/* Live Metrics Showcase */}
        <div className="hero-metrics-bar">
          <div className="metric-item">
            <span className="metric-number">100%</span>
            <span className="metric-label">Role-Based Security</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">Instant</span>
            <span className="metric-label">One-Click Enrollment</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">Real-Time</span>
            <span className="metric-label">Class Roster Tracking</span>
          </div>
        </div>
      </section>

      {/* Role-Based Highlight Cards */}
      <section className="features-section">
        <div className="section-title-wrap">
          <h2 className="section-title">Designed for Both Learners & Educators</h2>
          <p className="section-desc">
            Tailored tools providing exactly what students and instructors need to thrive.
          </p>
        </div>

        <div className="features-grid">
          {/* Student Card */}
          <div className="feature-card student-feature">
            <div className="feature-card-header">
              <div className="feature-icon-box icon-student">
                <GraduationCap size={28} />
              </div>
              <span className="feature-tag">For Students</span>
            </div>
            <h3 className="feature-heading">Student Learning Hub</h3>
            <p className="feature-text">
              Browse an interactive catalog of published courses. Enroll with zero friction,
              manage all your purchased subjects, and unenroll anytime.
            </p>
            <ul className="feature-checklist">
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Search and filter all available courses in real time</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Instant enrollment with duplicate purchase protection</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Dedicated &quot;My Enrolled Courses&quot; management list</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-outline feature-btn"
              onClick={() => onNavigate(user ? "dashboard" : "login")}
            >
              {user && isStudent ? "Access Student Dashboard →" : "Join as Student →"}
            </button>
          </div>

          {/* Teacher Card */}
          <div className="feature-card teacher-feature">
            <div className="feature-card-header">
              <div className="feature-icon-box icon-teacher">
                <Users size={28} />
              </div>
              <span className="feature-tag">For Teachers</span>
            </div>
            <h3 className="feature-heading">Instructor Management Studio</h3>
            <p className="feature-text">
              Publish customized courses effortlessly. View live class rosters, see who is
              enrolled in each class, and maintain full curriculum ownership.
            </p>
            <ul className="feature-checklist">
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Quick course publishing with instant catalog availability</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Live enrolled student rosters with interactive drawers</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="check-icon" />
                <span>Course deletion with automated referential cleanup</span>
              </li>
            </ul>
            <button
              type="button"
              className="btn btn-outline feature-btn"
              onClick={() => onNavigate(user ? "dashboard" : "login")}
            >
              {user && isTeacher ? "Access Teacher Dashboard →" : "Join as Teacher →"}
            </button>
          </div>
        </div>
      </section>

      {/* Tech & Architecture Banner */}
      <section className="architecture-banner">
        <div className="arch-content">
          <div className="arch-badge">
            <ShieldCheck size={16} /> Enterprise Full-Stack Core
          </div>
          <h3 className="arch-title">Powered by Modern Full-Stack Technologies</h3>
          <p className="arch-desc">
            Built with Spring Boot 3/4 Data JPA REST backend, MySQL relational database, and
            React 19 Vite single-page application with responsive glassmorphic UI.
          </p>
        </div>
        <div className="arch-pills-wrap">
          <span className="arch-pill">Spring Boot</span>
          <span className="arch-pill">Spring Data JPA</span>
          <span className="arch-pill">MySQL Database</span>
          <span className="arch-pill">React 19</span>
          <span className="arch-pill">Vite</span>
          <span className="arch-pill">Axios</span>
          <span className="arch-pill">Docker</span>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="cta-banner">
        <h2 className="cta-heading">Ready to Start Learning or Teaching?</h2>
        <p className="cta-sub">
          Join ClassFlow today and experience seamless classroom management.
        </p>
        <button
          type="button"
          className="btn btn-primary cta-btn"
          onClick={() => onNavigate(user ? "dashboard" : "register")}
        >
          {user ? "Open Your Dashboard" : "Create Free Account"}
          <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <GraduationCap size={20} className="text-primary" />
            <span>ClassFlow &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="footer-tagline">
            Role-Based Class & Course Management System.
          </p>
        </div>
      </footer>
    </div>
  );
}

