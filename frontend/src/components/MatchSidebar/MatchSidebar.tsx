import { useState } from "react";
import { Chat } from "../Chat/Chat";
import { MatchSidebarButton } from "../MatchSidebarButton/MatchSidebarButton";
import { GameSettings } from "./GameSettings/GameSettings";

type currentTabOpt = "chat" | "actions" | "settings" | null;

type Menu = {
	currentTab: currentTabOpt;
	isOpen: boolean;
};

export function MatchSidebar() {
	const [menu, setMenu] = useState<Menu>({ currentTab: null, isOpen: false });

	const toggleMenu = (value: currentTabOpt) => {
		setMenu((prev) => ({
			currentTab: value,
			isOpen: prev.currentTab !== value ? true : !prev.isOpen,
		}));
		console.log(menu.currentTab);
	};

	return (
		<div className="flex flex-col bg-stone-900 text-stone-200 rounded-xl shadow-md border border-stone-700 overflow-hidden h-full min-h-140 sm:min-h-155">
			<header className="w-full p-5 sm:p-6 bg-stone-800 border-b border-stone-700">
				<p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
					Match controls
				</p>
				<div className="flex items-center gap-3">
					<MatchSidebarButton
						onClick={() => toggleMenu("chat")}
						className="flex-1 text-base sm:text-lg"
					>
						Chat
					</MatchSidebarButton>
					<MatchSidebarButton className="flex-1 text-base sm:text-lg">
						Actions
					</MatchSidebarButton>
				</div>
			</header>
			{/* Middle Section */}
			<section
				className={`flex-1 flex flex-col min-h-0 ${menu.isOpen ? "flex" : "hidden"}`}
			>
				{menu.currentTab === "chat" && (
					<Chat classname="h-full flex-1" />
				)}
				{menu.currentTab === "settings" && <GameSettings />}
			</section>
			{
				<section className="mt-auto w-full p-5 sm:p-6 bg-stone-900 border-t border-stone-700">
					<div className="rounded-lg bg-stone-800 border border-stone-700 p-4 sm:p-5">
						{/* <p className="mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase text-stone-400">
						Quick settings
					</p> */}
						<MatchSidebarButton
							onClick={() => toggleMenu("settings")}
							className="w-full justify-center bg-stone-700 hover:bg-stone-600 text-base sm:text-lg"
						>
							⚙️ Settings
						</MatchSidebarButton>
					</div>
				</section>
			}
		</div>
	);
}
