import React from "react";
import { Bounce, ToastContainer } from "react-toastify";

type ToastWrapperProps = {
	children: React.ReactNode;
};

export function ToastWrapper({ children }: ToastWrapperProps) {
	return (
		<>
			{children}
			<ToastContainer
				position="top-center"
				autoClose={2000}
				closeOnClick={false}
				hideProgressBar={false}
				rtl={false}
				transition={Bounce}
			/>
		</>
	);
}
