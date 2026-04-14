import chGif from "../../assets/chessPlay.gif";
import React from "react";

export function Play() {
	return (
		<>
			<div className="flex flex-col max-w-full items-center justify-center relative top-20 h-full">
				<div className="flex flex-row gap-50 text-white">
					{/* left user */}
					<div className="flex flex-row gap-2">
						<div>image</div>
						<div className="flex flex-col justify-items-center align-middle items-center">
						<div>username</div>
						<div>rank</div>
						</div>
					</div>
					{/* result */}
					<div>RESULT</div>
					{/* right user */}
					<div>right user</div>
				</div>
				{/* Board */}
				<div className="w-full max-w-2xl mt-10 px-4">
					<img
						className="w-full h-auto object-contain rounded-2xl shadow-2xl"
						src={chGif}
						alt="Chess playing"
					/>
				</div>
			</div>
		</>
	);
}
