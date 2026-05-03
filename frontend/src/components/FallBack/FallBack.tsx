import React from "react";

export function FallBack() {
	return (
		<>
			<div className="relative min-h-screen overflow-hidden bg-linear-to-b from-slate-950 via-stone-950 to-slate-900">
				<div className="absolute inset-0 opacity-25 pointer-events-none">
					<div className="absolute -top-16 -left-20 h-72 w-72 rounded-full bg-emerald-700/35 blur-[95px]" />
					<div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-lime-700/25 blur-[110px]" />
				</div>

				<div className="relative z-10 flex min-h-screen items-center justify-center px-6">
					<div className="w-full max-w-sm rounded-3xl border border-emerald-300/20 bg-slate-900/70 p-8 text-center shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] backdrop-blur-md">
						<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200/35 bg-emerald-400/10">
							<span className="animate-spin text-3xl leading-none text-emerald-200">♞</span>
						</div>
						<p className="text-lg font-bold tracking-wide text-stone-100">Preparing your board...</p>
						<p className="mt-2 text-sm text-stone-400">Syncing your session and profile.</p>
						<div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-stone-800">
							<div className="h-full w-2/3 animate-pulse rounded-full bg-linear-to-r from-lime-300 to-emerald-300" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
