import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  CheckCircle2,
  Search,
  RefreshCw,
  Trash2,
  Sparkles,
  BookmarkCheck,
  FolderOpen,
  AlertCircle
} from "lucide-react";
import {
  apiGetAllCourses,
  apiGetMyBuyCourses,
  apiBuyCourse,
  apiDeleteBuyCourse,
  getErrorMessage
} from "../resigterAndLogin";

export default function StudentDashboard({ user, showToast }) {
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "enrolled"
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingCid, setActionLoadingCid] = useState(null); // id of course being enrolled/deleted

  const loadData = async () => {
    if (!user?.uid) return;
    setLoadingCourses(true);
    try {
      // 1. Fetch available courses
      try {
        const allList = await apiGetAllCourses();
        setAllCourses(allList || []);
      } catch (err) {
        console.error("Failed to load all courses:", err);
      }

      // 2. Fetch student enrolled courses independently
      try {
        const myList = await apiGetMyBuyCourses(user.uid);
        setMyCourses(myList || []);
      } catch (err) {
        console.warn("Failed to load enrolled courses:", err);
        setMyCourses([]);
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.uid]);

  // Set of enrolled course IDs for quick lookup
  const enrolledCidSet = useMemo(() => {
    return new Set(myCourses.map((c) => c.cid));
  }, [myCourses]);

  // Filtered courses based on search query
  const filteredAllCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allCourses;
    return allCourses.filter((c) => (c.cname || "").toLowerCase().includes(q));
  }, [allCourses, searchQuery]);

  const filteredMyCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return myCourses;
    return myCourses.filter((c) => (c.cname || "").toLowerCase().includes(q));
  }, [myCourses, searchQuery]);

  // Handle course enrollment
  const handleEnroll = async (course) => {
    if (enrolledCidSet.has(course.cid)) {
      showToast("You are already enrolled in this course", "info");
      return;
    }

    setActionLoadingCid(course.cid);
    try {
      await apiBuyCourse(course.cid, user.uid);
      showToast(`Successfully enrolled in "${course.cname}"!`, "success");
      // Refresh my courses list
      const updatedMyCourses = await apiGetMyBuyCourses(user.uid);
      setMyCourses(updatedMyCourses);
    } catch (err) {
      showToast(getErrorMessage(err, "Unable to enroll in course"), "error");
    } finally {
      setActionLoadingCid(null);
    }
  };

  // Handle course unenrollment
  const handleUnenroll = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to drop "${course.cname}"?`
    );
    if (!confirmed) return;

    setActionLoadingCid(course.cid);
    try {
      await apiDeleteBuyCourse(course.cid, user.uid);
      showToast(`Dropped "${course.cname}" successfully`, "info");
      const updatedMyCourses = await apiGetMyBuyCourses(user.uid);
      setMyCourses(updatedMyCourses);
    } catch (err) {
      showToast(getErrorMessage(err, "Unable to unenroll from course"), "error");
    } finally {
      setActionLoadingCid(null);
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Student Welcome & Stats Header */}
      <div className="dashboard-hero-banner student-banner">
        <div className="hero-profile-area">
          <div className="dashboard-avatar student-avatar">
            {(user.name || "S").charAt(0).toUpperCase()}
          </div>
          <div className="dashboard-profile-text">
            <span className="welcome-role-badge">Student Portal</span>
            <h2 className="welcome-name">Hello, {user.name} 👋</h2>
            <p className="welcome-email">{user.email}</p>
          </div>
        </div>

        <div className="dashboard-stats-strip">
          <div className="stat-card">
            <span className="stat-value">{allCourses.length}</span>
            <span className="stat-label">Available Courses</span>
          </div>
          <div className="stat-card stat-highlight">
            <span className="stat-value">{myCourses.length}</span>
            <span className="stat-label">Enrolled Courses</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs + Search + Refresh */}
      <div className="dashboard-control-bar">
        <div className="dashboard-tabs">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <BookOpen size={17} />
            <span>All Courses ({allCourses.length})</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === "enrolled" ? "active" : ""}`}
            onClick={() => setActiveTab("enrolled")}
          >
            <BookmarkCheck size={17} />
            <span>My Enrolled ({myCourses.length})</span>
          </button>
        </div>

        <div className="search-and-refresh">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search courses by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary refresh-btn"
            onClick={loadData}
            disabled={loadingCourses}
            title="Reload courses"
          >
            <RefreshCw size={16} className={loadingCourses ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALL COURSES */}
      {activeTab === "all" && (
        <div className="courses-grid-section">
          {loadingCourses ? (
            <div className="loading-state-card">
              <RefreshCw size={28} className="spin text-primary" />
              <p>Loading available courses...</p>
            </div>
          ) : filteredAllCourses.length === 0 ? (
            <div className="empty-state-card">
              <FolderOpen size={40} className="empty-icon" />
              <h3>{searchQuery ? "No matching courses found" : "No courses available yet"}</h3>
              <p>
                {searchQuery
                  ? "Try checking your spelling or clear the search query."
                  : "Instructors have not published any courses yet. Please check back later!"}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "auto", marginTop: "12px" }}
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            <div className="courses-cards-grid">
              {filteredAllCourses.map((c) => {
                const isEnrolled = enrolledCidSet.has(c.cid);
                const isCurrentAction = actionLoadingCid === c.cid;

                return (
                  <div
                    key={c.cid}
                    className={`course-item-card ${isEnrolled ? "enrolled-border" : ""}`}
                  >
                    <div className="course-card-top">
                      <span className="course-id-tag">Course #{c.cid}</span>
                      {isEnrolled && (
                        <span className="badge-enrolled">
                          <CheckCircle2 size={13} /> Enrolled
                        </span>
                      )}
                    </div>

                    <h4 className="course-name">{c.cname}</h4>

                    <div className="course-card-footer">
                      <span className="instructor-meta">
                        Instructor ID: #{c.ownerid}
                      </span>

                      {isEnrolled ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-card-action"
                          onClick={() => setActiveTab("enrolled")}
                        >
                          View in My Courses
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-card-action"
                          disabled={isCurrentAction}
                          onClick={() => handleEnroll(c)}
                        >
                          {isCurrentAction ? (
                            <>
                              <RefreshCw size={14} className="spin" />
                              <span>Enrolling...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              <span>Enroll Course</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ENROLLED COURSES */}
      {activeTab === "enrolled" && (
        <div className="courses-grid-section">
          {loadingCourses ? (
            <div className="loading-state-card">
              <RefreshCw size={28} className="spin text-primary" />
              <p>Loading your courses...</p>
            </div>
          ) : filteredMyCourses.length === 0 ? (
            <div className="empty-state-card">
              <BookmarkCheck size={40} className="empty-icon text-success" />
              <h3>{searchQuery ? "No matching enrolled courses" : "You have not enrolled in any courses yet"}</h3>
              <p>
                {searchQuery
                  ? "Try checking your spelling or clear the search query."
                  : "Explore the complete course catalog and start your learning journey today!"}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: "auto", marginTop: "16px" }}
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
              >
                Browse All Available Courses
              </button>
            </div>
          ) : (
            <div className="courses-cards-grid">
              {filteredMyCourses.map((c) => {
                const isCurrentAction = actionLoadingCid === c.cid;

                return (
                  <div key={c.cid} className="course-item-card enrolled-card">
                    <div className="course-card-top">
                      <span className="course-id-tag">Course #{c.cid}</span>
                      <span className="badge-enrolled">
                        <CheckCircle2 size={13} /> Active Student
                      </span>
                    </div>

                    <h4 className="course-name">{c.cname}</h4>

                    <div className="course-card-footer">
                      <span className="instructor-meta">
                        Instructor ID: #{c.ownerid}
                      </span>

                      <button
                        type="button"
                        className="btn btn-danger btn-card-action"
                        disabled={isCurrentAction}
                        onClick={() => handleUnenroll(c)}
                        title="Unenroll / Drop this course"
                      >
                        {isCurrentAction ? (
                          <>
                            <RefreshCw size={14} className="spin" />
                            <span>Dropping...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 size={14} />
                            <span>Drop Course</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

