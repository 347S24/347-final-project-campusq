import React, { createContext, useState, useEffect } from 'react';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
    const [queue, setQueue] = useState({
        students: [],
        total: 0,
        position: null
    });

    const joinSession = async (sessionCode) => {
        const response = await fetch('http://127.0.0.1:8000/api/join_waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: sessionCode })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Join waitlist:', data);
            fetchData(sessionCode); // Fetch new queue data
        } else {
            console.error('Failed to join waitlist');
        }
    };

    const fetchData = async (sessionCode) => {
        // Here you'd fetch data from an API using the sessionCode
        const response = await fetch(`http://127.0.0.1:8000/api/waitlist_details?session_code=${sessionCode}`);
        if (response.ok) {
            const data = await response.json();
            setQueue({
                students: data.students,
                total: data.total,
                position: data.position
            });
        } else {
            console.error('Failed to fetch waitlist details');
        }
    };

    return (
        <QueueContext.Provider value={{ ...queue, joinSession }}>
            {children}
        </QueueContext.Provider>
    );
};

export { QueueContext };  // Named export


