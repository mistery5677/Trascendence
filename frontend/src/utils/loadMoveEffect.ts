import moveEffect from "../assets/sounds/chess/move.mp3";

export function loadMoveEffect() {
	const audio = new Audio(moveEffect);

	audio.load();

	return () => {
		audio.currentTime = 0;
		audio.play().catch((error) => console.log("Error playing moveEffect audio", error));
	};
}
