import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import {
	updateAvatar,
	updateBoardTheme,
	updateEmail,
	updatePassword,
	updateUserName,
	verifyEmail,
	verifyUsername,
} from "../../api/users";
import { toast } from "react-toastify";
import { toastWrapper } from "../../adapters/toastWrapper";
import { IconUser, IconDeviceLaptop, IconPalette } from "@tabler/icons-react";
import styles from "./style.module.css";
import { Profile } from "../../components/index";
import { userNameValidation } from "../../hooks/userNameValidation";

function tabClass(isActive: boolean): string {
	if (isActive) {
		return "rounded-xl border border-emerald-300/30 bg-stone-700/70 px-4 py-3 text-left text-xl font-bold text-emerald-200";
	}

	return "rounded-xl px-4 py-3 text-left font-light text-stone-300 transition-colors hover:bg-stone-800/70 hover:text-stone-100";
}

export type SettingsTab = "profile" | "account" | "board";

export type SettingsProps = {
	tabOpt: SettingsTab;
};

export function Settings({ tabOpt }: SettingsProps) {
	const [activeTab, setActiveTab] = useState<SettingsTab>(tabOpt);
	const { state, refreshMe, dispatch } = useAuth();
	const [avatarUrlKey, setAvatarUrlKey] = useState(Date.now());
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	useEffect(() => {
		document.title = "Settings | 42 Transcendence";
	}, []);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		const validTypes = ["image/png", "image/jpeg"];
		if (!validTypes.includes(file.type)) {
			toastWrapper.warn("Only PNG or JPG images are allowed.");
			return;
		}

		// Validate file size (2MB max)
		const maxSize = 2 * 1024 * 1024;
		if (file.size > maxSize) {
			toastWrapper.warn("Image size must be less than 2MB.");
			return;
		}

		try {
			await updateAvatar(file);
			await refreshMe({ silent: true });
			setAvatarUrlKey(Date.now());
			toastWrapper.success("Photo uploaded successfully!", {
				style: { fontSize: "14px" },
			});
		} catch (err) {
			console.error("Error updating avatar:", err);
			toast.error("Failed to update avatar. Please try again.");
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const handlePasswordChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const currentPassword = formData.get("currentPassword") as string | null;
		const newPassword = formData.get("newPassword") as string | null;
		const confirmPassword = formData.get("confirmPassword") as string | null;

		if (!currentPassword && !newPassword && !confirmPassword) {
			toastWrapper.warn("All fields is required.");
		}
		if (!currentPassword) {
			toastWrapper.warn("Current password is required.");
			return;
		} else if (!newPassword) {
			toastWrapper.warn("New password is required.");
			return;
		} else if (!confirmPassword) {
			toastWrapper.warn("Please confirm your new password.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toastWrapper.warn("Passwords confirmation does not match.");
			return;
		}
		try {
			console.log("current: ", currentPassword);
			console.log("newPassword: ", newPassword);
			await updatePassword(currentPassword, newPassword);
		} catch (err) {
			console.log(err);
		}
	};

	const handleProfileChange = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const displayName = formData.get("displayName") as string | null;
		const email = formData.get("email") as string | null;

		if (email) {
			const isAvailable = await verifyEmail(email);
			if (!isAvailable) {
				toastWrapper.warn("Email already in use!");
				return;
			}
			try {
				await updateEmail(email);
				toastWrapper.success("Email updated successfully.");
				if (state.user) {
					dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, email: email } });
				}
			} catch (error) {
				console.log(error);
			}
		}
		if (displayName) {
			if (!userNameValidation(displayName)) {
				return toastWrapper.error("Username must be only alphabetical or numbers.");
			}
			const isAvailable = await verifyUsername(displayName);
			if (!isAvailable) {
				toastWrapper.warn("Username already in use!");
				return;
			}
			try {
				await updateUserName(displayName);
				toastWrapper.success("Nickname changed successfully.");
				if (state.user) {
					dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, username: displayName } });
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	const [userNameAvailable, setUserNameAvailable] = useState<boolean>(true);
	const [emailAvailable, setEmailAvailable] = useState<boolean>(true);

	const handleUserVerification = async (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!value) {
			setUserNameAvailable(true);
		}

		try {
			let isAvailable = await verifyUsername(value);
			setUserNameAvailable(isAvailable);
		} catch (error) {
			console.log(error);
			toastWrapper.warn("Failed to check username.");
		}
	};

	const handleEmailVerification = async (e: React.FocusEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!value || value.length == 0) {
			setEmailAvailable(true);
			return;
		}

		try {
			let isAvailable = await verifyEmail(value);
			setEmailAvailable(isAvailable);
		} catch (error) {
			console.log(error);
			toastWrapper.warn("Failed to check email.");
		}
	};

	const handleBoardTheme = (themeId: 1 | 2 | 3) => async () => {
		await updateBoardTheme(themeId);
		toastWrapper.success("Board theme update successfully.");
		if (state.user) {
			dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, boardTheme: themeId } });
		}
	};

	return (
		<>
			<main className="min-h-[calc(100vh-5rem)] w-full px-4 py-10 text-stone-100 bg-stone-800 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
				<div className="mx-auto w-full lg:w-[60%]">
					<header className="mb-8">
						<h1 className="text-4xl font-extrabold tracking-tight">⚙️ Settings</h1>
						<p className="mt-2 text-sm text-stone-400">
							Manage your profile, account security, and game preferences.
						</p>
					</header>

					<div className="overflow-hidden rounded-2xl border border-stone-700/80 bg-stone-700/50 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.85)]">
						<div className="grid grid-cols-1 lg:grid-cols-[220px_1fr]">
							<aside className="p-4 bg-stone-950/40">
								<nav className="flex flex-col gap-2">
									<button
										type="button"
										onClick={() => setActiveTab("profile")}
										className={tabClass(activeTab === "profile")}>
										<div className="flex flex-row gap-2">
											<IconUser stroke={2} />
											Profile
										</div>
									</button>
									<button
										type="button"
										onClick={() => setActiveTab("account")}
										className={tabClass(activeTab === "account")}>
										<div className="flex flex-row gap-2">
											<IconDeviceLaptop stroke={2} />
											Account
										</div>
									</button>
									<button
										type="button"
										onClick={() => setActiveTab("board")}
										className={tabClass(activeTab === "board")}>
										<div className="flex flex-row gap-2">
											<IconPalette stroke={2} />
											Board Theme
										</div>
									</button>
								</nav>
							</aside>

							<section className="relative border-t border-stone-700/70 p-6 lg:border-t-0 bg-stone-950/20">
								<div className="absolute top-5 bottom-5 left-0 hidden w-px bg-stone-700/70 lg:block" />
								{activeTab === "profile" && (
									<div>
										<div className="text-stone-400 text-lg">
											Profile info is now shown in your public profile.
										</div>
										<Profile />
									</div>
								)}

								{activeTab === "account" && (
									<>
										<h2 className="text-2xl font-bold">Account</h2>
										<div className="mt-6 rounded-2xl border border-stone-700/80 bg-stone-900/45 p-5">
											<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
												<div className="flex items-center gap-4">
													<img
														src={
															state.user?.avatarUrl
																? `${state.user.avatarUrl}?t=${avatarUrlKey}`
																: undefined
														}
														alt="Profile avatar"
														className="h-20 w-20 max-w-20 max-h-20 rounded-full border-2 border-emerald-300/40 object-fit hover:scale-110 transition"
														onError={(e) => {
															e.currentTarget.src = "/api/assets/avatars/default1.png";
														}}
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
												</div>
											</div>
										</div>
										<form
											className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
											onSubmit={handleProfileChange}>
											<label className="flex flex-col gap-1.5 sm:col-span-1">
												<span className="text-sm font-semibold text-stone-300">
													Display Name
												</span>
												<input
													type="text"
													placeholder="Your name"
													onBlur={handleUserVerification}
													name="displayName"
													className={`rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400`}
												/>
												{userNameAvailable == false ? (
													<div>
														<div className="text-[14px] pl-2 text-red-500">
															* Display Name isn't available.
														</div>
													</div>
												) : null}
											</label>

											<label className="flex flex-col gap-1.5 sm:col-span-1">
												<span className="text-sm font-semibold text-stone-300">Email</span>
												<input
													type="email"
													name="email"
													placeholder="you@email.com"
													onBlur={handleEmailVerification}
													className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
												/>
												{emailAvailable == false ? (
													<div className="text-[14px] text-red-500">
														* Email isn't available.
													</div>
												) : null}
											</label>

											<div className="sm:col-span-2">
												<button
													type="submit"
													disabled={!userNameAvailable || !emailAvailable}
													className={`rounded-md border border-button-primary px-4 py-2 text-sm font-semibold text-white transition-colors  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 ${!userNameAvailable || !emailAvailable ? "bg-emerald-300" : "bg-button-primary hover:bg-button-primary-hover"}`}>
													Save changes
												</button>
											</div>
										</form>
										<form
											className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
											onSubmit={handlePasswordChange}>
											<label className="flex flex-col gap-1.5 sm:col-span-2">
												<span className="text-sm font-semibold text-stone-300">
													Current Password <span className="text-rose-400">*</span>
												</span>
												<input
													name="currentPassword"
													type="password"
													placeholder="Enter current password"
													className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
												/>
											</label>

											<label className="flex flex-col gap-1.5 sm:col-span-1">
												<span className="text-sm font-semibold text-stone-300">
													New Password <span className="text-rose-400">*</span>
												</span>
												<input
													name="newPassword"
													type="password"
													placeholder="New password"
													className="rounded-lg border border-stone-600 bg-stone-900/70 px-3 py-1.5 text-sm text-stone-100 outline-none transition focus:border-emerald-400"
												/>
											</label>

											<label className="flex flex-col gap-1.5 sm:col-span-1">
												<span className="text-sm font-semibold text-stone-300">
													Confirm Password <span className="text-rose-400">*</span>
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
									<div>
										<h2 className="text-2xl font-bold">Board Theme</h2>
										<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
											<button
												type="button"
												onClick={handleBoardTheme(1)}
												className={`rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium ${styles["custom-button-forest"]} hover:border-3`}>
												Forest
											</button>
											<button
												type="button"
												onClick={handleBoardTheme(2)}
												className={`rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-3 ${styles["custom-button-classic"]}`}>
												Classic
											</button>
											<button
												type="button"
												onClick={handleBoardTheme(3)}
												className={`rounded-lg border border-stone-600 bg-stone-900/60 px-3 py-2 text-left text-sm font-medium hover:border-3 ${styles["custom-button-midnight"]}`}>
												Midnight
											</button>
										</div>
									</div>
								)}
							</section>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
