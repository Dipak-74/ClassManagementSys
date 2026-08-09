import axios from "axios";
import App from "./App";

export function register(e, registerform, setregisterform) {
    setregisterform({ ...registerform, [e.target.name]: e.target.value });
}
export function login(e,loginform,setLoginForm){
    setLoginForm({...loginform,[e.target.name]:e.target.value})
}
export function AddCourse(e,course,setcourse){
    setcourse({...course,[e.target.name]:e.target.value})
}
 export let handleloginclclick = async (
    SetLoginUI,
    loginform,
    setRole,
    setGetCourse,
    setCurrent
) => {

    if (
        loginform.email.trim() === "" ||
        loginform.password.trim() === ""
    ) {
        alert("Please enter email and password");
        return;
    }

    let resp = await axios.post(
        "http://localhost:8080/users/login",
        loginform
    );

    if (
        resp.data.role !== "student" &&
        resp.data.role !== "teacher"
    ) {
        alert("Email or password not matched");
        return;
    }

    SetLoginUI(null);
    setRole(resp.data.role);
    setCurrent(resp.data);

    let response = await axios.get(
        "http://localhost:8080/course/getallcourse"
    );

    setGetCourse(response.data);
};

 export const handleclick = async (registerform, setRegisterUI, SetLoginUI) => {

    if (
        registerform.role.trim() === "" ||
        registerform.name.trim() === "" ||
        registerform.email.trim() === "" ||
        registerform.password.trim() === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    if (!registerform.email.includes("@")) {
        alert("Enter valid email");
        return;
    }

    if (registerform.password.length < 5) {
        alert("Password must be at least 5 characters");
        return;
    }

    let resp = await axios.post(
        "http://localhost:8080/users/adduser",
        registerform
    );

    if (resp.data !== "SucussFully Registed") {
        alert(resp.data);
        return;
    }

    alert("SucussFully Registed");
    setRegisterUI(null);
    SetLoginUI("login");
};



 export const handleAddCourse = async (course, uid) => {

    if (course.cname.trim() === "") {
        alert("Enter course name");
        return;
    }

    course.ownerid = uid;

    let resp = await axios.post(
        "http://localhost:8080/course/addcourse",
        course
    );

    alert(resp.data);
};


  export const handleMyCourse=async(setMyCourse,uid)=>{

    let resp = await axios.get(`http://localhost:8080/course/getmybuycourses/${uid}`);
    setMyCourse(resp.data);
    console.log("bgbgg");
    console.log(resp.data);
    
    

  }

  export const handlebuycourse= async(cid,uid,setMyCourse)=>{
        let resp=await axios.post(`http://localhost:8080/users/buycourse/${cid}/${uid}`);
        
        handleMyCourse(setMyCourse,uid);
        
        
  }

  export const handleDeleteBuyCourses= async(cid,uid,setMyCourse)=>{
        let resp=await axios.delete(`http://localhost:8080/users/delete/${cid}/${uid}`);
        handleMyCourse(setMyCourse,uid);

  }
  export const handleMyAddedCourses=async(uid,setMyAddedCourses,showCourses,setShowCourses)=>{

        if (showCourses) {
    setShowCourses(false);  
    return;
  }

  let resp = await axios.get(
    `http://localhost:8080/course/getmycourses/${uid}`
  );

  setMyAddedCourses(resp.data);
  setShowCourses(true);
  }