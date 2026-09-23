import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://classmanagement-backend.onrender.com";

export function getBaseUrl() {
  return BASE_URL;
}

// User Session Management
const USER_STORAGE_KEY = "cms_active_user";

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.uid && user.role) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
}

export function storeUser(user) {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function clearStoredUser() {
  localStorage.removeItem(USER_STORAGE_KEY);
}

// Helper to extract clean error message
export function getErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) {
    return data;
  }
  if (data?.message) {
    return data.message;
  }
  if (data?.error) {
    return data.error;
  }
  if (error?.message) {
    if (error.message.includes("Network Error")) {
      return "Unable to connect to backend server. Please verify backend is running.";
    }
    return error.message;
  }
  return fallback;
}

// ----------------- API Methods ----------------- //

export async function apiLogin(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  if (!cleanEmail || !cleanPassword) {
    throw new Error("Please enter both email and password");
  }

  const res = await axios.post(`${getBaseUrl()}/users/login`, {
    email: cleanEmail,
    password: cleanPassword,
  }, { timeout: 25000 });

  if (!res.data || !res.data.uid) {
    throw new Error("Invalid email or password");
  }

  const role = (res.data.role || "").trim().toLowerCase();
  const user = {
    ...res.data,
    role,
  };

  storeUser(user);
  return user;
}

export async function apiRegister(name, email, password, role) {
  const cleanName = (name || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();
  const cleanRole = (role || "").trim().toLowerCase();

  if (!cleanName || !cleanEmail || !cleanPassword || !cleanRole) {
    throw new Error("All fields are required");
  }
  if (!cleanEmail.includes("@")) {
    throw new Error("Please enter a valid email address");
  }
  if (cleanPassword.length < 5) {
    throw new Error("Password must be at least 5 characters");
  }
  if (cleanRole !== "student" && cleanRole !== "teacher") {
    throw new Error("Role must be student or teacher");
  }

  const res = await axios.post(`${getBaseUrl()}/users/adduser`, {
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
    role: cleanRole,
  }, { timeout: 25000 });

  const msg = typeof res.data === "string" ? res.data : "";
  if (!msg.toLowerCase().includes("registered")) {
    throw new Error(msg || "Registration failed");
  }

  return msg || "Registered successfully";
}

export async function apiGetAllCourses() {
  try {
    const res = await axios.get(`${getBaseUrl()}/course/getallcourse`, { timeout: 25000 });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("apiGetAllCourses error:", err);
    return [];
  }
}

export async function apiGetMyBuyCourses(uid) {
  if (!uid) return [];
  try {
    const res = await axios.get(`${getBaseUrl()}/course/getmybuycourses/${uid}`, { timeout: 25000 });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.warn("Unable to fetch enrolled courses:", err);
    return [];
  }
}

export async function apiBuyCourse(cid, uid) {
  if (!cid || !uid) throw new Error("Invalid course or user ID");
  const res = await axios.post(`${getBaseUrl()}/users/buycourse/${cid}/${uid}`, {}, { timeout: 25000 });
  const msg = typeof res.data === "string" ? res.data : "";
  if (msg.toLowerCase().includes("already")) {
    throw new Error(msg);
  }
  return msg || "Course enrolled successfully";
}

export async function apiDeleteBuyCourse(cid, uid) {
  if (!cid || !uid) throw new Error("Invalid course or user ID");
  const res = await axios.delete(`${getBaseUrl()}/users/delete/${cid}/${uid}`, { timeout: 25000 });
  return typeof res.data === "string" ? res.data : "Course dropped successfully";
}

export async function apiAddCourse(cname, ownerid) {
  const name = (cname || "").trim();
  if (!name) throw new Error("Course name cannot be empty");
  if (!ownerid) throw new Error("User ID missing. Please login again.");

  const res = await axios.post(`${getBaseUrl()}/course/addcourse`, {
    cname: name,
    ownerid: ownerid,
  }, { timeout: 25000 });

  return typeof res.data === "string" ? res.data : "Course created successfully";
}

export async function apiGetTeacherCourses(ownerid) {
  if (!ownerid) return [];
  try {
    const res = await axios.get(`${getBaseUrl()}/course/getmycourses/${ownerid}`, { timeout: 25000 });
    if (Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error("Invalid response format");
  } catch (err) {
    console.warn("Unable to fetch teacher courses with roster, using fallback:", err);
    try {
      const all = await apiGetAllCourses();
      return all
        .filter((c) => Number(c.ownerid) === Number(ownerid))
        .map((c) => ({ ...c, userRespDTO: [] }));
    } catch {
      return [];
    }
  }
}

export async function apiDeleteTeacherCourse(cid, ownerid) {
  if (!cid || !ownerid) throw new Error("Invalid course or owner ID");
  const res = await axios.delete(`${getBaseUrl()}/course/delete/${cid}/${ownerid}`, { timeout: 25000 });
  return typeof res.data === "string" ? res.data : "Course deleted successfully";
}