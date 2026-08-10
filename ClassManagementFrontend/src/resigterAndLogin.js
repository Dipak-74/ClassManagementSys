import axios from "axios";

const BASE_URL = "https://classmanagement-backend.onrender.com";

export function register(e, registerform, setregisterform) {
  setregisterform({
    ...registerform,
    [e.target.name]: e.target.value,
  });
}

export function login(e, loginform, setLoginForm) {
  setLoginForm({
    ...loginform,
    [e.target.name]: e.target.value,
  });
}

export function AddCourse(e, course, setcourse) {
  setcourse({
    ...course,
    [e.target.name]: e.target.value,
  });
}

export const handleloginclclick = async (
  SetLoginUI,
  loginform,
  setRole,
  setGetCourse,
  setCurrent
) => {
  // Spaces पूर्ण काढून टाकणे आणि Small Letters मध्ये करणे
  const email = (loginform?.email || "").replace(/\s+/g, "").toLowerCase();
  const password = (loginform?.password || "").trim(); // पासवर्डमधील फक्त पुढच्या-मागच्या स्पेस काढल्या आहेत

  if (email === "" || password === "") {
    alert("Please enter email and password");
    return;
  }

  try {
    const resp = await axios.post(
      `${BASE_URL}/users/login`,
      {
        ...loginform,
        email: email, // Validated email पाठवले
      }
    );
    
    // Role मधील Space आणि Case Ignore
    const role = (resp.data.role || "").replace(/\s+/g, "").toLowerCase();

    if (role !== "student" && role !== "teacher") {
      alert("Email or password not matched");
      return;
    }

    SetLoginUI(null);
    setRole(role);
    setCurrent({
      ...resp.data,
      role,
    });

    const response = await axios.get(
      `${BASE_URL}/course/getallcourse`
    );

    setGetCourse(response.data);
  } catch (error) {
    console.error(error);
    alert("Login failed");
  }
};

export const handleclick = async (
  registerform,
  setRegisterUI,
  SetLoginUI
) => {
  // Role, Name, Email मधील Spaces आणि Capital/Small Case Ignore करणे
  const role = (registerform?.role || "").replace(/\s+/g, "").toLowerCase();
  const name = (registerform?.name || "").trim();
  const email = (registerform?.email || "").replace(/\s+/g, "").toLowerCase();
  const password = (registerform?.password || "").trim();

  if (role === "" || name === "" || email === "" || password === "") {
    alert("Please fill all fields");
    return;
  }
  if (!email.includes("@")) {
    alert("Enter valid email");
    return;
  }
  if (password.length < 5) {
    alert("Password must be at least 5 characters");
    return;
  }

  try {
    const resp = await axios.post(
      `${BASE_URL}/users/adduser`,
      {
        ...registerform,
        email: email,
        role: role
      }
    );
    
    // Backend प्रतिसाद चेक करताना Case Ignore करणे
    const responseData = (typeof resp.data === "string" ? resp.data : "").trim().toLowerCase();

    if (!responseData.includes("sucussfully registed")) {
      alert(resp.data);
      return;
    }

    alert("SucussFully Registed");
    setRegisterUI(null);
    SetLoginUI("login");
  } catch (error) {
    console.error(error);
    alert("Registration failed");
  }
};

export const handleAddCourse = async (course, uid) => {
  const cname = (course?.cname || "").trim();

  if (!uid) {
    alert("User ID missing. Please login again.");
    return;
  }

  if (cname === "") {
    alert("Enter course name");
    return;
  }

  const courseData = {
    ...course,
    ownerid: uid,
  };

  try {
    const resp = await axios.post(
      `${BASE_URL}/course/addcourse`,
      courseData
    );
    alert(resp.data);
  } catch (error) {
    console.error(error);
    alert("Failed to add course");
  }
};

export const handleMyCourse = async (setMyCourse, uid) => {
  if (!uid) return;

  try {
    const resp = await axios.get(
      `${BASE_URL}/course/getmybuycourses/${uid}`
    );
    setMyCourse(resp.data);
  } catch (error) {
    console.error(error);
  }
};

export const handlebuycourse = async (cid, uid, setMyCourse) => {
  if (!cid || !uid) {
    alert("Invalid course or user ID");
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/users/buycourse/${cid}/${uid}`
    );
    handleMyCourse(setMyCourse, uid);
  } catch (error) {
    console.error(error);
  }
};

export const handleDeleteBuyCourses = async (
  cid,
  uid,
  setMyCourse
) => {
  if (!cid || !uid) return;

  try {
    await axios.delete(
      `${BASE_URL}/users/delete/${cid}/${uid}`
    );
    handleMyCourse(setMyCourse, uid);
  } catch (error) {
    console.error(error);
  }
};

export const handleMyAddedCourses = async (
  uid,
  setMyAddedCourses,
  showCourses,
  setShowCourses
) => {
  if (showCourses) {
    setShowCourses(false);
    return;
  }

  if (!uid) {
    alert("User ID missing");
    return;
  }

  try {
    const resp = await axios.get(
      `${BASE_URL}/course/getmycourses/${uid}`
    );
    setMyAddedCourses(resp.data);
    setShowCourses(true);
  } catch (error) {
    console.error(error);
  }
};