import type { ButtonHTMLAttributes, ReactNode } from "react";

interface MatchSidebarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "default" | "playNow";
}

export function MatchSidebarButton({
	children,
	className = "",
	variant = "default",
	...buttonProps
}: MatchSidebarButtonProps) {
	const defaultStyle =
		"inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-linear-to-b from-stone-600 via-stone-700 to-stone-800 px-5 py-3 font-semibold tracking-wide text-stone-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_18px_-12px_rgba(0,0,0,0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300/35 hover:from-stone-500 hover:via-stone-600 hover:to-stone-700 hover:text-white active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 sm:px-6";

	const playNowStyle =
		"inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-300/55 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-3 font-black tracking-[0.08em] text-stone-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_14px_24px_-14px_rgba(16,185,129,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_18px_30px_-14px_rgba(16,185,129,0.9)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50 sm:px-6";

	const buttonStyle = variant === "playNow" ? playNowStyle : defaultStyle;

	return (
		<button
			className={`${buttonStyle} ${className}`.trim()}
			{...buttonProps}>
			{children}
		</button>
	);
}
