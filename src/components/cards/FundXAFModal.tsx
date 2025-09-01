import React, { useState } from "react";
import CButton from "@/components/shared/CButton";

interface FundXAFModalProps {
	setIsOpen: (isOpen: boolean) => void;
	onSubmit: (data: {
		amount: number;
		phoneNumber: string;
		operator?: string;
		feeAmount: number;
		totalAmount: number;
	}) => void;
	phoneNumbers?: string[];
}

const FundXAFModal: React.FC<FundXAFModalProps> = ({
	setIsOpen,
	onSubmit,
	phoneNumbers = [],
}) => {
	const [amount, setAmount] = useState("");
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [operator, setOperator] = useState("MTN");
	const [useExistingPhone, setUseExistingPhone] = useState(
		phoneNumbers.length > 0
	);
	const [fees] = useState(1.5); // Fee percentage for XAF funding

	const amountNum = parseFloat(amount) || 0;
	const feeAmount = (amountNum * fees) / 100;
	const totalAmount = amountNum + feeAmount;
	const hasPhoneNumbers = phoneNumbers.length > 0;

	const operators = [
		{ code: "MTN", name: "MTN Cameroon" },
		{ code: "ORANGE", name: "Orange Cameroon" },
		{ code: "NEXTTEL", name: "Nexttel" },
	];

	const handleSubmit = () => {
		if (amountNum <= 0) {
			alert("Please enter a valid amount");
			return;
		}

		const phoneNumber = useExistingPhone
			? selectedPhoneNumber
			: newPhoneNumber;

		if (!phoneNumber) {
			alert("Please select or enter a phone number");
			return;
		}

		if (!useExistingPhone && !operator) {
			alert("Please select an operator");
			return;
		}

		onSubmit({
			amount: amountNum,
			phoneNumber,
			operator: useExistingPhone ? undefined : operator,
			feeAmount,
			totalAmount,
		});
		setIsOpen(false);
	};

	return (
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<h2 className="text-xl font-bold mb-4">Fund XAF Wallet</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Amount (XAF)
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="Enter amount in XAF"
						min="100"
						step="100"
					/>
					<p className="text-xs text-gray-500 mt-1">
						Minimum: 100 XAF
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
						<select
							value={selectedPhoneNumber}
							onChange={(e) =>
								setSelectedPhoneNumber(e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="">Select a phone number</option>
							{phoneNumbers.map((phone) => (
								<option key={phone} value={phone}>
									{phone}
								</option>
							))}
						</select>
					</div>
				) : (
					<>
						{/* New Phone Number Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								value={newPhoneNumber}
								onChange={(e) =>
									setNewPhoneNumber(e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter phone number"
							/>
						</div>

						{/* Operator Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Operator
							</label>
							<select
								value={operator}
								onChange={(e) => setOperator(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{operators.map((op) => (
									<option key={op.code} value={op.code}>
										{op.name}
									</option>
								))}
							</select>
						</div>
					</>
				)}

				{/* Fee and Amount Display */}
				{/* {amountNum > 0 && ( */}
				<div className="bg-gray-50 p-4 rounded-md">
					<h3 className="text-sm font-medium text-gray-700 mb-3">
						Transaction Summary
					</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span>Amount to fund:</span>
							<span className="font-medium">
								{amountNum.toLocaleString()} XAF
							</span>
						</div>
						<div className="flex justify-between">
							<span>Fee ({fees}%):</span>
							<span className="font-medium">
								{feeAmount.toLocaleString()} XAF
							</span>
						</div>
						<div className="flex justify-between border-t pt-2">
							<span className="font-medium">Total debited:</span>
							<span className="font-bold text-blue-600">
								{totalAmount.toLocaleString()} XAF
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-medium">
								Amount received:
							</span>
							<span className="font-bold text-green-600">
								{amountNum.toLocaleString()} XAF
							</span>
						</div>
					</div>
				</div>
				{/* )} */}
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
					disabled={amountNum < 100}
				/>
			</div>
		</div>
	);
};

export default FundXAFModal;
