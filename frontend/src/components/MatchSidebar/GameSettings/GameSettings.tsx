import { toastWrapper } from "../../../adapters/toastWrapper";
import { updateBoardTheme } from "../../../api/users";
import { useAuth } from "../../../contexts/UserContext";
import { BoardThemeButton } from "../../index";
import styles from "./style.module.css";

export function GameSettings() {
	const { state, dispatch } = useAuth();
	const currentTheme = state.user?.boardTheme;

	const handleBoardTheme = (themeId: 1 | 2 | 3) => async () => {
		await updateBoardTheme(themeId);
		toastWrapper.success("Board theme update successfully.");
		if (state.user) {
			dispatch({ type: "AUTH_SUCCESS", payload: { ...state.user, boardTheme: themeId } });
		}
	};

	return (
		<div className="w-full rounded-lg border border-stone-700/60 bg-stone-900/40 p-3 sm:p-4">
			<div className="mb-3 border-b border-stone-700/70 pb-2 text-center">
				<h2 className="text-sm font-semibold tracking-wide text-stone-100">Board Theme</h2>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
				<BoardThemeButton
					onClick={handleBoardTheme(1)}
					className={`${styles["custom-button-forest"]} justify-center text-center ${
						currentTheme === 1 ? "border-emerald-400 bg-emerald-500/10" : ""
					}`}>
					Forest
				</BoardThemeButton>
				<BoardThemeButton
					onClick={handleBoardTheme(2)}
					className={`${styles["custom-button-classic"]} justify-center text-center ${
						currentTheme === 2 ? "border-amber-500/80 bg-amber-500/10" : ""
					}`}>
					Classic
				</BoardThemeButton>
				<BoardThemeButton
					onClick={handleBoardTheme(3)}
					className={`${styles["custom-button-midnight"]} justify-center text-center ${
						currentTheme === 3 ? "border-sky-500/70 bg-sky-500/10" : ""
					}`}>
					Midnight
				</BoardThemeButton>
			</div>
		</div>
	);
}
