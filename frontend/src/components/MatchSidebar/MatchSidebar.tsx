import { useState } from "react";
import { Chat } from "../Chat/Chat";
import { MatchSidebarButton } from "../MatchSidebarButton/MatchSidebarButton";

export function MatchSidebar() {
	const [isChatOpen, setIsChatOpen] = useState(false);

	const toggleChat = () => {
		setIsChatOpen((prev) => !prev);
	};

	return (
		<div className="flex flex-col bg-stone-900 text-stone-200 rounded-xl shadow-lg border border-stone-700/60 overflow-hidden h-full min-h-[520px]">
			<header className="w-full p-4 sm:p-6 bg-linear-to-b from-stone-800 to-stone-900 border-b border-stone-700/70">
				{/* <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
					Match controls
				</p> */}
				<div className="flex items-center gap-2">
					<MatchSidebarButton
						onClick={toggleChat}
						className="flex-1">
						Chat
					</MatchSidebarButton>
					<MatchSidebarButton className="flex-1">Actions</MatchSidebarButton>
				</div>
			</header>
			{/* Middle Section */}
			<section className={`flex-1 flex flex-col min-h-0 ${isChatOpen ? "flex" : "hidden"}`}>
				<Chat classname="h-full flex-1" />
			</section>
			{
				<section className="mt-auto w-full p-4 sm:p-6 bg-linear-to-t from-stone-950/80 to-transparent border-t border-stone-700/50">
					<div className="rounded-lg bg-stone-800/70 border border-stone-700/70 p-3 sm:p-4">
						{/* <p className="mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400">
						Quick settings
					</p> */}
						<MatchSidebarButton className="w-full justify-center bg-stone-700/90 hover:bg-stone-600">
							⚙️ Settings
						</MatchSidebarButton>
					</div>
				</section>
			}
		</div>
	);
}
