import React, { useState, useEffect } from "react";
import CButton from "@/components/shared/CButton";
import * as CFlags from "country-flag-icons/react/3x2";
import { ItemFlag } from "@/app/wallets/page";
import { Select, SelectItem } from "@nextui-org/select";
import { useSelector } from "react-redux";
import {
	selectExchangeRates,
	selectTransactionFees,
} from "@/redux/slices_v2/settings";

const CountryFlags: any = CFlags;

interface DepositToUSDWalletModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: {
		sourceWallet: {
			id: string;
			currency: string;
			amount: number;
			feeAmount: number;
			totalAmount: number;
		};
		destinationallet: {
			id: string;
			currency: string;
			amount: number;
		};
		exchangeRate: {
			rate: number;
			fromCurrency: string;
			toCurrency: string;
		};
	}) => void;
	wallets: any[];
}

const DepositToUSDWalletModal: React.FC<DepositToUSDWalletModalProps> = ({
	setIsOpen,
	onSubmit,
	wallets,
}) => {
	const [amount, setAmount] = useState("1");

	const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState("CM");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Get data from Redux store
	const exchangeRates = useSelector(selectExchangeRates);
	// const transactionFees = useSelector(selectTransactionFees);

	// Find the appropriate exchange rate (XAF to USD)
	const exchangeRateData = exchangeRates.find(
		(rate: any) =>
			rate.from_currency === "USD" && rate.to_currency === "XAF"
	);
	const exchangeRate = exchangeRateData?.rate || 640; // Fallback to 640 if not found

	// Find the appropriate transaction fee for USD funding
	// const feeData = transactionFees.find(
	// 	(fee: any) =>
	// 		fee.transaction_category === "TOPUP" &&
	// 		fee.transaction_type === "WALLET"
	// );
	const fees = 0; //feeData?.value || 2.5; // Fallback to 2.5% if not found

	const amountNum = parseFloat(amount) || 0;
	const exchangeAmount = amountNum * exchangeRate;
	const feeAmount = (exchangeAmount * fees) / 100;
	const totalAmount = exchangeAmount + feeAmount;

	const availableWallets = wallets.filter(
		(wallet) => wallet.currency !== "USD"
	);

	const [sourceWallet, setSourceWallet] = useState(
		`${availableWallets?.[0]?.currency}-${availableWallets?.[0]?.country_iso_code}`
	);

	const selectedWallet = availableWallets.find(
		(w) => `${w.currency}-${w.country_iso_code}` === sourceWallet
	);

	useEffect(() => {
		if (availableWallets.length === 0) {
			setSourceWallet("");
			setSelectedCountryIsoCode("");
			return;
		}

		if (
			!availableWallets.find(
				(w) => `${w.currency}-${w.country_iso_code}` === sourceWallet
			)
		) {
			const firstWallet = availableWallets[0];
			setSourceWallet(
				`${firstWallet.currency}-${firstWallet.country_iso_code}`
			);
			setSelectedCountryIsoCode(firstWallet.country_iso_code || "CM");
		}
	}, [availableWallets, sourceWallet]);

	useEffect(() => {
		if (availableWallets.length === 0) {
			setErrorMessage("No wallets available");
			return;
		}

		if (!sourceWallet || sourceWallet === "") {
			setErrorMessage("Select a source wallet first");
			return;
		}

		if (amountNum <= 0) {
			setErrorMessage("Please enter a valid amount");
			return;
		}

		const selectedWallet = availableWallets.find(
			(w) => `${w.currency}-${w.country_iso_code}` === sourceWallet
		);
		if (!selectedWallet) {
			setErrorMessage("No suitable source wallet found");
			return;
		}

		if (selectedWallet.balance < totalAmount) {
			setErrorMessage("Insufficient balance in source wallet");
			return;
		}

		setErrorMessage(null);
	}, [amount, sourceWallet, availableWallets, amountNum, totalAmount]);

	const handleSubmit = () => {
		if (errorMessage) {
			return; // Prevent submission if there's an error
		}

		// Find the USD destination wallet
		const destinationWallet = wallets.find(
			(wallet) => wallet.currency === "USD"
		);

		if (!destinationWallet) {
			setErrorMessage("USD wallet not found");
			return;
		}

		onSubmit({
			sourceWallet: {
				id: selectedWallet?.id || "",
				currency: selectedWallet?.currency,
				amount: exchangeAmount,
				feeAmount: feeAmount,
				totalAmount: totalAmount,
			},
			destinationallet: {
				id: destinationWallet?.id || "",
				currency: destinationWallet?.currency,
				amount: amountNum,
			},
			exchangeRate: {
				rate: exchangeRate,
				fromCurrency: exchangeRateData.from_currency,
				toCurrency: exchangeRateData.to_currency,
			},
		});
		setIsOpen(false);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">Fund USD Wallet</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>{`Amount (USD)`}</span>
						<span className="text-xs">{`1 USD = ${exchangeRate} ${
							sourceWallet ? sourceWallet.split("-")[0] : "XAF"
						}`}</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter amount in USD"
						min="1"
						step="0.01"
					/>
				</div>

				{/* Source Wallet Selection */}
				<div>
					<label className="flex justify-between items-center text-sm font-medium text-gray-700 mb-2">
						<div className="flex items-center gap-1">
							{`Source Wallet`}{" "}
							{selectedCountryIsoCode && (
								<ItemFlag
									iso2={selectedCountryIsoCode}
									size={3}
								/>
							)}
							{sourceWallet && ` (${sourceWallet.split("-")[0]})`}
						</div>
						<span className="text-xs">{`${exchangeAmount.toLocaleString()} ${
							sourceWallet ? sourceWallet.split("-")[0] : "XAF"
						}`}</span>
					</label>
					<Select
						placeholder="Select wallet"
						defaultSelectedKeys={sourceWallet ? [sourceWallet] : []}
						style={{
							width: "100%",
						}}
						className={`bg-app-lightgray text-gray-900 font-normal rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
						onSelectionChange={(keys) => {
							const value = keys.currentKey as string;
							const currency = value?.split("-")?.[0];
							const iso = value?.split("-")?.[1];
							setSourceWallet(value);
							setSelectedCountryIsoCode(iso);
						}}
						renderValue={(items) => {
							return items.map((item) => {
								const wallet = availableWallets.find(
									(w) =>
										`${w.currency}-${w.country_iso_code}` ===
										item.key
								);
								return (
									<div
										className="flex items-center gap-2"
										key={item.key}
									>
										<ItemFlag
											iso2={wallet?.country_iso_code}
											size={3}
										/>
										<span>
											{`${wallet?.country_iso_code} -
											Balance (${wallet?.currency}) : 
											${wallet?.balance?.toLocaleString() || 0}`}
										</span>
									</div>
								);
							});
						}}
					>
						{availableWallets.map((wallet) => (
							<SelectItem
								key={`${wallet.currency}-${wallet.country_iso_code}`}
								value={`${wallet.currency}-${wallet.country_iso_code}`}
							>
								<div className="flex items-center gap-2">
									<ItemFlag
										iso2={wallet.country_iso_code}
										size={3}
									/>
									<span>
										{`${wallet?.country_iso_code} -
											Balance (${wallet?.currency}) : 
											${wallet?.balance?.toLocaleString() || 0}`}
									</span>
								</div>
							</SelectItem>
						))}
					</Select>
				</div>

				{/* Exchange Rate Display */}
				<div className="bg-gray-50 p-3 rounded-md">
					<div className="text-sm text-gray-600">
						<div className="flex flex-col gap-2 font-medium">
							{fees > 0 ? (
								<div className="text-sm">
									Fees: {fees}% (
									{`${feeAmount.toLocaleString()} ${
										sourceWallet
											? sourceWallet.split("-")[0]
											: "XAF"
									}`}
									)
								</div>
							) : (
								<></>
							)}
							<div className="text-lg font-bold text-blue-600">
								Total: {totalAmount.toLocaleString()}{" "}
								{sourceWallet
									? sourceWallet.split("-")[0]
									: "XAF"}
							</div>
						</div>
					</div>
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
					text="Fund Wallet"
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={!!errorMessage}
				/>
			</div>
		</div>
	);
};

export default DepositToUSDWalletModal;
