"use client";
import { useTitle } from "@/hooks/useTitle";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "react-query";

import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";
import CustomTable from "@/components/shared/CustomTable";
import BadgeLabel from "@/components/shared/BadgeLabel";

import { SettingsService } from "@/api/services/cartevo-api/settings";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useSelector } from "react-redux";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import {
	ExchangeRate,
	TransactionFee,
	CreateExchangeRateRequest,
	UpdateExchangeRateRequest,
	CreateTransactionFeeRequest,
	UpdateTransactionFeeRequest,
} from "@/types/settings";
import { getFormattedDateTime } from "@/utils/DateFormat";

const getExchangeRates = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;

	const response = await SettingsService.get_exchange_rates({ token });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get exchange rates");
	}
	return responseJson.data;
};

const getTransactionFees = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;

	const response = await SettingsService.get_transaction_fees({ token });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get transaction fees"
		);
	}
	return responseJson.data;
};

export default function Settings() {
	useTitle("Cartevo | Settings", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const queryClient = useQueryClient();

	const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] =
		useState(false);
	const [isTransactionFeeModalOpen, setIsTransactionFeeModalOpen] =
		useState(false);
	const [editingExchangeRate, setEditingExchangeRate] =
		useState<ExchangeRate | null>(null);
	const [editingTransactionFee, setEditingTransactionFee] =
		useState<TransactionFee | null>(null);

	const exchangeRatesQuery = useQuery({
		queryKey: ["exchangeRates", currentToken],
		queryFn: getExchangeRates,
		onError: (err) => {
			toast.error("Failed to get exchange rates.");
		},
	});

	const transactionFeesQuery = useQuery({
		queryKey: ["transactionFees", currentToken],
		queryFn: getTransactionFees,
		onError: (err) => {
			toast.error("Failed to get transaction fees.");
		},
	});

	const deleteExchangeRateMutation = useMutation(
		(id: string) =>
			SettingsService.delete_exchange_rate({ token: currentToken, id }),
		{
			onSuccess: () => {
				toast.success("Exchange rate deleted successfully!");
				queryClient.invalidateQueries(["exchangeRates"]);
			},
			onError: (error: any) => {
				toast.error("Failed to delete exchange rate");
			},
		}
	);

	const deleteTransactionFeeMutation = useMutation(
		(id: string) =>
			SettingsService.delete_transaction_fee({ token: currentToken, id }),
		{
			onSuccess: () => {
				toast.success("Transaction fee deleted successfully!");
				queryClient.invalidateQueries(["transactionFees"]);
			},
			onError: (error: any) => {
				toast.error("Failed to delete transaction fee");
			},
		}
	);

	const handleEditExchangeRate = (rate: ExchangeRate) => {
		setEditingExchangeRate(rate);
		setIsExchangeRateModalOpen(true);
	};

	const handleEditTransactionFee = (fee: TransactionFee) => {
		setEditingTransactionFee(fee);
		setIsTransactionFeeModalOpen(true);
	};

	const handleDeleteExchangeRate = (id: string) => {
		if (
			window.confirm(
				"Are you sure you want to delete this exchange rate?"
			)
		) {
			deleteExchangeRateMutation.mutate(id);
		}
	};

	const handleDeleteTransactionFee = (id: string) => {
		if (
			window.confirm(
				"Are you sure you want to delete this transaction fee?"
			)
		) {
			deleteTransactionFeeMutation.mutate(id);
		}
	};

	// Exchange Rates Table Data
	const exchangeRatesTableData =
		exchangeRatesQuery.data?.map((rate: any, index: number) => ({
			serial: index + 1,
			fromCurrency: rate.from_currency,
			toCurrency: rate.to_currency,
			rate: rate.rate.toLocaleString("en-EN", {
				minimumFractionDigits: 2,
			}),
			description: String(rate.description || ""),
			// source: rate.source,
			// status: rate.isActive ? (
			// 	<BadgeLabel
			// 		className="text-xs"
			// 		label="Active"
			// 		badgeColor="#1F66FF"
			// 		textColor="#444"
			// 	/>
			// ) : (
			// 	<BadgeLabel
			// 		className="text-xs"
			// 		label="Inactive"
			// 		badgeColor="#F85D4B"
			// 		textColor="#444"
			// 	/>
			// ),

			// date: getFormattedDateTime(
			// 	new Date(rate.createdAt || new Date()),
			// 	"en"
			// ),
			// actions: (
			// 	<div className="flex gap-2">
			// 		<CButton
			// 			text="Edit"
			// 			btnStyle="outlineDark"
			// 			icon={<HiPencil />}
			// 			onClick={() => handleEditExchangeRate(rate)}
			// 			height="30px"
			// 		/>
			// 		<CButton
			// 			text="Delete"
			// 			btnStyle="red"
			// 			icon={<HiTrash />}
			// 			onClick={() => handleDeleteExchangeRate(rate.id!)}
			// 			height="30px"
			// 		/>
			// 	</div>
			// ),
		})) || [];

	// Transaction Fees Table Data
	const transactionFeesTableData =
		transactionFeesQuery.data?.map(
			(fee: TransactionFee, index: number) => ({
				serial: index + 1,
				// type: fee.transactionType,
				// category: fee.transactionCategory,
				// country: fee.countryIsoCode,
				// currency: fee.currency,
				// feeType: fee.type,
				description: fee.description,
				value:
					fee.type === "PERCENTAGE"
						? `${fee.value}%`
						: `${fee.value.toLocaleString("en-EN")} ${
								fee.currency
						  }`,

				// date: getFormattedDateTime(
				// 	new Date(fee.createdAt || new Date()),
				// 	"en"
				// ),
				// actions: (
				// 	<div className="flex gap-2">
				// 		<CButton
				// 			text="Edit"
				// 			btnStyle="outlineDark"
				// 			icon={<HiPencil />}
				// 			onClick={() => handleEditTransactionFee(fee)}
				// 			height="30px"
				// 		/>
				// 		<CButton
				// 			text="Delete"
				// 			btnStyle="red"
				// 			icon={<HiTrash />}
				// 			onClick={() => handleDeleteTransactionFee(fee.id!)}
				// 			height="30px"
				// 		/>
				// 	</div>
				// ),
			})
		) || [];

	const exchangeRatesHeaderData = {
		serial: "#",
		fromCurrency: "From",
		toCurrency: "To",
		rate: "Rate",
		// source: "Source",
		// status: "Status",
		description: "Description",
		// date: "Created",
		// actions: "Actions",
	};

	const transactionFeesHeaderData = {
		serial: "#",
		// type: "Type",
		// category: "Category",
		// country: "Country",
		// currency: "Currency",
		// feeType: "Fee Type",
		description: "Description",
		value: "Value",
		// date: "Created",
		// actions: "Actions",
	};

	return (
		<Layout title={"Settings"}>
			<section className="mt-2 space-y-8">
				{/* Exchange Rates Section */}
				<div className="bg-white shadow-md rounded-xl p-5">
					<div className="mb-4">
						<h2 className="text-xl font-semibold text-gray-800">
							Exchange Rates
						</h2>
						<p className="text-gray-600 text-sm mt-1">
							Manage currency exchange rates for your platform
						</p>
					</div>
					<CustomTable
						headerData={exchangeRatesHeaderData}
						tableData={exchangeRatesTableData}
						isLoading={exchangeRatesQuery.isLoading}
						// btn={
						// 	<CButton
						// 		text="Add Exchange Rate"
						// 		btnStyle="blue"
						// 		icon={<HiPlus />}
						// 		onClick={() => {
						// 			setEditingExchangeRate(null);
						// 			setIsExchangeRateModalOpen(true);
						// 		}}
						// 		height="33px"
						// 	/>
						// }
					/>
				</div>

				{/* Transaction Fees Section */}
				<div className="bg-white shadow-md rounded-xl p-5">
					<div className="mb-4">
						<h2 className="text-xl font-semibold text-gray-800">
							Transaction Fees
						</h2>
						<p className="text-gray-600 text-sm mt-1">
							Configure transaction fees for different payment
							types and countries
						</p>
					</div>
					<CustomTable
						headerData={transactionFeesHeaderData}
						tableData={transactionFeesTableData}
						isLoading={transactionFeesQuery.isLoading}
						// btn={
						// 	<CButton
						// 		text="Add Transaction Fee"
						// 		btnStyle="blue"
						// 		icon={<HiPlus />}
						// 		onClick={() => {
						// 			setEditingTransactionFee(null);
						// 			setIsTransactionFeeModalOpen(true);
						// 		}}
						// 		height="33px"
						// 	/>
						// }
					/>
				</div>

				{/* Exchange Rate Modal */}
				<Modal
					name="exchangeRateModal"
					isOpen={isExchangeRateModalOpen}
					setIsOpen={setIsExchangeRateModalOpen}
					modalContent={
						<ExchangeRateModal
							exchangeRate={editingExchangeRate}
							onClose={() => {
								setIsExchangeRateModalOpen(false);
								setEditingExchangeRate(null);
							}}
							onSuccess={() => {
								setIsExchangeRateModalOpen(false);
								setEditingExchangeRate(null);
								queryClient.invalidateQueries([
									"exchangeRates",
								]);
							}}
						/>
					}
				/>

				{/* Transaction Fee Modal */}
				<Modal
					name="transactionFeeModal"
					isOpen={isTransactionFeeModalOpen}
					setIsOpen={setIsTransactionFeeModalOpen}
					modalContent={
						<TransactionFeeModal
							transactionFee={editingTransactionFee}
							onClose={() => {
								setIsTransactionFeeModalOpen(false);
								setEditingTransactionFee(null);
							}}
							onSuccess={() => {
								setIsTransactionFeeModalOpen(false);
								setEditingTransactionFee(null);
								queryClient.invalidateQueries([
									"transactionFees",
								]);
							}}
						/>
					}
				/>
			</section>
		</Layout>
	);
}

// Exchange Rate Modal Component
function ExchangeRateModal({
	exchangeRate,
	onClose,
	onSuccess,
}: {
	exchangeRate: ExchangeRate | null;
	onClose: () => void;
	onSuccess: () => void;
}) {
	const currentToken = useSelector(selectCurrentToken);
	const [formData, setFormData] = useState<CreateExchangeRateRequest>({
		fromCurrency: exchangeRate?.fromCurrency || "",
		toCurrency: exchangeRate?.toCurrency || "",
		rate: exchangeRate?.rate || 0,
		source: exchangeRate?.source || "DEFAULT",
		description: exchangeRate?.description || "",
		isActive: exchangeRate?.isActive || true,
	});

	const mutation = useMutation(
		(data: CreateExchangeRateRequest | UpdateExchangeRateRequest) => {
			if (exchangeRate?.id) {
				return SettingsService.update_exchange_rate({
					token: currentToken,
					data: {
						...data,
						id: exchangeRate.id,
					} as UpdateExchangeRateRequest,
				});
			} else {
				return SettingsService.create_exchange_rate({
					token: currentToken,
					data: data as CreateExchangeRateRequest,
				});
			}
		},
		{
			onSuccess: async (response) => {
				const responseJson = await response.json();
				if (!response.ok) {
					throw new Error(
						responseJson.message || "Failed to save exchange rate"
					);
				}
				toast.success(
					`Exchange rate ${
						exchangeRate?.id ? "updated" : "created"
					} successfully!`
				);
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to save exchange rate");
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	const handleChange = (
		field: keyof CreateExchangeRateRequest,
		value: any
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				{exchangeRate?.id ? "Edit" : "Add"} Exchange Rate
			</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							From Currency
						</label>
						<input
							type="text"
							value={formData.fromCurrency}
							onChange={(e) =>
								handleChange("fromCurrency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="USD"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							To Currency
						</label>
						<input
							type="text"
							value={formData.toCurrency}
							onChange={(e) =>
								handleChange("toCurrency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="XAF"
							required
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Rate
					</label>
					<input
						type="number"
						step="0.01"
						value={formData.rate}
						onChange={(e) =>
							handleChange("rate", parseFloat(e.target.value))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="650"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Source
					</label>
					<select
						value={formData.source}
						onChange={(e) => handleChange("source", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="DEFAULT">Default</option>
						<option value="MANUAL">Manual</option>
						<option value="API">API</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							handleChange("description", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						placeholder="Exchange rate description"
						required
					/>
				</div>
				<div>
					<label className="flex items-center">
						<input
							type="checkbox"
							checked={formData.isActive}
							onChange={(e) =>
								handleChange("isActive", e.target.checked)
							}
							className="mr-2"
						/>
						<span className="text-sm text-gray-700">Active</span>
					</label>
				</div>
				<div className="flex gap-3 justify-end pt-4">
					<CButton
						text="Cancel"
						btnStyle="outlineDark"
						onClick={onClose}
						type="button"
					/>
					<CButton
						text={mutation.isLoading ? "Saving..." : "Save"}
						btnStyle="blue"
						type="submit"
						disabled={mutation.isLoading}
					/>
				</div>
			</form>
		</div>
	);
}

// Transaction Fee Modal Component
function TransactionFeeModal({
	transactionFee,
	onClose,
	onSuccess,
}: {
	transactionFee: TransactionFee | null;
	onClose: () => void;
	onSuccess: () => void;
}) {
	const currentToken = useSelector(selectCurrentToken);
	const [formData, setFormData] = useState<CreateTransactionFeeRequest>({
		transactionType: transactionFee?.transactionType || "CARD",
		transactionCategory: transactionFee?.transactionCategory || "PURCHASE",
		countryIsoCode: transactionFee?.countryIsoCode || "",
		currency: transactionFee?.currency || "",
		type: transactionFee?.type || "FIXED",
		value: transactionFee?.value || 0,
		description: transactionFee?.description || "",
	});

	const mutation = useMutation(
		(data: CreateTransactionFeeRequest | UpdateTransactionFeeRequest) => {
			if (transactionFee?.id) {
				return SettingsService.update_transaction_fee({
					token: currentToken,
					data: {
						...data,
						id: transactionFee.id,
					} as UpdateTransactionFeeRequest,
				});
			} else {
				return SettingsService.create_transaction_fee({
					token: currentToken,
					data: data as CreateTransactionFeeRequest,
				});
			}
		},
		{
			onSuccess: async (response) => {
				const responseJson = await response.json();
				if (!response.ok) {
					throw new Error(
						responseJson.message || "Failed to save transaction fee"
					);
				}
				toast.success(
					`Transaction fee ${
						transactionFee?.id ? "updated" : "created"
					} successfully!`
				);
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to save transaction fee");
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(formData);
	};

	const handleChange = (
		field: keyof CreateTransactionFeeRequest,
		value: any
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				{transactionFee?.id ? "Edit" : "Add"} Transaction Fee
			</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Transaction Type
						</label>
						<select
							value={formData.transactionType}
							onChange={(e) =>
								handleChange("transactionType", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="CARD">Card</option>
							<option value="TRANSFER">Transfer</option>
							<option value="WITHDRAWAL">Withdrawal</option>
							<option value="DEPOSIT">Deposit</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Transaction Category
						</label>
						<select
							value={formData.transactionCategory}
							onChange={(e) =>
								handleChange(
									"transactionCategory",
									e.target.value
								)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="PURCHASE">Purchase</option>
							<option value="ATM">ATM</option>
							<option value="ONLINE">Online</option>
							<option value="INTERNATIONAL">International</option>
						</select>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Country ISO Code
						</label>
						<input
							type="text"
							value={formData.countryIsoCode}
							onChange={(e) =>
								handleChange("countryIsoCode", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="US"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Currency
						</label>
						<input
							type="text"
							value={formData.currency}
							onChange={(e) =>
								handleChange("currency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="USD"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Fee Type
						</label>
						<select
							value={formData.type}
							onChange={(e) =>
								handleChange("type", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="FIXED">Fixed</option>
							<option value="PERCENTAGE">Percentage</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Value
						</label>
						<input
							type="number"
							step="0.01"
							value={formData.value}
							onChange={(e) =>
								handleChange(
									"value",
									parseFloat(e.target.value)
								)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="1.00"
							required
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Description
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							handleChange("description", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						placeholder="Transaction fee description"
						required
					/>
				</div>
				<div className="flex gap-3 justify-end pt-4">
					<CButton
						text="Cancel"
						btnStyle="outlineDark"
						onClick={onClose}
						type="button"
					/>
					<CButton
						text={mutation.isLoading ? "Saving..." : "Save"}
						btnStyle="blue"
						type="submit"
						disabled={mutation.isLoading}
					/>
				</div>
			</form>
		</div>
	);
}
