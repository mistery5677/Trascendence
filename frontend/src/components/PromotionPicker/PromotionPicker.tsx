type PromotionPiece = "q" | "r" | "b" | "n";

type PromotionPickerProps = {
	open: boolean;
	color: "w" | "b";
	onSelect: (piece: PromotionPiece) => void;
	onCancel: () => void;
};

const promotionOptions: Array<{ value: PromotionPiece; label: string }> = [
	{ value: "q", label: "Queen" },
	{ value: "r", label: "Rook" },
	{ value: "b", label: "Bishop" },
	{ value: "n", label: "Knight" },
];

export function PromotionPicker({ open, color, onSelect, onCancel }: PromotionPickerProps) {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
			<div className="w-full max-w-sm rounded-2xl border border-emerald-400/40 bg-stone-900 p-4 shadow-[0_16px_40px_-14px_rgba(16,185,129,0.6)] sm:p-5">
				<h3 className="text-center text-[clamp(1rem,2.4vw,1.2rem)] font-bold text-stone-100">
					Choose Promotion
				</h3>
				<p className="mt-1 text-center text-[clamp(0.8rem,1.8vw,0.95rem)] text-slate-400">
					Promote {color === "w" ? "white" : "black"} pawn to:
				</p>

				<div className="mt-4 grid grid-cols-2 gap-2">
					{promotionOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => onSelect(option.value)}
							className="rounded-lg border border-slate-600 bg-stone-800 px-3 py-2 text-sm font-semibold text-stone-100 transition-colors hover:border-emerald-400 hover:bg-stone-700 hover:text-emerald-200">
							{option.label}
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={onCancel}
					className="mt-3 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700">
					Cancel
				</button>
			</div>
		</div>
	);
}
