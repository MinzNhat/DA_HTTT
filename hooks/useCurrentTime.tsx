'use client';
import { useEffect, useState } from "react";

// Custom hook for getting the current time with consistent formatting
const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);  // Set null initially

    useEffect(() => {
        // Check if window exists to ensure we are on the client side
        if (typeof window !== "undefined") {
            setCurrentTime(new Date());  // Set initial time on client-side only

            const interval = setInterval(() => {
                setCurrentTime(new Date());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    // If currentTime is null (SSR), return an empty string or placeholder
    if (!currentTime) return "";  // Prevent rendering time during SSR

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
