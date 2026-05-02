import React from "react";

interface ConfirmDialogProps {
	open: boolean;
	title?: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	open,
	title = "Confirm",
	message,
	onConfirm,
	onCancel,
}) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
			<div className="bg-slate-900 rounded-xl shadow-lg p-8 border border-emerald-500/40 min-w-[320px] max-w-xs">
				<h1 className=" text-lg font-bold text-emerald-400 mb-2">{title}</h1>
				<p className=" text-slate-200  mb-6 text-xl">{message}</p>
				<div className="flex justify-center gap-3">
					<button
						className="px-4 text-xl py-2 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-800 transition-all"
						onClick={onCancel}>
						Cancel
					</button>
					<button
						className="px-4 py-2 text-xl rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all font-bold"
						onClick={onConfirm}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
};
