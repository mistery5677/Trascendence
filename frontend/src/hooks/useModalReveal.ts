import { useEffect, useState } from "react";

export function useModalReveal(delay = 80) {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setShow(true), delay);
		return () => window.clearTimeout(id);
	}, [delay]);

	return show;
}
