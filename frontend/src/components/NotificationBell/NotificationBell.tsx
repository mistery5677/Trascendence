import { useState } from "react";
import { useNotifications } from "../../contexts/NotificationContext/NotificationContext";
import { BellIcon } from "@heroicons/react/24/outline";

export function NotificationBell() {
	const { unreadCount, notifications, markAllAsRead } = useNotifications();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const toggleDropdown = () => {
		if (isOpen) {
			markAllAsRead();
		}
		setIsOpen(!isOpen);
	};

	const handleCloseDropdown = () => {
		markAllAsRead();
		setIsOpen(false);
	};

	return (
		<div className="relative inline-block text-left">
			<button
				type="button"
				onClick={toggleDropdown}
				className={`relative rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 hover:scale-[1.03] active:scale-95 ${
					isOpen
						? "text-emerald-200 bg-emerald-400/10 z-50"
						: "text-stone-300 hover:text-emerald-200 hover:bg-emerald-400/10"
				}`}>
				<span className="absolute -inset-1.5" />
				<span className="sr-only">View notifications</span>
				<BellIcon
					aria-hidden="true"
					className="size-6"
				/>

				{unreadCount > 0 && (
					<span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-lime-300 animate-pulse" />
				)}
			</button>

			{isOpen && (
				<div>
					<div
						className="fixed inset-0 z-40 cursor-default"
						onClick={handleCloseDropdown}
					/>

					<div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-stone-800 bg-stone-900/95 p-4 shadow-lg ring-1 ring-black/5 focus:outline-none backdrop-blur-md z-50">
						<div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
							<h3 className="text-sm font-semibold text-stone-200">Notifications</h3>
							{unreadCount > 0 && (
								<span className="text-xs bg-lime-500/20 text-lime-300 px-2 py-0.5 rounded-full">
									{unreadCount} new
								</span>
							)}
						</div>

						{/* List */}
						<div className="max-h-64 overflow-y-auto space-y-2 flex flex-col custom-scrollbar">
							{notifications.length === 0 ? (
								<p className="text-xs text-stone-500 text-center py-4">
									No notifications at the moment.
								</p>
							) : (
								notifications.map((notification) => (
									<div
										key={notification.id}
										className={`p-2 rounded-lg transition-colors duration-150 border-l-2 ${
											notification.read
												? "bg-stone-800/20 hover:bg-stone-800/50 border-stone-700"
												: "bg-stone-800/70 hover:bg-stone-800/90 border-emerald-500"
										}`}>
										<p className="text-xs font-medium text-stone-200">{notification.title}</p>
										<p className="text-[11px] text-stone-400 mt-0.5">{notification.message}</p>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
