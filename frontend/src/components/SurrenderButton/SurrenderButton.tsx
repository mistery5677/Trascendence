import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { IconFlag } from "@tabler/icons-react";

const overlayClass =
	"fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
const contentClass =
	"border border-white border-green-600 fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-stone-600 bg-stone-900 p-4 text-stone-100 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";

type SurrenderButtonProps = {
	func: () => void;
};
export const SurrenderButton = ({ func }: SurrenderButtonProps) => {
	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<AlertDialog.Root>
					<AlertDialog.Trigger asChild>
						<button
							type="button"
							// disabled={disabled}
							className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-600 border-white bg-stone-800/80 text-sm font-medium text-stone-100 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<IconFlag />
						</button>
					</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay className={overlayClass} />
						<AlertDialog.Content className={contentClass}>
							<AlertDialog.Title className="text-lg font-semibold">
								Surrender
							</AlertDialog.Title>
							<AlertDialog.Description className="mt-2 text-sm text-stone-300">
								Are you sure you want to surrender? This will
								count as a loss.
							</AlertDialog.Description>
							<div className="mt-4 flex justify-end gap-2">
								<AlertDialog.Cancel asChild>
									<button
										type="button"
										className="rounded-md border border-stone-600 px-3 py-1.5 text-sm text-stone-200 hover:bg-stone-800"
									>
										Cancel
									</button>
								</AlertDialog.Cancel>
								<AlertDialog.Action asChild>
									<button
										type="button"
										onClick={() => func()}
										className="rounded-md bg-red-900/80 px-3 py-1.5 text-sm text-red-100 hover:bg-red-800"
									>
										Surrender
									</button>
								</AlertDialog.Action>
							</div>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog.Root>
				<p className="text-sm font-medium text-stone-100">Surrender</p>
			</div>
		</>
	);
};
