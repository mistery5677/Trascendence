import type { ReactNode, ButtonHTMLAttributes } from "react";

type BoardThemeButtonProps = {
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BoardThemeButton({ children, className, type = "button", ...props }: BoardThemeButtonProps) {
	const baseClassName =
		"rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-3";
	return (
		<button
			type={type}
			className={`${baseClassName} ${className}`}
			{...props}>
			{children}
		</button>
	);
}
