import React, { useState, useEffect } from "react";
import CButton from "@/components/shared/CButton";

interface FundUSDModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: {
		amount: number;
		sourceWallet: string;
		exchangeRate: number;
		fees: number;
		totalAmount: number;
	}) => void;
	wallets: any[];
}

const FundUSDModal: React.FC<FundUSDModalProps> = ({
	setIsOpen,
	onSubmit,
	wallets,
}) => {
	const [amount, setAmount] = useState("");
	const [sourceWallet, setSourceWallet] = useState("XAF");
	const [exchangeRate] = useState(600); // Mock exchange rate, should come from API
	const [fees] = useState(2.5); // Mock fees percentage

	const amountNum = parseFloat(amount) || 0;
	const exchangeAmount = amountNum * exchangeRate;
	const feeAmount = (exchangeAmount * fees) / 100;
	const totalAmount = exchangeAmount + feeAmount;

	const availableWallets = wallets.filter(
		(wallet) => wallet.currency === "XAF" || wallet.currency === "XOF"
	);

	useEffect(() => {
		if (
			availableWallets.length > 0 &&
			!availableWallets.find((w) => w.currency === sourceWallet)
		) {
			setSourceWallet(availableWallets[0].currency);
		}
	}, [availableWallets, sourceWallet]);

	const handleSubmit = () => {
		if (amountNum <= 0) {
			alert("Please enter a valid amount");
			return;
		}

		const selectedWallet = availableWallets.find(
			(w) => w.currency === sourceWallet
		);
		if (!selectedWallet) {
			alert("No suitable source wallet found");
			return;
		}

		if (selectedWallet.balance < totalAmount) {
			alert("Insufficient balance in source wallet");
			return;
		}

		onSubmit({
			amount: amountNum,
			sourceWallet,
			exchangeRate,
			fees,
			totalAmount,
		});
		setIsOpen(false);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<h2 className="text-xl font-bold mb-4">Fund USD Wallet</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Amount (USD)
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter amount in USD"
						min="0"
						step="0.01"
					/>
				</div>

				{/* Source Wallet Selection */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Source Wallet
					</label>
					<select
						value={sourceWallet}
						onChange={(e) => setSourceWallet(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						{availableWallets.map((wallet) => (
							<option
								key={wallet.currency}
								value={wallet.currency}
							>
								{wallet.currency} - Balance:{" "}
								{wallet.balance?.toLocaleString() || 0}
							</option>
						))}
					</select>
				</div>

				{/* Exchange Rate Display */}
				<div className="bg-gray-50 p-3 rounded-md">
					<div className="text-sm text-gray-600">
						<div>
							Exchange Rate: 1 USD = {exchangeRate} {sourceWallet}
						</div>
						<div>Fees: {fees}%</div>
						<div className="mt-2 font-medium">
							<div>
								Amount in {sourceWallet}:{" "}
								{exchangeAmount.toLocaleString()} {sourceWallet}
							</div>
							<div>
								Fees: {feeAmount.toLocaleString()}{" "}
								{sourceWallet}
							</div>
							<div className="text-lg font-bold text-blue-600">
								Total: {totalAmount.toLocaleString()}{" "}
								{sourceWallet}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="flex gap-3 justify-end mt-6">
				<CButton
					text="Cancel"
					btnStyle="outlineDark"
					onClick={() => setIsOpen(false)}
				/>
				<CButton
					text="Fund Wallet"
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={amountNum <= 0}
				/>
			</div>
		</div>
	);
};

export default FundUSDModal;
