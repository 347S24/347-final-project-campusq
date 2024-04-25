import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import "./wait.css";

export default function WaitRoom() {
  const location = useLocation();
  console.log("location state:", location.state);
  const [totalStudents, setTotalStudents] = useState(0);
  const [yourPosition, setYourPosition] = useState(0);
  const [isInLine, setIsInLine] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const progressPercentage =
    yourPosition > 0
      ? ((totalStudents - yourPosition + 1) / totalStudents) * 100
      : 0;

  const leaveWaitroom = async () => {
    const response = await fetch("http://localhost:8000/api/leave_waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      credentials: "include",
    });
    if (response.ok) {
      console.log("Left waitlist successfully");
      setRedirect(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching student waitlist info");
      const response = await fetch(
        "http://localhost:8000/api/student_waitlist_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "text/plain",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Successfully fetched student waitlist info");
        const jsonData = await response.json();
        setTotalStudents(jsonData.totalInQ);
        setYourPosition(jsonData.position);
        setIsInLine(true);
        console.log("jsondata:", jsonData);
      }
    };
    fetchData();
  }, []);

  if (redirect) {
    return <Navigate to="/student/code" />;
  }
  return (
    <div className="wait-container">
      <h1>Office Hours Waiting Room</h1>
      <p>Your position in line:</p>
      <div className="progress-bar-container" id="progressBarContainer">
        <div
          className="progress-bar"
          id="progressBar"
          style={{ width: `${progressPercentage}%` }}
        >
          Your Position: {yourPosition} of {totalStudents}
        </div>
      </div>
      <p id="positionText">You are currently number {yourPosition} in line.</p>
      <button onClick={leaveWaitroom}>Leave Waitroom</button>
    </div>
  );
}
