import { toast, type ToastOptions } from "react-toastify";

export class toastWrapper {
	static success(msg: string, options?: ToastOptions) {
		return toast.success(msg, options);
	}
	static warn(msg: string, options?: ToastOptions) {
		return toast.warn(msg, options);
	}
}
