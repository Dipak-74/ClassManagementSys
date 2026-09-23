import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  PlusCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FolderPlus,
  BookOpen,
  Search,
  Sparkles
} from "lucide-react";
import {
  apiGetTeacherCourses,
  apiAddCourse,
  apiDeleteTeacherCourse,
  getErrorMessage
} from "../resigterAndLogin";

export default function TeacherDashboard({ user, showToast }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  // New course form state
  const [newCourseName, setNewCourseName] = useState("");
  const [creating, setCreating] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingCid, setDeletingCid] = useState(null);

  const loadTeacherCourses = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const list = await apiGetTeacherCourses(user.uid);
      setCourses(list);
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to load instructor courses"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherCourses();
  }, [user?.uid]);

  // Total enrolled students across all courses
  const totalEnrolledStudents = useMemo(() => {
    return courses.reduce((sum, c) => {
      const count = Array.isArray(c.userRespDTO) ? c.userRespDTO.length : 0;
      return sum + count;
    }, 0);
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => (c.cname || "").toLowerCase().includes(q));
  }, [courses, searchQuery]);

  // Handle Add Course
  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    const name = newCourseName.trim();
    if (!name) {
      showToast("Please enter a course name", "warning");
      return;
    }

    setCreating(true);
    try {
      const msg = await apiAddCourse(name, user.uid);
      showToast(msg || `Course "${name}" created successfully!`, "success");
      setNewCourseName("");
      loadTeacherCourses();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to create course"), "error");
    } finally {
      setCreating(false);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.cname}"? Enrolled students will also be unenrolled.`
    );
    if (!confirmed) return;

    setDeletingCid(course.cid);
    try {
      const msg = await apiDeleteTeacherCourse(course.cid, user.uid);
      showToast(msg || `Course "${course.cname}" deleted`, "info");
      loadTeacherCourses();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to delete course"), "error");
    } finally {
      setDeletingCid(null);
    }
  };

  const toggleRoster = (cid) => {
    setExpandedCourseId(expandedCourseId === cid ? null : cid);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Teacher Welcome & Stats Header */}
      <div className="dashboard-hero-banner teacher-banner">
        <div className="hero-profile-area">
          <div className="dashboard-avatar teacher-avatar">
            {(user.name || "T").charAt(0).toUpperCase()}
          </div>
          <div className="dashboard-profile-text">
            <span className="welcome-role-badge badge-teacher">Instructor Studio</span>
            <h2 className="welcome-name">Welcome, {user.name} 👨‍🏫</h2>
            <p className="welcome-email">{user.email}</p>
          </div>
        </div>

        <div className="dashboard-stats-strip">
          <div className="stat-card">
            <span className="stat-value">{courses.length}</span>
            <span className="stat-label">Published Courses</span>
          </div>
          <div className="stat-card stat-highlight">
            <span className="stat-value">{totalEnrolledStudents}</span>
            <span className="stat-label">Total Active Students</span>
          </div>
        </div>
      </div>

      {/* Course Creator Form Card */}
      <div className="card-container studio-creator-card">
        <div className="creator-card-header">
          <div className="creator-title-group">
            <FolderPlus size={20} className="text-primary" />
            <h3 className="creator-title">Publish New Course</h3>
          </div>
          <span className="creator-hint">Your course will instantly appear in the student catalog</span>
        </div>

        <form onSubmit={handleAddCourseSubmit} className="creator-form-row">
          <div className="creator-input-wrap">
            <input
              type="text"
              className="custom-input creator-input"
              placeholder="e.g. Master React & Spring Boot Full-Stack 2026"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              disabled={creating}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success creator-btn"
            disabled={creating}
          >
            {creating ? (
              <>
                <RefreshCw size={16} className="spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>Publish Course</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Control Bar: Search & Refresh */}
      <div className="dashboard-control-bar">
        <div className="control-bar-title">
          <BookOpen size={18} className="text-primary" />
          <h3 className="section-title-sm">My Published Courses ({courses.length})</h3>
        </div>

        <div className="search-and-refresh">
          <div className="search-input-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search your courses..."
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
            onClick={loadTeacherCourses}
            disabled={loading}
            title="Reload courses"
          >
            <RefreshCw size={16} className={loading ? "spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Teacher Courses List */}
      <div className="teacher-courses-section">
        {loading ? (
          <div className="loading-state-card">
            <RefreshCw size={28} className="spin text-primary" />
            <p>Loading your courses and student rosters...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state-card">
            <Users size={40} className="empty-icon text-primary" />
            <h3>{searchQuery ? "No matching courses found" : "You have not published any courses yet"}</h3>
            <p>
              {searchQuery
                ? "Try searching with a different keyword."
                : "Create your first course using the form above to start enrolling students!"}
            </p>
          </div>
        ) : (
          <div className="teacher-courses-list">
            {filteredCourses.map((c) => {
              const students = Array.isArray(c.userRespDTO) ? c.userRespDTO : [];
              const isExpanded = expandedCourseId === c.cid;
              const isDeleting = deletingCid === c.cid;

              return (
                <div key={c.cid} className="teacher-course-card">
                  {/* Course Card Summary Row */}
                  <div className="teacher-card-main-row">
                    <div className="teacher-course-info">
                      <div className="teacher-card-tags">
                        <span className="course-id-tag">ID #{c.cid}</span>
                        <span className="badge-enrolled-count">
                          <UserCheck size={14} />
                          <span>{students.length} {students.length === 1 ? "Student" : "Students"}</span>
                        </span>
                      </div>
                      <h4 className="teacher-course-title">{c.cname}</h4>
                    </div>

                    <div className="teacher-card-actions">
                      <button
                        type="button"
                        className={`btn ${isExpanded ? "btn-secondary" : "btn-outline"} btn-roster`}
                        onClick={() => toggleRoster(c.cid)}
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp size={16} />
                            <span>Hide Roster</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} />
                            <span>View Roster ({students.length})</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-delete-course"
                        disabled={isDeleting}
                        onClick={() => handleDeleteCourse(c)}
                        title="Delete this course"
                      >
                        {isDeleting ? (
                          <RefreshCw size={14} className="spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Enrolled Students Roster */}
                  {isExpanded && (
                    <div className="roster-drawer">
                      <div className="roster-drawer-header">
                        <Users size={16} className="text-primary" />
                        <h5>Enrolled Students Roster ({students.length})</h5>
                      </div>

                      {students.length === 0 ? (
                        <div className="roster-empty-notice">
                          <span>No students have enrolled in this course yet.</span>
                        </div>
                      ) : (
                        <div className="roster-chips-container">
                          {students.map((stud) => (
                            <div key={stud.uid} className="student-roster-chip">
                              <div className="student-chip-avatar">
                                {(stud.name || "S").charAt(0).toUpperCase()}
                              </div>
                              <div className="student-chip-info">
                                <span className="student-chip-name">{stud.name}</span>
                                {stud.email && (
                                  <span className="student-chip-email">{stud.email}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

