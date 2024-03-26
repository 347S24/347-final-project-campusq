import "./Instructor.css";
import StudentBar from "./studentbar/StudentBar.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Instructor() {
  let [student, setStudent] = useState([]);

  const addStudent = () => {
    setStudent([
      ...student,
      <StudentBar name={`student #${student.length}`} />,
    ]);
  };

  const inviteStudent = () => {
    setStudent((students) => {
      return students.slice(1);
    });
  };
  return (
    <div style={{}}>
      <button onClick={addStudent}>add student</button>
      <button onClick={inviteStudent}>invite student</button>
      <Link to={'/instructor/edit'}>
        <button>Edit questions</button>
      </Link>
      <div className="wrapper">{student}</div>
    </div>
  );
}
