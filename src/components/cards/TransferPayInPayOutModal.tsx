import CButton from "@/components/shared/CButton";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

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
	const { t }: { t: any } = useTranslation();
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
			setErrorMessage(
				t.wallets.modals.internalTransfers.errorInvalidAmount
			);
			return;
		}
		// Validate available based on source
		const available =
			source === "MAIN" ? wallet.balance || 0 : wallet.payout_balance;
		if (available < amountNum) {
			setErrorMessage(
				source === "MAIN"
					? t.wallets.modals.internalTransfers.insufficientMainBalance
					: t.wallets.modals.internalTransfers.insufficientPayoutBalance
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
			<h2 className="text-xl font-bold mb-4">
				{t.wallets.modals.internalTransfers.internalTransferTitle}
			</h2>
			<div className="space-y-4">
				{/* Direction Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.wallets.modals.internalTransfers.transferDirection}
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
									{t.wallets.modals.internalTransfers.main}{" "}
									{<ArrowRight className="inline-block mx-2 " />} {" "}
									{t.wallets.modals.internalTransfers.payIn}
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										checked={direction === "MAIN_TO_PAYOUT"}
										onChange={() => setDirection("MAIN_TO_PAYOUT")}
										className="mr-2 p-3"
									/>
									{t.wallets.modals.internalTransfers.main}{" "}
									{<ArrowRight className="inline-block mx-2 " />} {" "}
									{t.wallets.modals.internalTransfers.payOut}
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
									{t.wallets.modals.internalTransfers.payOut}{" "}
									{<ArrowRight className="inline-block -rotate-180 mx-2 -mt-1.5" />} {" "}
									{t.wallets.modals.internalTransfers.payIn}
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										checked={direction === "PAYOUT_TO_MAIN"}
										onChange={() => setDirection("PAYOUT_TO_MAIN")}
										className="mr-2 p-3"
									/>
									{t.wallets.modals.internalTransfers.payOut}{" "}
									{<ArrowRight className="inline-block mx-2" />} {" "}
									{t.wallets.modals.internalTransfers.main}
								</label>
							</>
						)}
					</div>
				</div>
				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>
							{t.wallets.modals.internalTransfers.amount} ({wallet.currency})
						</span>
						<span className="text-xs">
							{t.wallets.modals.internalTransfers.available} {getAvailableBalance().toLocaleString()} {" "}
							{wallet.currency}
						</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t.wallets.modals.internalTransfers.amountPh.replace("{currency}", String(wallet.currency))}
						min="1"
						step="0.01"
					/>
				</div>
				{/* Reason Input */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.wallets.modals.internalTransfers.reasonOptional}
					</label>
					<input
						type="text"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t.wallets.modals.internalTransfers.reasonPh}
					/>
				</div>
				{/* Transfer Summary */}
				{amountNum > 0 && (
					<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="font-medium">
								{source === "MAIN" ? t.wallets.modals.internalTransfers.fromMain : t.wallets.modals.internalTransfers.fromPayIn}
							</span>
							<span className="font-bold text-red-600">
								-{amountNum.toLocaleString()} {wallet.currency}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">
								{direction === "PAYOUT_TO_PAYIN" || direction === "MAIN_TO_PAYIN" ? t.wallets.modals.internalTransfers.toMain.replace("Main", t.wallets.modals.internalTransfers.payIn) : t.wallets.modals.internalTransfers.toPayout}
							</span>
							<span className="font-bold text-green-600">
								+{amountNum.toLocaleString()} {wallet.currency}
							</span>
						</div>
						<div className="flex justify-between border-t pt-2">
							<span className="font-medium">{t.wallets.detail.totalBalance}:</span>
							<span className="font-bold text-gray-900">
								{(source === "MAIN" ? Number(wallet.balance || 0) : Number(wallet.payout_balance || 0)).toLocaleString()} {" "}
								{wallet.currency}
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
					text={t.wallets.modals.internalTransfers.cancel}
					btnStyle="outlineDark"
					onClick={() => setIsOpen(false)}
				/>
				<CButton
					text={t.wallets.modals.internalTransfers.transfer}
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={amountNum <= 0 || amountNum > getAvailableBalance()}
				/>
			</div>
			<LoadingOverlay isLoading={isLoading} />
		</div>
	);
};

export default TransferPayInPayOutModal;
