import "./Login.css";

export default function Login() {
  const studentRedirect = () => {
    window.location.href =
      "https://canvas.jmu.edu/login/oauth2/auth?response_type=code&client_id=190000000000938&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&scope=url:GET|/api/v1/users/:user_id/profile";
      // "student/code"
    };

  const teacherRedirect = () => {
    window.location.href =
      // "https://canvas.jmu.edu/login/oauth2/auth?response_type=code&client_id=190000000000938&redirect_uri=http://localhost:8000/accounts/canvas/login/callback/&scope=url:GET|/api/v1/users/:user_id/profile";
      "instructor"
    };

    return (
    <div id="main">
      <h1 id="title">CampusQ</h1>
      <div id='buttons'>
        <button onClick={teacherRedirect} className="login-button">Teacher Login</button>
        <button onClick={studentRedirect} className="login-button">Student Login</button>
      </div>
    </div>
  );
}
