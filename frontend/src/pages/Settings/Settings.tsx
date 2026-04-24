import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { updateAvatar, updatePassword } from "../../api/users";

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
	const { state, refreshMe } = useAuth();

	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		console.log("HERE");
		console.log("Selected file:", file);

		try {
			await updateAvatar(file);
			refreshMe();
		} catch (err) {
			console.log(err);
		}
	};

	const handlePasswordChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const currentPassword = formData.get("currentPassword") as string | null;
		const newPassword = formData.get("newPassword") as string | null;
		const confirmPassword = formData.get("confirmPassword") as string | null;

		if (!currentPassword || !newPassword || !confirmPassword) {
			console.error("All fields are required");
			return;
		}

		if (newPassword !== confirmPassword) {
			console.error("Passwords do not match");
			return;
		}
		try {
			await updatePassword(currentPassword, newPassword);
		} catch (err) {
			console.log(err);
		}
	};

    useEffect(() => {
		if (!state.user?.id)
		{
			console.log("Id is null");
			return ;
		}
		console.log("The id is: ", state.user.id);
		console.log("The elo: ", state.user.elo)
        async function fetchStats() {
            try {
                const response = await fetch(`/api/users/profile/${state.user?.id}`);
                const data = await response.json();
            } catch (error) {
                console.error("Failed to get the stats:", error);
            }
        }
        fetchStats();
    });

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
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
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
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
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
													src={state.user?.avatarUrl}
													alt="Profile avatar"
													className="h-20 w-20 p-2 max-w-20 max-h-20 rounded-full border-2 border-emerald-300/40 object-fit"
												/>
												<div>
													<h3 className="text-lg font-semibold text-stone-100">
														Profile picture
													</h3>
													<p className="text-sm text-stone-400">PNG or JPG up to 2MB.</p>
												</div>
											</div>
											<div className="flex gap-2">
												<input
													ref={fileInputRef}
													type="file"
													accept="image/png,image/jpeg"
													onChange={handleFileChange}
													className="hidden"
												/>
												<button
													type="button"
													onClick={handleUploadClick}
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
									<form
										className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
										onSubmit={handlePasswordChange}>
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
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
										<div className="bg-white/5 p-4 rounded-xl text-center">
											<p className="text-gray-400 text-sm uppercase">Victorys</p>
											<p className="text-3xl font-bold text-green-400">{state?.user?.wins || 0}</p>
										</div>
										<div className="bg-white/5 p-4 rounded-xl text-center">
											<p className="text-gray-400 text-sm uppercase">Defeats</p>
											<p className="text-3xl font-bold text-red-400">{state?.user?.losses || 0}</p>
										</div>
										<div className="bg-white/5 p-4 rounded-xl text-center">
											<p className="text-gray-400 text-sm uppercase">Draws</p>
											<p className="text-3xl font-bold text-yellow-400">{state?.user?.draws || 0}</p>
										</div>
										<div className="bg-white/5 p-4 rounded-xl text-center border border-board-focus/30">
											<p className="text-board-focus text-sm uppercase">Elo</p>
											<p className="text-3xl font-bold text-white">{state?.user?.elo || 1000}</p>
										</div>
									</div>
									<form
										className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
										onSubmit={handlePasswordChange}>
										<label className="flex flex-col gap-1.5 sm:col-span-2">
											<span className="text-sm font-semibold text-stone-300">
												Current Password
											</span>
											<input
												name="currentPassword"
												type="password"
												placeholder="Enter current password"
												className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
											/>
										</label>

										<label className="flex flex-col gap-1.5 sm:col-span-1">
											<span className="text-sm font-semibold text-stone-300">New Password</span>
											<input
												name="newPassword"
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
												name="confirmPassword"
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
