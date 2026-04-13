import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home } from "../../pages";
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
			</Routes>
		</BrowserRouter>
	);
}
