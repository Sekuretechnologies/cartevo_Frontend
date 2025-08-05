import { useState, useEffect } from "react";

const useKeyPressed = () => {
	const [shiftDown, setShiftDown] = useState(false);
	const [iPressed, setIPressed] = useState(false);
	const [ePressed, setEPressed] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Shift") {
				setShiftDown(true);
			} else if (event.key === "i" || event.key === "E") {
				setIPressed(true);
			} else if (event.key === "e" || event.key === "E") {
				setEPressed(true);
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.key === "Shift") {
				setShiftDown(false);
			} else if (event.key === "i" || event.key === "I") {
				setIPressed(false);
			} else if (event.key === "e" || event.key === "E") {
				setEPressed(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	return { shiftDown, iPressed, ePressed };
};

export default useKeyPressed;
