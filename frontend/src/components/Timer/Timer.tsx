import { useEffect, useState } from "react";

type TimerProps = {
    timeLeftInSeconds: number;
    isRunning: boolean;
    onTimeUp?: () => void;
};

export function Timer({ timeLeftInSeconds, isRunning, onTimeUp }: TimerProps) {
    useEffect(() => {
        if (timeLeftInSeconds <= 0 && isRunning && onTimeUp) {
            onTimeUp();
        }
    }, [timeLeftInSeconds, isRunning, onTimeUp]);

    const minutes = Math.floor(Math.max(0, timeLeftInSeconds) / 60);
    const seconds = Math.floor(Math.max(0, timeLeftInSeconds) % 60);
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    return (
        <div className={`font-mono font-black text-2xl sm:text-xs md:text-md xl:text-xl tracking-wider ${timeLeftInSeconds <= 10 ? 'text-red-500 animate-pulse' : 'text-stone-100'}`}>
            {formattedTime}
        </div>
    );
}
