import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, History, Home, Play, Settings, Ze } from "../../pages";
import { FallBack, Login, Signup } from "../../components";
import { MultiRoute, NavBar } from "../../components";
import { useAuth } from "../../contexts/UserContext";

type ActivateModal = "signup" | "login" | null;

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
				<Route
					path={RouterPaths.PLAY}
					element={<Play />}></Route>
				{state.user && (
					<Route
						path={RouterPaths.SETTINGS}
						element={<Settings tabOpt={"profile"} />}></Route>
				)}
				{state.user && (
					<Route
						path={RouterPaths.HISTORY}
						element={<History />}></Route>
				)}
			</Routes>
		</BrowserRouter>
	);
}
