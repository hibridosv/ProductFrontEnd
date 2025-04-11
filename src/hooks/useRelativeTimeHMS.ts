import { useEffect, useState } from 'react';

export const useRelativeTime = (timestamp: string): string => {
    const [relativeTime, setRelativeTime] = useState<string>('');

    useEffect(() => {
        const calculateTimeDifference = () => {
            const now = new Date();
            const pastDate = new Date(timestamp);
            const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

            if (diffInSeconds < 60) {
                return `Hace ${diffInSeconds} segundo${diffInSeconds !== 1 ? 's' : ''}`;
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                const remainingMinutes = Math.floor((diffInSeconds % 3600) / 60);
                // Mostrar "hace X horas" si no hay minutos restantes
                if (remainingMinutes === 0) {
                    return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
                }
                // Mostrar "hace X horas Y minutos" cuando hay minutos restantes
                return `Hace ${hours} H y ${remainingMinutes} Min`;
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                return `Hace ${days} día${days !== 1 ? 's' : ''}`;
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
            interval = setInterval(updateRelativeTime, 1000);
        } else {
            interval = setInterval(updateRelativeTime, 60000);
        }

        return () => clearInterval(interval);
    }, [timestamp]);

    return relativeTime;
};