import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home, Play, Settings } from "../../pages";
import { Login, Signup } from "../../components";
import { MultiRoute, NavBar } from "../../components";
import { useAuth } from "../../contexts/UserContext";

type ActivateModal = "signup" | "login" | null;

export function MainRouter() {
	const { state } = useAuth();

	const [activeModal, setActiveModal] = useState<ActivateModal>(null);

	const openSignup = () => setActiveModal("signup");
	const openLogin = () => setActiveModal("login");
	const closeModal = () => setActiveModal(null);

	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => {
		const t = setTimeout(() => setShowLoader(false), 2000);
		return () => clearTimeout(t);
	}, []);

	if (state.isLoading || showLoader) {
		return <div className="min-h-screen flex items-center justify-center text-stone-300">Loading session...</div>;
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
				<Route
					path={RouterPaths.SETTINGS}
					element={<Settings tabOpt="account" />}></Route>
				<Route
					path={RouterPaths.PROFILE}
					element={<Settings tabOpt="profile" />}></Route>
			</Routes>
		</BrowserRouter>
	);
}
