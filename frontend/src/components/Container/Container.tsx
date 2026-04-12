import React from "react";

type ContainerProps = {
	children: React.ReactNode;
};
export function Container({ children }: ContainerProps) {
	return (
		<div className="relative text-slate-900 dark:text-slate-200 bg-slate-200 min-h-screen dark:bg-gray-800 font-semibold pb-32">
			<div className="max-w-5xl mx-auto px-8">{children}</div>
		</div>
	);
}

export default Container;
