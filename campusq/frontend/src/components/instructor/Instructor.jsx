import "./Instructor.css";
import StudentBar from "./studentbar/StudentBar.jsx";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import TestView from "../../TestView.jsx";

export default function Instructor() {
  const [student, setStudent] = useState([]);
  const [data, setData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  const [code, setCode] = useState("1234");

  const addStudent = () => {
    setStudent([
      ...student,
      <StudentBar name={`student #${student.length + 1}`} />, // Added + 1 becuase current student.length count starts at 0
    ]);
  };

  const inviteStudent = () => {
    setStudent((students) => {
      return students.slice(1);
    });
  };

  const init = async () => {
    const response = await fetch("http://localhost:8000/api/instructor/info", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
      credentials: "include",
    });

    if (response.ok) {
      console.log("Successfully fetched instructor info");
      const jsonData = await response.json();

      console.log("data:", jsonData);
      setData(jsonData);

      setCode(jsonData.sessioncode);
      setQuestions(jsonData.questions);
      setAnswers(jsonData.answers);
    } else {
      console.error("Failed to fetch instructor info");
    }
  };

  useEffect(() => {
    init();
  }, []);

  console.log("data", data);
  console.log("sessioncode", data.sessioncode);

  return (
    <div style={{}}>
      <button onClick={addStudent}>Add Student</button>
      <button onClick={inviteStudent}>Invite Student</button>
      <Link to={"/instructor/edit"}>
        <button>Edit questions</button>
      </Link>

      <TestView
        code={data.sessioncode}
        questions={questions}
        answers={answers}
      />
      <div className="wrapper">{student}</div>
    </div>
  );
}
