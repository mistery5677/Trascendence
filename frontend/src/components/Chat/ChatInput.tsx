import React, { useState } from "react";

interface ChatInputProps {
	onSendMessage: (message: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (input.trim()) {
			onSendMessage(input);
			setInput("");
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="bg-stone-900 border-t border-stone-700 px-4 py-3">
			<div className="flex items-center gap-3 rounded-3xl bg-stone-800/90 p-2 shadow-inner">
				<input
					type="text"
					className="flex-1 min-w-0 h-12 text-xl rounded-3xl bg-stone-950/80 px-4 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button
					type="button"
					onClick={handleSend}
					className="inline-flex h-12 min-w-[90px] items-center justify-center rounded-3xl bg-emerald-500 px-5 text-sm font-semibold text-stone-950 transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400">
					Send
				</button>
			</div>
		</div>
	);
}
