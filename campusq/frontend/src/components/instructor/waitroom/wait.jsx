import React, { useState, useEffect } from 'react';
import './wait.css';

export default function Wait() {
    const [totalStudents, setTotalStudents] = useState(5); // Adjust initial state as necessary
    const [yourPosition, setYourPosition] = useState(2); // Adjust initial state as necessary

    useEffect(() => {
        const fetchActiveSession = async () => {
            try {
                const response = await fetch('/api/active_office_hour_session/');
                if (response.ok) {
                    const data = await response.json();
                    setTotalStudents(/* Logic to determine total students */);
                    setYourPosition(/* Logic to determine your position */);
                    // Update other state variables or logic as needed based on `data`
                } else {
                    console.error('No active session or not authorized');
                    // Additional error handling or state updates can go here
                }
            } catch (error) {
                console.error('Error fetching active session:', error);
            }
        };

        fetchActiveSession();
    }, []); // Empty dependency array means this effect runs once on mount and then on unmount

    // Calculate progress percentage
    const progressPercentage = ((totalStudents - yourPosition + 1) / totalStudents) * 100;

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
        </div>
    );
}
