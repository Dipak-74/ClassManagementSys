import axios from "axios";
import { useState } from "react";
import {
  register,
  login,
  handleloginclclick,
  handleAddCourse,
  handleclick,
  handleMyCourse,
  handlebuycourse,
  handleDeleteBuyCourses,
  AddCourse,
  handleMyAddedCourses
} from "./resigterAndLogin";
import "./App.css";

function App() {
  let [loginUI, SetLoginUI] = useState("login");
  let [loginform, setLoginForm] = useState({
    email: "",
    password: ""
  });
  let [registerUI, setRegisterUI] = useState(null);

  let [registerform, setregitserform] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  let [course, setcourse] = useState({
    cname: "",
    ownerid: ""
  });
  let [role, setRole] = useState(null);
  let [getcourse, setGetCourse] = useState([]);
  let [current, setCurrent] = useState({});
  let [mycourse, setMyCourse] = useState(null);
  let [mycoursebtn, setMyCourseBtn] = useState(false);

  const [myAddedCourses, setMyAddedCourses] = useState([]);
  const [showCourses, setShowCourses] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleregister = (e) => {
    register(e, registerform, setregitserform);
  };
  const handlelogin = (e) => {
    login(e, loginform, setLoginForm);
  };
  const handleloginclick = () => {
    handleloginclclick(SetLoginUI, loginform, setRole, setGetCourse, setCurrent);
  };
  const handleChangeCourse = (e) => {
    AddCourse(e, course, setcourse);
  };
  function hidestudent(cid) {
    if (selectedCourse === cid) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(cid);
    }
  }

  return (
    <div className="app-wrapper">
      {/* LOGIN FORM */}
      {loginUI && (
        <div className="card-container">
          <form className="custom-form">
            <h2 className="form-title">Welcome Back</h2>
            <input
              className="custom-input"
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handlelogin}
            />
            <input
              className="custom-input"
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handlelogin}
            />
            <div className="btn-group">
              <button
                type="reset"
                className="btn btn-primary"
                onClick={handleloginclick}
              >
                Login
              </button>
              <button
                type="reset"
                className="btn btn-secondary"
                onClick={() => (setRegisterUI("register"), SetLoginUI(null))}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTER FORM */}
      {registerUI && (
        <div className="card-container">
          <form className="custom-form">
            <h2 className="form-title">Create Account</h2>
            <input
              className="custom-input"
              type="text"
              name="name"
              placeholder="Enter Name"
              onChange={handleregister}
            />
            <input
              className="custom-input"
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={handleregister}
            />
            <input
              className="custom-input"
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleregister}
            />
            <input
              className="custom-input"
              type="text"
              name="role"
              placeholder="Enter Role (student/teacher)"
              onChange={handleregister}
            />
            <div className="btn-group">
              <button
                type="reset"
                className="btn btn-success"
                onClick={() => {
                  handleclick(registerform, setRegisterUI, SetLoginUI);
                }}
              >
                Register
              </button>
              <button
                type="reset"
                className="btn btn-danger"
                onClick={() => {
                  SetLoginUI("login");
                  setRegisterUI(null);
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DASHBOARD AREA */}
      {role && (
        <div className="card-container dashboard-container">
          {role === "student" ? (
            <div>
              <h2 className="section-header">Available Courses</h2>
              {getcourse.map((ele, index) => {
                return (
                  <div key={index} className="course-card">
                    <span className="course-title">{ele.cname}</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: "auto", padding: "8px 24px" }}
                      onClick={() => {
                        handlebuycourse(ele.cid, current.uid, setMyCourse);
                      }}
                    >
                      Buy Course
                    </button>
                  </div>
                );
              })}

              <div style={{ marginTop: "28px" }}>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    handleMyCourse(setMyCourse, current.uid);
                    setMyCourseBtn(!mycoursebtn);
                  }}
                >
                  My Courses
                </button>
              </div>

              {mycourse && mycoursebtn && (
                <div style={{ marginTop: "24px" }}>
                  <h3 className="section-header">Purchased Courses</h3>
                  {mycourse.map((ele, index) => {
                    return (
                      <div key={index} className="course-card">
                        <span className="course-title">{ele.cname}</span>
                        <button
                          className="btn btn-danger"
                          style={{ width: "auto", padding: "8px 18px" }}
                          onClick={() => {
                            handleDeleteBuyCourses(
                              ele.cid,
                              current.uid,
                              setMyCourse
                            );
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="section-header">Teacher Portal</h2>
              <form className="custom-form" style={{ marginBottom: "24px" }}>
                <input
                  className="custom-input"
                  type="text"
                  name="cname"
                  placeholder="Course Name"
                  onChange={handleChangeCourse}
                />
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handleAddCourse(course, current.uid)}
                >
                  Add Course
                </button>
              </form>

              <button
                className="btn btn-primary"
                onClick={() =>
                  handleMyAddedCourses(
                    current.uid,
                    setMyAddedCourses,
                    showCourses,
                    setShowCourses
                  )
                }
              >
                My Added Courses
              </button>

              {showCourses && myAddedCourses.length > 0 && (
                <div style={{ marginTop: "24px" }}>
                  {myAddedCourses.map((ele) => (
                    <div
                      key={ele.cid}
                      className="course-card"
                      style={{ flexDirection: "column", alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          display: "flex",
                            justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center"
                        }}
                      >
                        <span className="course-title">{ele.cname}</span>
                        <button
                          className="btn btn-outline"
                          style={{ width: "auto", padding: "6px 14px" }}
                          onClick={() => hidestudent(ele.cid)}
                        >
                          {selectedCourse === ele.cid
                            ? "Hide Students"
                            : "Show Students"}
                        </button>
                      </div>

                      {selectedCourse === ele.cid && (
                        <div className="student-box" style={{ width: "100%" }}>
                          {ele.userRespDTO.length === 0 ? (
                            <span className="empty-msg">No enrolled students</span>
                          ) : (
                            ele.userRespDTO.map((stud, index) => (
                              <span key={index} className="student-name">
                                {stud.name}
                              </span>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;