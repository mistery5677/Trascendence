import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

type TimerProps = {
	startTimerInSeconds: number;
	isRunning: boolean;
};

const getTimerSize = () => {
	const base = Math.min(window.innerWidth, window.innerHeight);
	return Math.max(20, Math.min(base * 0.10, 58));
};

const getTimerFontSize = (timerSize: number) => Math.max(8, Math.floor(timerSize * 0.38));

export function Timer({ startTimerInSeconds, isRunning }: TimerProps) {
	const [key, setKey] = useState(0);
	const [timerSize, setTimerSize] = useState(getTimerSize());
	const remainingTimeFontSize = getTimerFontSize(timerSize);

	useEffect(() => {
		setKey((prevKey) => prevKey + 1);
	}, [startTimerInSeconds]);

	useEffect(() => {
		const handleResize = () => {
			setTimerSize(getTimerSize());
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<div>
			<CountdownCircleTimer
				key={key}
				isPlaying={isRunning ? true : false}
				size={timerSize}
				strokeLinecap="butt"
				strokeWidth={3}
				initialRemainingTime={startTimerInSeconds}
				duration={startTimerInSeconds}
				colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
				colorsTime={[7, 5, 2, 0]}>
				{({ remainingTime }) => (
					<span style={{ fontSize: `${remainingTimeFontSize}px`, fontWeight: 600 }}>{remainingTime}</span>
				)}
			</CountdownCircleTimer>
		</div>
	);
}
