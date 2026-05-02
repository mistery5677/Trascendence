import { toast, type ToastOptions } from "react-toastify";

export class toastWrapper {
	static success(msg: string, options?: ToastOptions) {
		return toast.success(msg, options ? options : { style: { fontSize: 14 } });
	}
	static warn(msg: string, options?: ToastOptions) {
		return toast.warn(msg, options ? options : { style: { fontSize: 14 } });
	}

	static error(msg: string, options?: ToastOptions) {
		return toast.error(msg, options ? options : { style: { fontSize: 14 } });
	}
}
