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
			<div className="bg-sidebar-bg rounded-xl shadow-lg p-8 border border-sidebar-bg min-w-[320px] max-w-xs">
				<h1 className=" text-xl text-emerald-600 mb-2 font-extrabold">{title}</h1>
				<p className=" text-slate-200  mb-6 text-lg font-bold">{message}</p>
				<div className="flex justify-center gap-3">
					<button
						className="px-4 text-xl py-2 rounded-lg bg-button-stone border border-button-stone font-bold text-slate-300 hover:bg-stone-700 transition-all"
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
