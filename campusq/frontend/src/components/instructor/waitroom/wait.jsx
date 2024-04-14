import React, { useState, useEffect } from 'react';
import './wait.css';

export default function Wait() {
    const [totalStudents, setTotalStudents] = useState(0);
    const [yourPosition, setYourPosition] = useState(0);
    const [isInLine, setIsInLine] = useState(false);

    useEffect(() => {
        const fetchActiveSession = async () => {
            try {
                const response = await fetch('/api/active_office_hour_session/');
                if (response.ok) {
                    const data = await response.json();
                    // Assume data contains total queue size and your position (if any)
                    setTotalStudents(data.totalStudents || 0);
                    setYourPosition(data.yourPosition || 0);
                    setIsInLine(data.yourPosition > 0);
                } else {
                    console.error('No active session or not authorized');
                }
            } catch (error) {
                console.error('Error fetching active session:', error);
            }
        };

        fetchActiveSession();
    }, []);

    const handleJoinWaitlist = () => {
        if (!isInLine) {
            setTotalStudents(prevTotal => prevTotal + 1);
            setYourPosition(prevPosition => prevPosition === 0 ? 1 : prevPosition);
            setIsInLine(true);
        }
    };

    // Simulate the professor letting a student in
    const handleStudentProcessed = () => {
        if (totalStudents > 0) {
            setTotalStudents(prevTotal => prevTotal - 1);
            if (yourPosition > 1) {
                setYourPosition(prevPosition => prevPosition - 1);
            } else if (yourPosition === 1) {
                setIsInLine(false);
                setYourPosition(0);
            }
        }
    };

    const progressPercentage = yourPosition > 0 ? ((totalStudents - yourPosition + 1) / totalStudents) * 100 : 0;

    return (
        <div className="wait-container">
            <h1>Office Hours Waiting Room</h1>
            <p>Your position in line:</p>
            <div className="progress-bar-container" id="progressBarContainer">
                <div className="progress-bar" id="progressBar" style={{ width: `${progressPercentage}%` }}>
                    Your Position: {yourPosition} of {totalStudents}
                </div>
            </div>
            <p id="positionText">You are currently number {yourPosition} in line.</p>
            {!isInLine && <button onClick={handleJoinWaitlist}>Join Waitlist</button>}
            {/* Button to simulate a student being processed, for testing */}
            <button onClick={handleStudentProcessed}>Process Next Student</button>
        </div>
    );
}

