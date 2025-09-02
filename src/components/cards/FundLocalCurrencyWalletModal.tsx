import React, { useState } from "react";
import CButton from "@/components/shared/CButton";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Select, SelectItem } from "@nextui-org/select";
import { useSelector } from "react-redux";
import { selectTransactionFees } from "@/redux/slices_v2/settings";

interface FundLocalCurrencyWalletModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: {
		amount: number;
		phoneNumber: string;
		operator?: string;
		feeAmount: number;
		totalAmount: number;
		currency: string;
		countryIsoCode: string;
		countryPhoneCode: string;
	}) => void;
	phoneNumbers?: string[];
	currency: string;
	countryIsoCode: string;
	countryPhoneCode: string;
}

const FundLocalCurrencyWalletModal: React.FC<
	FundLocalCurrencyWalletModalProps
> = ({
	setIsOpen,
	onSubmit,
	phoneNumbers = [],
	currency,
	countryIsoCode,
	countryPhoneCode,
}) => {
	const [amount, setAmount] = useState("100");
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [operator, setOperator] = useState("MTN");
	const [useExistingPhone, setUseExistingPhone] = useState(
		phoneNumbers.length > 0
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Get transaction fees from Redux store
	const transactionFees = useSelector(selectTransactionFees);

	// Find the appropriate transaction fee for local currency funding
	const feeData = transactionFees.find(
		(fee: any) =>
			fee.transaction_category === "TOPUP" &&
			fee.transaction_type === "WALLET"
	);

	const fees = feeData?.value || 1.5; // Fallback to 1.5% if not found

	const amountNum = parseFloat(amount) || 0;
	const feeAmount = (amountNum * fees) / 100;
	const totalAmount = amountNum + feeAmount;
	const hasPhoneNumbers = phoneNumbers.length > 0;

	const operators = [
		{
			code: "MTN",
			name: `MTN ${countryIsoCode === "CM" ? "Cameroon" : "Mobile"}`,
		},
		{
			code: "ORANGE",
			name: `Orange ${countryIsoCode === "CM" ? "Cameroon" : "Mobile"}`,
		},
		{ code: "NEXTTEL", name: "Nexttel" },
	];

	const handleSubmit = () => {
		if (!amountNum || amountNum <= 0) {
			setErrorMessage("Please enter a valid amount");
			return;
		}

		const phoneNumber = useExistingPhone
			? selectedPhoneNumber
			: newPhoneNumber;

		if (!phoneNumber) {
			setErrorMessage("Please select or enter a phone number");
			return;
		}

		if (!useExistingPhone && !operator) {
			setErrorMessage("Please select an operator");
			return;
		}

		onSubmit({
			amount: amountNum,
			phoneNumber,
			operator: useExistingPhone ? undefined : operator,
			feeAmount,
			totalAmount,
			currency,
			countryIsoCode,
			countryPhoneCode,
		});
		setIsOpen(false);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">Fund {currency} Wallet</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>Amount ({currency})</span>
						<span className="text-xs">Minimum: 100 {currency}</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={`Enter amount in ${currency}`}
						min="100"
						step="100"
					/>
					<p className="flex text-xs text-gray-900 mt-2">
						<span>Fee ({fees}%) : </span>
						<span className="font-medium">
							{feeAmount.toLocaleString()} {currency}
						</span>
					</p>
				</div>

				{/* Phone Number Selection */}
				{hasPhoneNumbers && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Use existing phone number?
						</label>
						<div className="flex gap-4">
							<label className="flex items-center">
								<input
									type="radio"
									checked={useExistingPhone}
									onChange={() => setUseExistingPhone(true)}
									className="mr-2"
								/>
								Existing
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									checked={!useExistingPhone}
									onChange={() => setUseExistingPhone(false)}
									className="mr-2"
								/>
								New
							</label>
						</div>
					</div>
				)}

				{useExistingPhone && hasPhoneNumbers ? (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Select Phone Number
						</label>
						<Select
							placeholder="Select a phone number"
							selectedKeys={
								selectedPhoneNumber ? [selectedPhoneNumber] : []
							}
							onSelectionChange={(keys) => {
								const value = keys.currentKey as string;
								setSelectedPhoneNumber(value);
							}}
							className="w-full"
						>
							{phoneNumbers.map((phone) => (
								<SelectItem key={phone} value={phone}>
									{phone}
								</SelectItem>
							))}
						</Select>
					</div>
				) : (
					<>
						{/* New Phone Number Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<div className="phoneInputCustomClass w-full px-3 py-2 border border-gray-300 rounded-md">
								<PhoneInput
									value={newPhoneNumber}
									onChange={(value) =>
										setNewPhoneNumber(value || "")
									}
									defaultCountry={countryIsoCode as any}
									international
									countryCallingCodeEditable={false}
									className="w-full border-0"
									// inputClassName="w-full border-0 focus:outline-none focus:ring-0"
									// containerClassName="w-full border-0"
									placeholder="Enter phone number"
								/>
							</div>
						</div>

						{/* Operator Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Operator
							</label>
							<Select
								placeholder="Select an operator"
								selectedKeys={[operator]}
								onSelectionChange={(keys) => {
									const value = keys.currentKey as string;
									setOperator(value);
								}}
								className="w-full"
							>
								{operators.map((op) => (
									<SelectItem key={op.code} value={op.code}>
										{op.name}
									</SelectItem>
								))}
							</Select>
						</div>
					</>
				)}

				{/* Fee and Amount Display */}
				{/* {amountNum > 0 && ( */}
				<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="font-medium">Total debited:</span>
						<span className="font-bold text-blue-600">
							{totalAmount.toLocaleString()} {currency}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">Amount received:</span>
						<span className="font-bold text-green-600">
							{amountNum.toLocaleString()} {currency}
						</span>
					</div>
				</div>
				{/* )} */}
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
					disabled={amountNum < 100}
				/>
			</div>
		</div>
	);
};

export default FundLocalCurrencyWalletModal;
