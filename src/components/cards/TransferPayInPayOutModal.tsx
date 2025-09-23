import CButton from "@/components/shared/CButton";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { Replace } from "lucide-react";
import React, { useState } from "react";

interface TransferPayInPayOutModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: TransferPayInPayOutSubmitProps) => void;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
	wallet: {
		id: string;
		currency: string;
		balance?: number; // main balance
		payin_balance: number;
		payout_balance: number;
	};
	source?: "PAYOUT" | "MAIN"; // default PAYOUT
}

export interface TransferPayInPayOutSubmitProps {
	amount: number;
	direction:
		| "PAYOUT_TO_PAYIN"
		| "PAYOUT_TO_MAIN"
		| "MAIN_TO_PAYIN"
		| "MAIN_TO_PAYOUT";
	reason?: string;
}

const TransferPayInPayOutModal: React.FC<TransferPayInPayOutModalProps> = ({
	setIsOpen,
	onSubmit,
	isLoading,
	isSuccess,
	isError,
	wallet,
	source = "PAYOUT",
}) => {
	const [amount, setAmount] = useState("100");
	const [direction, setDirection] = useState<
		| "PAYOUT_TO_PAYIN"
		| "PAYOUT_TO_MAIN"
		| "MAIN_TO_PAYIN"
		| "MAIN_TO_PAYOUT"
	>(source === "MAIN" ? "MAIN_TO_PAYIN" : "PAYOUT_TO_PAYIN");
	const [reason, setReason] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const amountNum = parseFloat(amount) || 0;

	const handleSubmit = () => {
		if (!amountNum || amountNum <= 0) {
			setErrorMessage("Please enter a valid amount");
			return;
		}

		// Validate available based on source
		const available = source === "MAIN" ? (wallet.balance || 0) : wallet.payout_balance;
		if (available < amountNum) {
			setErrorMessage(
				source === "MAIN"
					? "Insufficient Main balance"
					: "Insufficient PayOut balance"
			);
			return;
		}

		onSubmit({
			amount: amountNum,
			direction,
			reason: reason || undefined,
		});
	};

	const getAvailableBalance = () =>
		source === "MAIN" ? wallet.balance || 0 : wallet.payout_balance;

	const getSourceLabel = () => (source === "MAIN" ? "Main" : "PayOut");

	const getDestinationLabel = () => {
		if (direction === "PAYOUT_TO_PAYIN") return "PayIn";
		if (direction === "PAYOUT_TO_MAIN") return "Main";
		if (direction === "MAIN_TO_PAYIN") return "PayIn";
		return "PayOut"; // MAIN_TO_PAYOUT
	};

	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">Internal Transfer</h2>

			<div className="space-y-4">
			{/* Direction Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Transfer Direction
					</label>
					<div className="flex gap-4">
					{source === "MAIN" ? (
						<>
							<label className="flex items-center">
								<input
									type="radio"
									checked={direction === "MAIN_TO_PAYIN"}
									onChange={() => setDirection("MAIN_TO_PAYIN")}
									className="mr-2 p-1"
								/>
								Main{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayIn
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									checked={direction === "MAIN_TO_PAYOUT"}
									onChange={() => setDirection("MAIN_TO_PAYOUT")}
									className="mr-2 p-3"
								/>
								Main{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayOut
							</label>
						</>
					) : (
						<>
							<label className="flex items-center">
								<input
									type="radio"
									checked={direction === "PAYOUT_TO_PAYIN"}
									onChange={() => setDirection("PAYOUT_TO_PAYIN")}
									className="mr-2 p-1"
								/>
								PayOut{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayIn
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									checked={direction === "PAYOUT_TO_MAIN"}
									onChange={() => setDirection("PAYOUT_TO_MAIN")}
									className="mr-2 p-3"
								/>
								PayOut{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								Main
							</label>
						</>
					)}
					</div>
				</div>

				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>Amount ({wallet.currency})</span>
						<span className="text-xs">
							Available: {getAvailableBalance().toLocaleString()}{" "}
							{wallet.currency}
						</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={`Enter amount in ${wallet.currency}`}
						min="1"
						step="0.01"
					/>
				</div>

				{/* Reason Input */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Reason (Optional)
					</label>
					<input
						type="text"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter reason for transfer"
					/>
				</div>

				{/* Transfer Summary */}
				{amountNum > 0 && (
					<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="font-medium">
								From {getSourceLabel()}:
							</span>
							<span className="font-bold text-red-600">
								-{amountNum.toLocaleString()} {wallet.currency}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">
								To {getDestinationLabel()}:
							</span>
							<span className="font-bold text-green-600">
								+{amountNum.toLocaleString()} {wallet.currency}
							</span>
						</div>
						<div className="flex justify-between border-t pt-2">
							<span className="font-medium">Total Balance:</span>
							<span className="font-bold text-gray-900">
								{(source === "MAIN"
									? Number(wallet.balance || 0)
									: Number(wallet.payout_balance || 0)
								).toLocaleString()} {wallet.currency}
							</span>
						</div>
					</div>
				)}
			</div>

			{errorMessage && (
				<div className="my-2 p-2 text-xs bg-red-100 text-red-700 rounded-md">
					{errorMessage}
				</div>
			)}

			<div className="flex gap-3 justify-end mt-6">
				<CButton
					text="Cancel"
					btnStyle="outlineDark"
					onClick={() => setIsOpen(false)}
				/>
				<CButton
					text="Transfer"
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={
						amountNum <= 0 || amountNum > getAvailableBalance()
					}
				/>
			</div>

			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default TransferPayInPayOutModal;
