import "./Instructor.css";
import StudentBar from "./studentbar/StudentBar.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Instructor() {
  let [student, setStudent] = useState([]);

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
  return (
    <div style={{}}>
      <button onClick={addStudent}>Add Student</button>
      <button onClick={inviteStudent}>Invite Student</button>
      <Link to={'/instructor/edit'}>
        <button>Edit questions</button>
      </Link>
      <div className="wrapper">{student}</div>
    </div>
  );
}
