import { useState } from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home, Play, Settings } from "../../pages";
import { Login, Signup } from "../../components";
import { MultiRoute, NavBar } from "../../components";

type ActivateModal = "signup" | "login" | null;

export function MainRouter() {
	const [activeModal, setActiveModal] = useState<ActivateModal>(null);

	const openSignup = () => setActiveModal("signup");
	const openLogin = () => setActiveModal("login");
	const closeModal = () => setActiveModal(null);

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
				<Route path={RouterPaths.PLAY} element={<Play/>}></Route>
				<Route path={RouterPaths.SETTINGS} element={<Settings/>}></Route>

			</Routes>
		</BrowserRouter>
	);
}
