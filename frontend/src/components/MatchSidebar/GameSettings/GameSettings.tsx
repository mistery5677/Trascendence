import { toastWrapper } from "../../../adapters/toastWrapper";
import { updateBackGroundTheme, updateBoardTheme } from "../../../api/users";
import { useAuth } from "../../../contexts/UserContext";
import { BoardThemeButton } from "../../index";
import styles from "./style.module.css";

export function GameSettings() {
	const { state, dispatch } = useAuth();
	const currentTheme = state.user?.backgroundTheme;
	const boardTheme = state.user?.boardTheme;

	const handleBoardTheme = (themeId: 1 | 2 | 3) => async () => {
		try {
			await updateBoardTheme(themeId);
			toastWrapper.success("Board theme update successfully.");
			if (state.user) {
				dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, boardTheme: themeId } });
			}
		} catch (error) {
			toastWrapper.error("Error updating board theme.");
		}
	};

	const handleBackgroundTheme = (backgroundID: 1 | 2 | 3 | 4 | 5) => async () => {
		try {

			console.log("ID: ++++++ ", backgroundID);
			await updateBackGroundTheme(backgroundID);

			toastWrapper.success("Background theme update successfully.");

			if (state.user) {
				dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, backgroundTheme: backgroundID } });
			}
		} catch (error) {
			toastWrapper.error("Error changing background.");
		}
	};

	return (
		<div className="w-full rounded-lg border border-stone-700/60 bg-stone-900/40 p-3 sm:p-4">
			{/* Boart Theme Section */}
			<section className="mb-4">
				<div className="mb-3 border-b border-stone-700/70 pb-2 text-center">
					<h2 className="text-sm font-semibold tracking-wide text-stone-100">Board Theme</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
					<BoardThemeButton
						onClick={handleBoardTheme(1)}
						className={`${styles["custom-button-forest"]} justify-center text-center ${
							boardTheme === 1 ? "border-emerald-400 bg-emerald-500/10" : ""
						}`}>
						Forest
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBoardTheme(2)}
						className={`${styles["custom-button-classic"]} justify-center text-center ${
							boardTheme === 2 ? "border-amber-500/80 bg-amber-500/10" : ""
						}`}>
						Classic
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBoardTheme(3)}
						className={`${styles["custom-button-midnight"]} justify-center text-center ${
							boardTheme === 3 ? "border-sky-500/70 bg-sky-500/10" : ""
						}`}>
						Midnight
					</BoardThemeButton>
				</div>
			</section>
			{/* BackGround Theme Section */}
			<section>
				<div className="mb-3 border-b border-stone-700/70 pb-2 text-center">
					<h2 className="text-sm font-semibold tracking-wide text-stone-100">Background Theme</h2>
				</div>
				<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
					<BoardThemeButton
						onClick={handleBackgroundTheme(1)}
						className={`${styles["custom-button-forest"]} justify-center text-center ${
							currentTheme === 1 ? "border-emerald-400 bg-emerald-500/10" : ""
						}`}>
						Chess
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBackgroundTheme(2)}
						className={`${styles["custom-button-classic"]} justify-center text-center ${
							currentTheme === 2 ? "border-amber-500/80 bg-amber-500/10" : ""
						}`}>
						Cats
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBackgroundTheme(3)}
						className={`${styles["custom-button-midnight"]} justify-center text-center ${
							currentTheme === 3 ? "border-sky-500/70 bg-sky-500/10" : ""
						}`}>
						Sky
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBackgroundTheme(4)}
						className={`${styles["custom-button-classic"]} justify-center text-center ${
							currentTheme === 4 ? "border-emerald-400 bg-emerald-500/10" : ""
						}`}>
						Penguin
					</BoardThemeButton>
					<BoardThemeButton
						onClick={handleBackgroundTheme(5)}
						className={`${styles["custom-button-forest"]} justify-center text-center ${
							currentTheme === 5 ? "border-amber-500/80 bg-amber-500/10" : ""
						}`}>
						Standard
					</BoardThemeButton>
				</div>
			</section>
		</div>
	);
}
