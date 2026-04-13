import { Container } from "../../components";
import bgImage from "../../assets/dramatic-chess-piece.jpg";
import pinGif from "../../assets/PinChessPlaying.gif";

export function Home() {
	return (
		<>
			{/* Background setting the stage */}
			<div className="relative min-h-screen flex items-center justify-center bg-neutral-800 p-6 py-24 overflow-hidden z-0">
				
				{/* Animated Fog */}
				<div className="absolute inset-0 pointer-events-none z-0 opacity-60">
					<div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-neutral-700 rounded-full filter blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
					<div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-neutral-600 rounded-full filter blur-[100px] animate-[pulse_12s_ease-in-out_infinite_alternate]"></div>
					<div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-neutral-700 rounded-full filter blur-[140px] animate-[pulse_10s_ease-in-out_infinite]"></div>
				</div>

				{/* Foreground content */}
				<div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-7xl mx-auto">
					<div className="w-full max-w-[350px] sm:max-w-[400px] lg:max-w-[498px] aspect-square flex-shrink-0">
						<iframe
							className="w-full h-full border-none rounded-2xl shadow-2xl"
							src={pinGif}
							title="Pin playing"></iframe>
					</div>
					<div className="flex flex-col gap-6 sm:gap-8 justify-center items-center max-w-2xl px-4 text-center">
						<h1 className="text-center font-black text-white text-4xl sm:text-5xl lg:text-6xl tracking-tight ">
							Let's play the best chess game of your life ♛
						</h1>
						<button className="relative group overflow-hidden bg-green-600 hover:bg-green-500 rounded-2xl w-full max-w-[320px] h-20 text-white font-black text-xl sm:text-2xl tracking-[0.2em] shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] hover:-translate-y-1 hover:scale-105 active:scale-95 transition-all duration-300 border border-green-400/30">
							<span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-1000 ease-out"></span>
							PLAY GAME
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
