import Title from "@/components/shared/Title";
import cstyle from "../../styles/style.module.scss";
import {
	FaTimes,
	FaDownload,
	FaUpload,
	FaLock,
	FaRegCopy,
	FaCheck,
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { useState } from "react";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";

interface CardDetailsModalProps {
	item: any;
	setIsOpen?: (data?: any) => void;
}

export default function CardDetailsModal({
	item,
	setIsOpen,
}: CardDetailsModalProps) {
	const [copied, setCopied] = useState("");

	const handleCopy = (label: any, text: any) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 2000);
	};

	const handleFundCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			const amount = prompt("Enter amount to fund:");
			if (!amount) return;

			await CardService.fund_card({
				token,
				cardId,
				data: {
					amount: parseFloat(amount),
					customer_id: item.customer_id || "customer_id_here",
				},
			});
			toast.success("Card funded successfully");
		} catch (error) {
			toast.error("Failed to fund card");
			console.error(error);
		}
	};

	const handleWithdrawCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			const amount = prompt("Enter amount to withdraw:");
			if (!amount) return;

			await CardService.withdraw_card({
				token,
				cardId,
				data: {
					amount: parseFloat(amount),
					customer_id: item.customer_id || "customer_id_here",
				},
			});
			toast.success("Withdrawal successful");
		} catch (error) {
			toast.error("Failed to withdraw from card");
			console.error(error);
		}
	};

	const handleFreezeCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			await CardService.freeze_card({ token, cardId });
			toast.success("Card frozen successfully");
		} catch (error) {
			toast.error("Failed to freeze card");
			console.error(error);
		}
	};

	const handleUnfreezeCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			await CardService.unfreeze_card({ token, cardId });
			toast.success("Card unfrozen successfully");
		} catch (error) {
			toast.error("Failed to unfreeze card");
			console.error(error);
		}
	};

	const Labels: any = {
		brand: "Brand",
		cvv: "CVV",
		masked_number: "Number",
		name: "Name",
		expired_at: "Expiry Date",
		created_at: "Issuing Date",
		balance_usd: "Balance",
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
			<div className="flex justify-between mb-5">
				<Title title={"Card Details"} />
				<div
					className="cursor-pointer"
					onClick={() => setIsOpen && setIsOpen(false)}
				>
					<FaTimes size={16} color={"#444"} />
				</div>
			</div>

			{/* Card Display */}
			<div className="bg-blue-600 text-white rounded-xl p-6 mt-6 mb-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center space-x-2">
						<span className="font-semibold">Virtual Card</span>
					</div>
					{item?.brand?.toLowerCase() === "visa" ? (
						<SiVisa size={48} />
					) : item?.brand?.toLowerCase() === "mastercard" ? (
						<SiMastercard size={48} />
					) : (
						<></>
					)}
				</div>
				<div className="text-2xl tracking-widest mb-4">
					{item?.masked_number}
				</div>
				<div className="flex justify-between items-center">
					<span className="uppercase">{item?.name}</span>
					<div className="flex space-x-4">
						<span>•••</span>
						<span>{item?.expired_at}</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="grid grid-cols-2 gap-4 mt-4 mb-6">
				<button
					onClick={() => handleFundCard(item?.id)}
					className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition"
				>
					<FaDownload className="" />
					Fund
				</button>
				<button
					onClick={() => handleWithdrawCard(item?.id)}
					className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition"
				>
					<FaUpload className="" />
					Withdraw
				</button>
				<button
					onClick={() => handleFreezeCard(item?.id)}
					className="flex-1 flex gap-2 items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition"
				>
					<FaLock className="" />
					Freeze
				</button>
				<button
					onClick={() => handleUnfreezeCard(item?.id)}
					className="flex-1 flex gap-2 items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
				>
					<FaLock className="" />
					Unfreeze
				</button>
			</div>

			{/* Card Details Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{item &&
					Object.entries(item).map(([label, value]: any[]) => {
						if (
							[
								"brand",
								"cvv",
								"masked_number",
								"name",
								"created_at",
								"expired_at",
								"balance_usd",
							].includes(label)
						)
							return (
								<div
									key={label}
									className="relative flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded"
								>
									<div>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{Labels[label]}
										</p>
										<p className="font-medium text-sm text-gray-800 dark:text-gray-100">
											{label === "cvv"
												? "***"
												: label === "created_at"
												? getFormattedDateTime(
														item?.created_at
												  )
												: value}
										</p>
									</div>
									<button
										onClick={() => handleCopy(label, value)}
										aria-label={`Copy ${label}`}
										className="absolute top-[10px] right-[10px] focus:outline-none"
									>
										{copied === label ? (
											<FaCheck className="text-green-500" />
										) : (
											<FaRegCopy className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition" />
										)}
									</button>
								</div>
							);
					})}
			</div>
		</div>
	);
}
