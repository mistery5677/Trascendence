import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterPaths } from "./RouterPath";
import { Error, Home } from "../../pages";
import { Login } from "../../pages/Login/Login";
import { MultiRoute } from "../../components";

export function MainRouter() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					{MultiRoute(RouterPaths.HOME, <Home />)}
					<Route
						path={RouterPaths.LOGIN}
						element={<Login />}
					/>
					<Route
						path={RouterPaths.ERROR}
						element={<Error />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}
