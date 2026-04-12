import { Container } from "../../components";
import bgImage from "../../assets/dramatic-chess-piece.jpg";

export function Home() {
	return (
		<>
			{/* Background image */}
			<div
				className="min-h-screen flex items-center bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: `url(${bgImage})` }}
			></div>
		</>
	);
}
