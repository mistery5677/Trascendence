import { useState } from "react";

type SettingsTab = "profile" | "account" | "board";

function tabClass(isActive: boolean): string {
	if (isActive) {
		return "rounded-xl border border-sky-300/35 bg-sky-500/15 px-4 py-3 text-left text-xl font-bold text-sky-100";
	}

	return "rounded-xl px-4 py-3 text-left font-light text-xl text-stone-300 transition-colors hover:bg-stone-800/70 hover:text-stone-100";
}

type SettingsProps = {
	tabOpt: SettingsTab;
};

export function Settings({ tabOpt }: SettingsProps) {
	const [activeTab, setActiveTab] = useState<SettingsTab>(tabOpt);

	return (
		<main className="min-h-[calc(100vh-5rem)] w-full px-4 py-10 text-stone-100">
			<div className="mx-auto w-full lg:w-[60%]">
				<header className="mb-8">
					<h1 className="text-4xl font-extrabold tracking-tight">⚙️ Settings</h1>
					<p className="mt-2 text-sm text-stone-400">
						Manage your profile, account security, and game preferences.
					</p>
				</header>

				<div className="overflow-hidden rounded-2xl border border-stone-700/70 bg-stone-800/70">
					<div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
						<aside className="p-4">
							<nav className="flex flex-col gap-2">
								<button
									type="button"
									onClick={() => setActiveTab("profile")}
									className={tabClass(activeTab === "profile")}>
									<div className="flex flex-row gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											className="icon icon-tabler icons-tabler-outline icon-tabler-user">
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
											<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
										</svg>
										Profile
									</div>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("account")}
									className={tabClass(activeTab === "account")}>
									<div className="flex flex-row gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											className="icon icon-tabler icons-tabler-outline icon-tabler-device-laptop">
											<path
												stroke="none"
												d="M0 0h24v24H0z"
												fill="none"
											/>
											<path d="M3 19l18 0" />
											<path d="M5 7a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8" />
										</svg>
										Account
									</div>
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("board")}
									className={tabClass(activeTab === "board")}>
									Board Theme
								</button>
							</nav>
						</aside>

						<section className="relative border-t border-stone-700/70 p-6 lg:border-t-0">
							<div className="absolute top-5 bottom-5 left-0 hidden w-px bg-stone-700/70 lg:block" />
							{activeTab === "profile" && (
								<>
									<h2 className="text-2xl font-bold">Profile</h2>
									<div className="mt-6 rounded-2xl border border-stone-700/80 bg-stone-900/45 p-5">
										<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
											<div className="flex items-center gap-4">
												<img
													src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=facearea&facepad=2&w=256&h=256&q=80"
													alt="Profile avatar"
													className="h-20 w-20 rounded-full border-2 border-emerald-300/40 object-cover"
												/>
												<div>
													<h3 className="text-lg font-semibold text-stone-100">
														Profile picture
													</h3>
													<p className="text-sm text-stone-400">PNG or JPG up to 2MB.</p>
												</div>
											</div>
											<div className="flex gap-2">
												<button
													type="button"
													className="rounded-xl border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/25">
													Upload
												</button>
												<button
													type="button"
													className="rounded-xl border border-stone-600 bg-stone-700/80 px-4 py-2 text-sm font-semibold text-stone-200 transition-colors hover:bg-stone-800">
													Remove
												</button>
											</div>
										</div>
									</div>
									<form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
										<label className="flex flex-col gap-1.5 sm:col-span-1">
											<span className="text-sm font-semibold text-stone-300">Display Name</span>
											<input
												type="text"
												placeholder="Your name"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<label className="flex flex-col gap-1.5 sm:col-span-1">
											<span className="text-sm font-semibold text-stone-300">Email</span>
											<input
												type="email"
												placeholder="you@email.com"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<div className="sm:col-span-2">
											<button
												type="submit"
												className="rounded-md border border-button-primary bg-button-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-button-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
												Save changes
											</button>
										</div>
									</form>
								</>
							)}

							{activeTab === "account" && (
								<>
									<h2 className="text-2xl font-bold">Account</h2>
									<form className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
										<label className="flex flex-col gap-1.5 sm:col-span-2">
											<span className="text-sm font-semibold text-stone-300">
												Current Password
											</span>
											<input
												type="password"
												placeholder="Enter current password"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<label className="flex flex-col gap-1.5 sm:col-span-1">
											<span className="text-sm font-semibold text-stone-300">New Password</span>
											<input
												type="password"
												placeholder="New password"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<label className="flex flex-col gap-1.5 sm:col-span-1">
											<span className="text-sm font-semibold text-stone-300">
												Confirm Password
											</span>
											<input
												type="password"
												placeholder="Confirm password"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<div className="sm:col-span-2">
											<button
												type="submit"
												className="rounded-md border border-button-primary bg-button-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-button-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
												Update password
											</button>
										</div>
									</form>
								</>
							)}

							{activeTab === "board" && (
								<>
									<h2 className="text-2xl font-bold">Board Theme</h2>
									<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
										<button
											type="button"
											className="rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-emerald-400/70">
											Classic
										</button>
										<button
											type="button"
											className="rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-emerald-400/70">
											Forest
										</button>
										<button
											type="button"
											className="rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-emerald-400/70">
											Midnight
										</button>
									</div>
								</>
							)}
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}
