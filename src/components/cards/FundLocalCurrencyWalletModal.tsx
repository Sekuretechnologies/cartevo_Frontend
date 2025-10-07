import CButton from "@/components/shared/CButton";
import { useTranslation } from "@/hooks/useTranslation";
import { selectTransactionFees } from "@/redux/slices_v2/settings";
import { getCountryPhonePrefix } from "@/utils/utils";
import { Select, SelectItem } from "@nextui-org/select";
import classNames from "classnames";
import { countries as countryDataList } from "country-data";
import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
interface FundLocalCurrencyWalletModalProps {
	userId: string;
	walletId: string;
	setIsOpen: (isOpen: boolean) => void;
	isLoading: boolean;
	isSuccess: boolean;
	isError: boolean;
	onSubmit: (data: FundLocalCurrencyWalletSubmitProps) => void;
	phoneNumbers?: string[];
	currency: string;
	countryIsoCode: string;
	// countryPhoneCode: string;
	operators: { operator_code: string; operator_name: string }[];
	walletBalance: number;
}

export interface FundLocalCurrencyWalletSubmitProps {
	userId: string;
	walletId: string;
	amount: number;
	phone: string;
	operator: string;
	// feeAmount: number;
	// totalAmount: number;
	currency: string;
	// countryIsoCode: string;
	// countryPhoneCode: string;
}

const PREPROD_MAX_TRANSACTION: Record<string, number> = {
	USD: 90,
	NGN: 130000,
	GHS: 1000,
	XAF: 50000,
	XOF: 50000,
	GNF: 750000,
	HTG: 12000,
};

const FundLocalCurrencyWalletModal: React.FC<
	FundLocalCurrencyWalletModalProps
> = ({
	userId,
	walletId,
	setIsOpen,
	onSubmit,
	isLoading,
	isSuccess,
	isError,
	phoneNumbers = [],
	operators,
	currency,
	countryIsoCode,
	walletBalance,
}) => {
	const { t }: { t: any } = useTranslation();
	const [amount, setAmount] = useState("100");
	const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");
	const [newPhoneNumber, setNewPhoneNumber] = useState("");
	const [operator, setOperator] = useState("");
	const [useExistingPhone, setUseExistingPhone] = useState(
		phoneNumbers.length > 0
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { prodMode } = useSelector((state: any) => state.settings);

	const countryPhoneCode = getCountryPhonePrefix(
		(countryDataList as any)[countryIsoCode]?.countryCallingCodes || []
	);
	// Get transaction fees from Redux store
	const transactionFees = useSelector(selectTransactionFees);

	const feeData = transactionFees.find(
		(fee: any) =>
			fee.transaction_category === "WALLET" &&
			fee.transaction_type === "FUND"
	);

	const fees = feeData?.value || 1.5; // Fallback to 1.5% if not found

	const amountNum = parseFloat(amount) || 0;
	const feeAmount = (amountNum * fees) / 100;
	const totalAmount = amountNum + feeAmount;
	const hasPhoneNumbers = phoneNumbers.length > 0;

	const handleSubmit = () => {
		setErrorMessage(null);

		if (!prodMode) {
			const limit =
				PREPROD_MAX_TRANSACTION[
					currency as keyof typeof PREPROD_MAX_TRANSACTION
				];
			if (limit && Number(walletBalance) + amountNum > limit) {
				setErrorMessage(
					`With this funding, the balance would exceed the pre-production limit of ${limit} ${currency}.`
				);
				return;
			}
		}

		if (!amountNum || amountNum <= 0) {
			setErrorMessage("Please enter a valid amount");
			return;
		}

		const phoneNumber = useExistingPhone
			? selectedPhoneNumber.split("-")[1]
			: newPhoneNumber;

		const phoneOperator = useExistingPhone
			? selectedPhoneNumber.split("-")[0]
			: operator;

		if (!phoneNumber) {
			setErrorMessage("Please select or enter a phone number");
			return;
		}

		if (!useExistingPhone && !operator) {
			setErrorMessage("Please select an operator");
			return;
		}

		console.log({
			countryPhoneCode,
			userId,
			walletId,
			amount: amountNum,
			phone: String(phoneNumber)
				?.replace(`+`, "")
				?.replace(`${countryPhoneCode}`, ""),
			operator: phoneOperator,
			currency,
			// feeAmount,
			// totalAmount,
			// countryIsoCode,
			// countryPhoneCode,
		});

		onSubmit({
			userId,
			walletId,
			amount: amountNum,
			phone: String(phoneNumber)
				?.replace(`+`, "")
				?.replace(`${countryPhoneCode}`, ""),
			operator: phoneOperator,
			currency,
			// feeAmount,
			// totalAmount,
			// countryIsoCode,
			// countryPhoneCode,
		});
		// if (isSuccess || isError) setIsOpen(false);
	};

	useEffect(() => {
		if (isSuccess || isError) setIsOpen(false);
	}, [isSuccess, isError]);

	return (
		<div className="bg-white rounded-lg p-6 w-[400px]">
			<h2 className="text-xl font-bold mb-4">
				{t.wallets.modals.fundLocal.title.replace(
					"{currency}",
					currency
				)}
			</h2>

			<div className="space-y-4">
				{/* Amount Input */}
				<div>
					<label className="flex justify-between items-center block text-sm font-medium text-gray-700 mb-2">
						<span>
							{t.wallets.modals.fundLocal.amountLabel.replace(
								"{currency}",
								currency
							)}
						</span>
						<span className="text-xs">
							{t.wallets.modals.fundLocal.amountMin.replace(
								"{currency}",
								currency
							)}
						</span>
					</label>
					<input
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={`Enter amount in ${currency}`}
						min="100"
						step="50"
					/>
					<p className="flex text-xs text-gray-900 mt-2">
						<span>Fee ({fees}%) : </span>
						<span className="font-medium">
							{feeAmount.toLocaleString()} {currency}
						</span>
					</p>
				</div>

				{/* Phone Number Selection */}
				{hasPhoneNumbers && phoneNumbers.length < 3 && (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.wallets.modals.fundLocal.useExistingPhone}
						</label>
						<div className="flex gap-4">
							<label className="flex items-center">
								<input
									type="radio"
									checked={useExistingPhone}
									onChange={() => setUseExistingPhone(true)}
									className="mr-2"
								/>
								{t.wallets.modals.fundLocal.existing}
							</label>
							<label className="flex items-center">
								<input
									type="radio"
									checked={!useExistingPhone}
									onChange={() => setUseExistingPhone(false)}
									className="mr-2"
								/>
								{t.wallets.modals.fundLocal.new}
							</label>
						</div>
					</div>
				)}

				{useExistingPhone && hasPhoneNumbers ? (
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.wallets.modals.fundLocal.selectPhone}
						</label>
						<Select
							placeholder={t.wallets.modals.fundLocal.selectPhone}
							selectedKeys={[selectedPhoneNumber]}
							onSelectionChange={(keys) => {
								const value = keys.currentKey as string;
								setSelectedPhoneNumber(value);
							}}
							className="w-full"
						>
							{phoneNumbers.map((item: any) => (
								<SelectItem
									key={`${item.operator}-${item.phone_number}`}
									value={`${item.operator}-${item.phone_number}`}
								>
									{item.phone_number}
								</SelectItem>
							))}
						</Select>
					</div>
				) : (
					<>
						{/* New Phone Number Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								{t.wallets.modals.fundLocal.phoneNumber}
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
								{t.wallets.modals.fundLocal.operator}
							</label>
							<Select
								placeholder={
									t.wallets.modals.fundLocal.operatorPh
								}
								selectedKeys={[operator]}
								onSelectionChange={(keys) => {
									const value = keys.currentKey as string;
									setOperator(value);
								}}
								className="w-full"
							>
								{operators.map((op: any) => (
									<SelectItem
										key={op.operator_code}
										value={op.operator_code}
									>
										{op.operator_name}
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
						<span className="font-medium">
							{t.wallets.modals.fundLocal.totalDebited}
						</span>
						<span className="font-bold text-blue-600">
							{totalAmount.toLocaleString()} {currency}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="font-medium">
							{t.wallets.modals.fundLocal.amountReceived}
						</span>
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
					text={t.wallets.modals.fundLocal.cancel}
					btnStyle="outlineDark"
					onClick={() => setIsOpen(false)}
				/>
				<CButton
					text={t.wallets.modals.fundLocal.fundWallet}
					btnStyle="blue"
					onClick={handleSubmit}
					disabled={amountNum < 100}
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

export default FundLocalCurrencyWalletModal;
