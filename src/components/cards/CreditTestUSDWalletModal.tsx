import React, { useState, useEffect } from "react";
import CButton from "@/components/shared/CButton";
import * as CFlags from "country-flag-icons/react/3x2";
import { ItemFlag } from "@/components/shared/ItemFlag";
import { Select, SelectItem } from "@nextui-org/select";
import { useSelector } from "react-redux";
import {
	selectExchangeRates,
	selectTransactionFees,
} from "@/redux/slices_v2/settings";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";

const CountryFlags: any = CFlags;

interface CreditTestWalletModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: CreditTestWalletSubmitProps) => void;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
}

export interface CreditTestWalletSubmitProps {
	currency: string;
	amount: number;
}

const CreditTestWalletModal: React.FC<CreditTestWalletModalProps> = ({
	setIsOpen,
	onSubmit,
	isLoading,
	isSuccess,
	isError,
}) => {
	const [amount, setAmount] = useState(1);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const fees = 0; //feeData?.value || 2.5; // Fallback to 2.5% if not found

	useEffect(() => {
		if (amount <= 0) {
			setErrorMessage("Please enter a valid amount");
			return;
		}
		setErrorMessage(null);
	}, [amount]);

	const handleSubmit = () => {
		if (errorMessage) {
			return; // Prevent submission if there's an error
		}

		onSubmit({
			amount: amount,
			currency: "USD",
		});
		// setIsOpen(false);
	};

	useEffect(() => {
		if (isSuccess || isError) setIsOpen(false);
	}, [isSuccess, isError]);
	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">Credit Test USD Wallet</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>{`Amount (USD)`}</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(Number(e.target.value || 0))}
						className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter amount in USD"
						min="1"
						step="0.01"
					/>
				</div>
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
					text="Credit"
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={!!errorMessage}
				/>
			</div>

			{isLoading && (
				<div
					className={classNames(
						"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-[1000]": isLoading,
						}
					)}
				>
					<PuffLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div>
			)}
		</div>
	);
};

export default CreditTestWalletModal;
