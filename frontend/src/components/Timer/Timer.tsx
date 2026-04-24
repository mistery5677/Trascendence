import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

type TimerProps = {
	startTimerInSeconds: number;
	isRunning: boolean;
};

export function Timer({ startTimerInSeconds, isRunning }: TimerProps) {
	const [key, setKey] = useState(0);

	useEffect(() => {
		setKey((prevKey) => prevKey + 1); // Reset the timer by changing the key
	}, [startTimerInSeconds]);

	return (
		<div>
			<CountdownCircleTimer
				key={key} // Ensure the timer resets when the key changes
				isPlaying={isRunning ? true : false}
				size={60}
				strokeLinecap="butt"
				strokeWidth={3}
				initialRemainingTime={startTimerInSeconds}
				duration={startTimerInSeconds}
				colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
				colorsTime={[7, 5, 2, 0]}>
				{({ remainingTime }) => remainingTime}
			</CountdownCircleTimer>
		</div>
	);
}
