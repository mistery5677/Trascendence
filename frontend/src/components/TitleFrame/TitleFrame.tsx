type TitleFrameProps = {
	children: React.ReactNode;
	meta?: string;
	className?: string;
};

export function TitleFrame({ children, meta = "", className = "", ...props }: TitleFrameProps) {
	return (
		<div
			className={`relative inline-flex items-center gap-4 pl-3 pr-5 py-2 
                bg-linear-to-r from-emerald-950/30 via-sidebar-bg/90 to-sidebar-bg/40
                border-y border-r border-stone-800/80 border-l-2 
                backdrop-blur-md shadow-xl select-none group ${className}`}
			{...props}>
			{/* Left Accent: Mechanical Threat Stripes */}
			<div
				aria-hidden="true"
				className="flex flex-col gap-0.75 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
				<div className="w-1.5 h-3 bg-button-green transform -skew-x-12" />
				<div className="w-1.5 h-1 bg-button-green/40 transform -skew-x-12" />
			</div>

			{/* Core Typography Block */}
			<div className="flex flex-col justify-center min-w-0 max-w-full">
				{meta && (
					<span className="text-[9px] font-mono font-bold tracking-[0.25em] text-button-green opacity-70 uppercase leading-none mb-1">
						{meta}
					</span>
				)}
				<h2 className=" font-black tracking-widest  text-stone-100 uppercase leading-none whitespace-nowrap ">
					{children}
				</h2>
			</div>

			{/* Tech Decal: Right Sub-Border Wire */}
			<div
				aria-hidden="true"
				className="absolute right-0 top-0 bottom-0 w-1 bg-linear-to-b from-button-green/60 via-transparent to-button-green/20"
			/>

			{/* Precision Crosshair Target (Top Right Corner) */}
			<div
				aria-hidden="true"
				className="absolute -top-px -right-px w-2 h-2 pointer-events-none">
				<div className="absolute top-0 right-0 w-2 h-px bg-stone-600" />
				<div className="absolute top-0 right-0 w-px h-2 bg-stone-600" />
			</div>

			{/* Sub-surface Glowing Target Line */}
			<div className="absolute bottom-0 left-8 right-6 h-px bg-linear-to-r from-button-green/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
		</div>
	);
}

// export function TitleFrame({ children }: { children: React.ReactNode }) {
// 	return (
// 		<div className="relative w-full h-full flex items-center justify-start">
// 			<div className="relative inline-flex items-center gap-2 px-3.5 py-1.5 pl-2.5 rounded-sm border border-emerald-300/15 bg-sidebar-bg text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm">
// 				{/* Checker chip */}
// 				<div
// 					aria-hidden="true"
// 					className="w-4 h-4 shrink-0 bg-[linear-gradient(45deg,#e8e0d2_25%,transparent_25%,transparent_75%,#e8e0d2_75%),linear-gradient(45deg,#e8e0d2_25%,transparent_25%,transparent_75%,#e8e0d2_75%)] bg-[length:8px_8px] bg-[position:0_0,4px_4px]"
// 				/>
// 				{/* Text */}
// 				<span className="text-[13px] font-bold tracking-wider text-stone-200 whitespace-nowrap">
// 					{children}
// 				</span>
// 				{/* Corner brackets */}
// 				<div
// 					aria-hidden="true"
// 					className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-button-green "
// 				/>
// 				<div
// 					aria-hidden="true"
// 					className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-button-green "
// 				/>
// 				<div
// 					aria-hidden="true"
// 					className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-button-green "
// 				/>
// 				<div
// 					aria-hidden="true"
// 					className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-button-green"
// 				/>
// 			</div>
// 		</div>
// 	);
// }

// export function TitleFrame({ children, frame }: TitleFrameProps) {
// 	return (
// 		<div className="relative w-full h-full">
// 			<img
// 				src={frame}
// 				alt="Chess frame"
// 				className=" w-full h-10 object-contain scale-x-150 md:scale-x-200 xl:scale-x-250 2xl:scale-x-300"
// 			/>
// 			<div className="absolute inset-0 flex items-center justify-center">{children}</div>
// 		</div>
// 	);
// }
