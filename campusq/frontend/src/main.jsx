import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Login from "./components/login/Login.jsx";
import StudentCode from "./components/student/studentcode/StudentCode.jsx";
import Instructor from "./components/instructor/Instructor.jsx";
import EditQuestions from "./components/instructor/editquestions/EditQuestions.jsx";
import StudentQuestions from "./components/student/studentquestions/StudentQuestions.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/student/code",
    element: <StudentCode />,
  },
  {
    path: "/student/questions",
    element: <StudentQuestions />,
  },
  {
    path: "/instructor",
    element: <Instructor />,
  },
  {
    path: "/instructor/edit",
    element: <EditQuestions />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
