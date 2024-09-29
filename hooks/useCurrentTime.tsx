'use client'
import { useEffect, useState } from "react";

// Custom hook for getting the current time with consistent formatting
const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Use 'vi-VN' locale and ensure a consistent format (24-hour or 12-hour as needed)
    const formattedTime = currentTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,  // Ensure 24-hour format
    });

    return formattedTime;
}

export default useCurrentTime;
