import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home, Settings, Ze, LeaderBoards, Friends, HistoryPage } from "../../pages";
import { FallBack, Login, Signup, MultiRoute, NavBar } from "../../components";
import { useAuth } from "../../contexts/UserContext";
import { GameProvider } from "../../contexts/GameContext/GameContext";
import { Play } from "../../pages/Play/Play";
import { GlobalSocketProvider } from "../../contexts/GlobalSocketContext/GlobalSocketContext";
import { Rules } from "../../pages/Rules/Rules.tsx";

type ActivateModal = "signup" | "login" | null;

function PlayRouteWithProvider() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const mode = searchParams.get("mode") || "online";
	return (
		<GameProvider mode={mode}>
			<Play />
		</GameProvider>
	);
}

export function MainRouter() {
	const { state } = useAuth();

	const [activeModal, setActiveModal] = useState<ActivateModal>(null);

	if (state.isLoading) {
		return (
			<div>
				<FallBack />
			</div>
		);
	}

	return (
		<BrowserRouter>
			<GlobalSocketProvider>
				<NavBar onModal={setActiveModal} />
				{activeModal === "signup" && <Signup onModal={setActiveModal} />}

				{activeModal === "login" && <Login onModal={setActiveModal} />}
				<Routes>
					{MultiRoute(RouterPaths.HOME, <Home />)}

					<Route
						path={RouterPaths.ERROR}
						element={<Error />}
					/>
					<Route
						path={RouterPaths.ZE}
						element={<Ze />}
					/>

					{state.user && (
						<Route
							path={RouterPaths.PLAY}
							element={<PlayRouteWithProvider />}
						/>
					)}

					{/* Path for the rules*/}
					<Route
						path={RouterPaths.RULES}
						element={<Rules />}
					/>

					{/* Path for the leaderboard*/}
					<Route
						path={RouterPaths.LEADERBOARDS}
						element={<LeaderBoards />}
					/>
					{/* Path for your own history*/}
					<Route
						path={RouterPaths.HISTORY}
						element={<HistoryPage />}
					/>

					{/* Dynamic route for other players, for example with Leaderboards or friend requests */}
					<Route
						path={`${RouterPaths.HISTORY}/:username`}
						element={<HistoryPage />}
					/>

					{state.user && (
						<Route
							path={RouterPaths.FRIENDS}
							element={<Friends />}
						/>
					)}

					{state.user && (
						<Route
							path={RouterPaths.SETTINGS}
							element={<Settings tabOpt={"profile"} />}></Route>
					)}
				</Routes>
			</GlobalSocketProvider>
		</BrowserRouter>
	);
}
