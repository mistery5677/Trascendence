import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { IconHeartHandshake } from "@tabler/icons-react";

const overlayClass =
	"fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
const contentClass =
	"border border-white border-green-600 fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),24rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-stone-600 bg-stone-900 p-4 text-stone-100 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95";

type OfferDrawButtonProps = {
	func: () => void;
};

export function OfferDrawButton({ func }: OfferDrawButtonProps) {
	return (
		<>
			<div className="flex flex-col items-center justify-center">
				<AlertDialog.Root>
					<AlertDialog.Trigger asChild>
						<button
							type="button"
							title="Offer a draw to your opponent"
							aria-label="Offer a draw to your opponent"
							// disabled={disabled}
							className="flex h-10 w-10 items-center justify-center rounded-full border-2 hover:border-green-400 hover:text-green-400 border-white bg-stone-800/80 text-sm font-medium text-stone-100 transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50">
							<IconHeartHandshake />
						</button>
					</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay className={overlayClass} />
						<AlertDialog.Content className={contentClass}>
							<AlertDialog.Title className="text-lg font-semibold ">
								Offer Draw
							</AlertDialog.Title>
							<AlertDialog.Description className="mt-2 text-sm text-stone-300">
								Do you want to offer a draw to your opponent?
							</AlertDialog.Description>
							<div className="mt-4 flex justify-end gap-2">
								<AlertDialog.Cancel asChild>
									<button
										type="button"
										className="rounded-md border border-stone-600 px-3 py-1.5 text-sm text-stone-200 hover:bg-stone-800">
										Cancel
									</button>
								</AlertDialog.Cancel>
								<AlertDialog.Action asChild>
									<button
										type="button"
										onClick={() => func()}
										className="rounded-md bg-stone-700 px-3 py-1.5 text-sm text-stone-100 hover:bg-stone-600">
										Offer Draw
									</button>
								</AlertDialog.Action>
							</div>
						</AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog.Root>
				<p className="text-sm font-medium text-stone-100">Offer Draw</p>
			</div>
		</>
	);
}
