"use client";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";

interface ModalProps {
	index?: number | string;
	name: string;
	item?: any[];
	isOpen?: boolean;
	setIsOpen?: (data?: any) => void;
	modalContent?: React.ReactNode;
}
function Modal({
	index,
	name,
	item,
	isOpen,
	setIsOpen,
	modalContent,
}: ModalProps) {
	const searchParams = useSearchParams();
	const modal = searchParams.get(`${name}${index ?? ""}`);
	const pathname = usePathname();

	return (
		<>
			{(modal || isOpen) && (
				<dialog
					style={{ zIndex: "9000" }}
					className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 overflow-auto backdrop-blur flex justify-center items-center"
				>
					<div
						className="z-0 bg-red/20 absolute w-full h-full top-0 left-0"
						onClick={() => setIsOpen && setIsOpen(false)}
					></div>
					<div className="z-[10]">{modalContent}</div>
				</dialog>
			)}
		</>
	);
}

export default Modal;
