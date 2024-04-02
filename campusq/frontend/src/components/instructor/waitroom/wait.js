import React, { useState, useEffect } from 'react';
import './Wait.css';

export default function Wait() {
    const [totalStudents, setTotalStudents] = useState(5); // Initially set to 5, adjust as necessary
    const [yourPosition, setYourPosition] = useState(2); // Initially set to 2, adjust as necessary

    useEffect(() => {
        const updateWaitingList = () => {
            // Here you would fetch the actual data from the server
            // For now, we're using static values
            // setTotalStudents(fetchedTotalStudents);
            // setYourPosition(fetchedYourPosition);

            // Example: Simulate fetching data
            setTotalStudents(5); // Static value, replace with fetched data
            setYourPosition(2); // Static value, replace with fetched data
        };

        // Call the update function once immediately and then set the interval
        updateWaitingList();
        const intervalId = setInterval(updateWaitingList, 5000); // Update every 5 seconds

        // Clean-up function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
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
