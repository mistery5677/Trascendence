import type { ButtonHTMLAttributes, ReactNode } from "react";

interface MatchSidebarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export function MatchSidebarButton({ children, className = "", ...buttonProps }: MatchSidebarButtonProps) {
	return (
		<>
			<button
				className={`px-6 py-3 bg-stone-700 text-stone-200 font-bold rounded-lg shadow-md hover:bg-stone-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-stone-500 transition-all ${className}`.trim()}
				{...buttonProps}>
				{children}
			</button>
		</>
	);
}
