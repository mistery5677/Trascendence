interface ConfirmationModalProps {
	title: string;
	description: string;
	icon?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	onResponse: (accept: boolean) => void;
	variant?: "success" | "danger" | "info";
}

export function ConfirmationModal({
	title,
	description,
	icon,
	confirmLabel = "Accept",
	cancelLabel = "Decline",
	onResponse,
}: ConfirmationModalProps) {
	return (
		<div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-slate-900 border border-emerald-500/50 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
				<h3 className="text-2xl font-bold text-white text-center">
					{icon} {title}
				</h3>
				<p className="text-slate-300">{description}</p>
				<div className="flex gap-4 w-full mt-2">
					<button
						onClick={() => onResponse(true)}
						className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">
						{confirmLabel}
					</button>
					<button
						onClick={() => onResponse(false)}
						className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">
						{cancelLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
