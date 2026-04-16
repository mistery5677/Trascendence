import chGif from "../../assets/chessPlay.gif";
import { Board } from "../../components";

export function Play() {
	return (
		<>
			<div className="flex flex-col max-w-full items-center justify-center relative top-20 h-full">
				<div className="flex flex-row text-white gap-[5%] lg:gap-50 md:gap-40">
					{/* left user */}
					<div className="flex flex-row gap-2">
						{/* image */}
						<div>image</div>
						{/* user name & rank */}
						<div className="flex flex-col justify-items-center align-middle items-center">
							<div>username</div>
							<div>rank</div>
						</div>
					</div>
					{/* result */}
					<div>RESULT</div>
					{/* right user */}
					<div className="flex flex-row gap-2">
						{/* user name & rank */}
						<div className="flex flex-col justify-items-center align-middle items-center">
							<div>username</div>
							<div>rank</div>
						</div>
						{/* image */}
						<div>image</div>
					</div>
				</div>
				{/* Board */}
				<div className="w-full max-w-2xl mt-10 px-4">
					<Board />
					{/* <img
						className="w-full h-auto object-contain rounded-2xl shadow-2xl"
						src={chGif}
						alt="Chess playing"
					/> */}
				</div>
			</div>
		</>
	);
}
