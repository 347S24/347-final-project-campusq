import "./Login.css";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

export default function Login() {
  const cookies = new Cookies();
  const session_token = cookies.get("session_token");

  const loginPerson = (role) => {
    if (session_token) {
      if (role === "teacher") {
        window.location.href = "/instructor";
      } else {
        window.location.href = "/student/code";
      }
    } else {
      window.location.href = `https://canvas.jmu.edu/login/oauth2/auth?state=${role}&scope=/auth/userinfo&response_type=code&client_id=190000000000938&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&scope=url:GET|/api/v1/users/:user_id/profile`;
    }
  };

  return (
    <div id="main">
      <div id="picture">
        <img src="professor-student-chalkboard.png" alt="CampusQ" />
      </div>
      <div id="login">
        <h1 id="title">CampusQ</h1>
        {/* <p id="subtitle"> 
          Welcome to CampusQ, your virtual queue management for office hours. 
          Login and authenticate below to begin!
        </p> */}
        <div id="buttons">
          <button onClick={() => loginPerson('teacher')} className="login-button">Teacher Login</button>
          <button onClick={() => loginPerson('student')} className="login-button">Student Login</button>
        </div>
      </div>
    </div>
  );
}
