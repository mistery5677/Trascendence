type TitleFrameProps = {
	children: React.ReactNode;
	frame: string;
};

export function TitleFrame({ children, frame }: TitleFrameProps) {
	return (
		<div className="relative w-full h-full">
			<img
				src={frame}
				alt="Chess frame"
				className=" w-full h-10 object-contain scale-x-150 md:scale-x-200 xl:scale-x-250 2xl:scale-x-300"
			/>
			<div className="absolute inset-0 flex items-center justify-center">{children}</div>
		</div>
	);
}
