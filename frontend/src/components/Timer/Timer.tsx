import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

type TimerProps = {
	startTimerInSeconds: number;
	isRunning: boolean;
};

const getTimerSize = (width: number) => (width <= 480 ? 30 : 60);

export function Timer({ startTimerInSeconds, isRunning }: TimerProps) {
	const [key, setKey] = useState(0);
	const [timerSize, setTimerSize] = useState(getTimerSize(window.innerWidth));
	const remainingTimeFontSize = timerSize <= 30 ? 11 : 20;

	useEffect(() => {
		setKey((prevKey) => prevKey + 1);
	}, [startTimerInSeconds]);

	useEffect(() => {
		const handleResize = () => {
			setTimerSize(getTimerSize(window.innerWidth));
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div>
			<CountdownCircleTimer
				key={key} // Ensure the timer resets when the key changes
				isPlaying={isRunning ? true : false}
				size={timerSize}
				strokeLinecap="butt"
				strokeWidth={3}
				initialRemainingTime={startTimerInSeconds}
				duration={startTimerInSeconds}
				colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
				colorsTime={[7, 5, 2, 0]}>
				{({ remainingTime }) => (
					<span style={{ fontSize: `${remainingTimeFontSize}px`, fontWeight: 600 }}>
						{remainingTime}
					</span>
				)}
			</CountdownCircleTimer>
		</div>
	);
}
