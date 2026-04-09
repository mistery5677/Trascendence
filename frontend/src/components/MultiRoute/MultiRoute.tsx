import React from "react";
import { Route } from "react-router-dom";

export function MultiRoute(paths: string[], element: React.ReactNode) {
	return paths.map((path) => (
		<Route
			key={path}
			path={path}
			element={element}
		/>
	));
}
