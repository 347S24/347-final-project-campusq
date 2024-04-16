import "./Login.css";
import Cookies from "universal-cookie";

export default function Login() {
  const cookies = new Cookies();
  const session_token = cookies.get("session_token");

  const studentRedirect = () => {
    if (session_token) {
      window.location.href = "/student/code";
    } else {
      window.location.href =
        "https://canvas.jmu.edu/login/oauth2/auth?scope=/auth/userinfo&response_type=code&client_id=190000000000938&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&scope=url:GET|/api/v1/users/:user_id/profile";
      // "student/code"
    }
  };

  const teacherRedirect = () => {
    window.location.href =
      // "https://canvas.jmu.edu/login/oauth2/auth?response_type=code&client_id=190000000000938&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&scope=url:GET|/api/v1/users/:user_id/profile";
      "instructor";
  };

  return (
    <div id="main">
      <h1 id="title">CampusQ</h1>
      <div id="buttons">
        <button onClick={teacherRedirect} className="login-button">
          Teacher Login
        </button>
        <button onClick={studentRedirect} className="login-button">
          Student Login
        </button>
      </div>
    </div>
  );
}
