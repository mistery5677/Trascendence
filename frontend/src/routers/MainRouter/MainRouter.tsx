import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home, Play, Settings } from "../../pages";
import { FallBack, Login, Signup } from "../../components";
import { MultiRoute, NavBar } from "../../components";
import { useAuth } from "../../contexts/UserContext";

type ActivateModal = "signup" | "login" | null;

export function MainRouter() {
	const { state } = useAuth();

	const [activeModal, setActiveModal] = useState<ActivateModal>(null);

	const openSignup = () => setActiveModal("signup");
	const openLogin = () => setActiveModal("login");
	const closeModal = () => setActiveModal(null);

	if (state.isLoading) {
		return <FallBack />;
	}
	return (
		<BrowserRouter>
			<NavBar
				onOpenSignup={openSignup}
				onOpenLogin={openLogin}
			/>
			{activeModal === "signup" && (
				<Signup
					onClose={closeModal}
					onOpenLogin={openLogin}
				/>
			)}

			{activeModal === "login" && (
				<Login
					onClose={closeModal}
					onOpenSignup={openSignup}
				/>
			)}
			<Routes>
				{MultiRoute(RouterPaths.HOME, <Home />)}

				<Route
					path={RouterPaths.ERROR}
					element={<Error />}
				/>
				<Route
					path={RouterPaths.PLAY}
					element={<Play />}></Route>
				{state.user && (
					<Route
						path={RouterPaths.SETTINGS}
						element={<Settings tabOpt="account" />}></Route>
				)}

				<Route
					path={RouterPaths.PROFILE}
					element={<Settings tabOpt="profile" />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
