import { useEffect, useState } from 'react';

export const useRelativeTime = (timestamp: string): string => {
    const [relativeTime, setRelativeTime] = useState<string>('');

    useEffect(() => {
        const calculateTimeDifference = () => {
            const now = new Date();
            const pastDate = new Date(timestamp);
            const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

            if (diffInSeconds < 60) {
                return `hace ${diffInSeconds} segundo${diffInSeconds !== 1 ? 's' : ''}`;
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                return `hace ${days} día${days !== 1 ? 's' : ''}`;
            }
        };

        const updateRelativeTime = () => {
            setRelativeTime(calculateTimeDifference());
        };

        updateRelativeTime();

        let interval: NodeJS.Timeout;

        const now = new Date();
        const pastDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            // Actualiza cada segundo si ha transcurrido menos de un minuto
            interval = setInterval(updateRelativeTime, 1000);
        } else {
            // Actualiza cada minuto si ha transcurrido un minuto o más
            interval = setInterval(updateRelativeTime, 60000);
        }

        return () => clearInterval(interval);
    }, [timestamp]);

    return relativeTime;
};