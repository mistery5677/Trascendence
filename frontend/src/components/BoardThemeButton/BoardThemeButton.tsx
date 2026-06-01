import type { ReactNode, ButtonHTMLAttributes } from "react";

type BoardThemeButtonProps = {
	children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function BoardThemeButton({ children, className, type = "button", ...props }: BoardThemeButtonProps) {
	return (
		<button
			type={type}
			className={` rounded-lg border bg-button-stone border-button-stone px-3 py-2 text-left text-sm font-extrabold items-center justify-center flex hover:border-3 ${className}`}
			{...props}>
			{children}
		</button>
	);
}
