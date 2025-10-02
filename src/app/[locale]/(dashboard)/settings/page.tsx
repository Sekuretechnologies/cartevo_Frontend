"use client";
import { useTitle } from "@/hooks/useTitle";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "react-query";

import CButton from "@/components/shared/CButton";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";
import CustomTable from "@/components/shared/CustomTable";
import BadgeLabel from "@/components/shared/BadgeLabel";
import * as TabsPrimitive from "@radix-ui/react-tabs";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Cards from "../customers/[id]/components/Tabs/Cards/Cards";
import TeamMember from "./components/Team-members/teamMember";
import ExchangeRateComponents from "./components/exchange-rates/exchangeRate";
import TransactionFees from "./components/transaction-fees/transactionFees";

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
	const { t }: { t: any } = useTranslation();
	useTitle(t.settings.pageTitle, true);
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
			toast.error(t.settings.exchangeRates.messages.failedToGetExchangeRates);
		},
	});

	const transactionFeesQuery = useQuery({
		queryKey: ["transactionFees", currentToken],
		queryFn: getTransactionFees,
		onError: (err) => {
			toast.error(t.settings.transactionFees.messages.failedToGetTransactionFees);
		},
	});

	const deleteExchangeRateMutation = useMutation(
		(id: string) =>
			SettingsService.delete_exchange_rate({ token: currentToken, id }),
		{
			onSuccess: () => {
				toast.success(t.settings.exchangeRates.messages.exchangeRateDeletedSuccess);
				queryClient.invalidateQueries(["exchangeRates"]);
			},
			onError: (error: any) => {
				toast.error(t.settings.exchangeRates.messages.failedToDeleteExchangeRate);
			},
		}
	);

	const deleteTransactionFeeMutation = useMutation(
		(id: string) =>
			SettingsService.delete_transaction_fee({ token: currentToken, id }),
		{
			onSuccess: () => {
				toast.success(t.settings.transactionFees.messages.transactionFeeDeletedSuccess);
				queryClient.invalidateQueries(["transactionFees"]);
			},
			onError: (error: any) => {
				toast.error(t.settings.transactionFees.messages.failedToDeleteTransactionFee);
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
				t.settings.messages.areYouSureDeleteExchangeRate
			)
		) {
			deleteExchangeRateMutation.mutate(id);
		}
	};

	const handleDeleteTransactionFee = (id: string) => {
		if (
			window.confirm(
				t.settings.transactionFees.messages.areYouSureDeleteTransactionFee
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
		serial: t.settings.exchangeRates.table.serial,
		fromCurrency: t.settings.exchangeRates.table.from,
		toCurrency: t.settings.exchangeRates.table.to,
		rate: t.settings.exchangeRates.table.rate,
		// source: "Source",
		// status: "Status",
		description: t.settings.exchangeRates.table.description,
		// date: "Created",
		// actions: "Actions",
	};

	const transactionFeesHeaderData = {
		serial: t.settings.transactionFees.table.serial,
		// type: "Type",
		// category: "Category",
		// country: "Country",
		// currency: "Currency",
		// feeType: "Fee Type",
		description: t.settings.transactionFees.table.description,
		value: t.settings.transactionFees.table.value,
		// date: "Created",
		// actions: "Actions",
	};

	return (
		<Layout title={t.settings.mainTitle}>
			<section className="mt-2 space-y-8">
				<div className="bg-white shadow-md rounded-xl py-5">
					<Tabs defaultValue="teamMembers" className="w-full">
						<div className="w-fit">
							<TabsList
								defaultValue={"teamMembers"}
								className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
							>
								<TabsTrigger
									className="TabsTrigger"
									value="teamMembers"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										{t.settings.tabs.teamMembers}
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="exchangeRates"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										{t.settings.tabs.exchangeRates}
									</span>
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger"
									value="transactionFees"
								>
									<span className="px-10 py-4 border-1 rounded-full">
										{t.settings.tabs.transactionFees}
									</span>
								</TabsTrigger>
							</TabsList>
						</div>
						<div>
							<TabsContent value="teamMembers">
								<TeamMember />
							</TabsContent>
							<TabsContent value="exchangeRates">
								<ExchangeRateComponents />
							</TabsContent>
							<TabsContent value="transactionFees">
								<TransactionFees />
							</TabsContent>
						</div>
					</Tabs>
				</div>
				{/* 
				<div className=" flex gap-8  ">
					<button
						className="border-1 border-black rounded-full px-4 py-2"
						onClick={showTeamMembers}
					>
						Team members
					</button>
					<button
						onClick={showExchangesRates}
						className="border-2 px-4 py-2 rounded-full text-black/60 border-black/30"
					>
						Exchange Rates
					</button>
					<button
						onClick={showTransactionFees}
						className="border-2 px-4 py-2 rounded-full text-black/60 border-black/30"
					>
						Transaction Fees
					</button>
				</div> */}
				{/* Exchange Rates Section */}
				{/* {exchangeRatesactive && (
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
				)} */}

				{/* Transaction Fees Section */}
				{/* {transactionFeesActive && (
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
				)} */}

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
							t={t}
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
							t={t}
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
	t,
}: {
	exchangeRate: ExchangeRate | null;
	onClose: () => void;
	onSuccess: () => void;
	t: any;
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
					exchangeRate?.id 
						? t.settings.exchangeRates.modal.exchangeRateUpdatedSuccess
						: t.settings.exchangeRates.modal.exchangeRateCreatedSuccess
				);
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error.message || t.settings.exchangeRates.modal.failedToSaveExchangeRate);
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
				{exchangeRate?.id ? t.settings.exchangeRates.modal.editTitle : t.settings.exchangeRates.modal.addTitle}
			</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.exchangeRates.modal.fromCurrency}
						</label>
						<input
							type="text"
							value={formData.fromCurrency}
							onChange={(e) =>
								handleChange("fromCurrency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={t.settings.exchangeRates.modal.fromCurrencyPlaceholder}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.exchangeRates.modal.toCurrency}
						</label>
						<input
							type="text"
							value={formData.toCurrency}
							onChange={(e) =>
								handleChange("toCurrency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={t.settings.exchangeRates.modal.toCurrencyPlaceholder}
							required
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.settings.exchangeRates.modal.rate}
					</label>
					<input
						type="number"
						step="0.01"
						value={formData.rate}
						onChange={(e) =>
							handleChange("rate", parseFloat(e.target.value))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={t.settings.exchangeRates.modal.ratePlaceholder}
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.settings.exchangeRates.modal.source}
					</label>
					<select
						value={formData.source}
						onChange={(e) => handleChange("source", e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="DEFAULT">{t.settings.exchangeRates.modal.sourceOptions.default}</option>
						<option value="MANUAL">{t.settings.exchangeRates.modal.sourceOptions.manual}</option>
						<option value="API">{t.settings.exchangeRates.modal.sourceOptions.api}</option>
					</select>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.settings.exchangeRates.modal.description}
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							handleChange("description", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						placeholder={t.settings.exchangeRates.modal.descriptionPlaceholder}
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
						<span className="text-sm text-gray-700">{t.settings.exchangeRates.modal.active}</span>
					</label>
				</div>
				<div className="flex gap-3 justify-end pt-4">
					<CButton
						text={t.settings.exchangeRates.modal.cancel}
						btnStyle="outlineDark"
						onClick={onClose}
						type="button"
					/>
					<CButton
						text={mutation.isLoading ? t.settings.exchangeRates.modal.saving : t.settings.exchangeRates.modal.save}
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
	t,
}: {
	transactionFee: TransactionFee | null;
	onClose: () => void;
	onSuccess: () => void;
	t: any;
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
					transactionFee?.id 
						? t.settings.transactionFees.modal.transactionFeeUpdatedSuccess
						: t.settings.transactionFees.modal.transactionFeeCreatedSuccess
				);
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error.message || t.settings.transactionFees.modal.failedToSaveTransactionFee);
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
				{transactionFee?.id ? t.settings.transactionFees.modal.editTitle : t.settings.transactionFees.modal.addTitle}
			</h3>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.transactionType}
						</label>
						<select
							value={formData.transactionType}
							onChange={(e) =>
								handleChange("transactionType", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="CARD">{t.settings.transactionFees.modal.transactionTypeOptions.card}</option>
							<option value="TRANSFER">{t.settings.transactionFees.modal.transactionTypeOptions.transfer}</option>
							<option value="WITHDRAWAL">{t.settings.transactionFees.modal.transactionTypeOptions.withdrawal}</option>
							<option value="DEPOSIT">{t.settings.transactionFees.modal.transactionTypeOptions.deposit}</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.transactionCategory}
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
							<option value="PURCHASE">{t.settings.transactionFees.modal.transactionCategoryOptions.purchase}</option>
							<option value="ATM">{t.settings.transactionFees.modal.transactionCategoryOptions.atm}</option>
							<option value="ONLINE">{t.settings.transactionFees.modal.transactionCategoryOptions.online}</option>
							<option value="INTERNATIONAL">{t.settings.transactionFees.modal.transactionCategoryOptions.international}</option>
						</select>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.countryIsoCode}
						</label>
						<input
							type="text"
							value={formData.countryIsoCode}
							onChange={(e) =>
								handleChange("countryIsoCode", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={t.settings.transactionFees.modal.countryIsoCodePlaceholder}
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.currency}
						</label>
						<input
							type="text"
							value={formData.currency}
							onChange={(e) =>
								handleChange("currency", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={t.settings.transactionFees.modal.currencyPlaceholder}
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.feeType}
						</label>
						<select
							value={formData.type}
							onChange={(e) =>
								handleChange("type", e.target.value)
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="FIXED">{t.settings.transactionFees.modal.feeTypeOptions.fixed}</option>
							<option value="PERCENTAGE">{t.settings.transactionFees.modal.feeTypeOptions.percentage}</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{t.settings.transactionFees.modal.value}
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
							placeholder={t.settings.transactionFees.modal.valuePlaceholder}
							required
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						{t.settings.transactionFees.modal.description}
					</label>
					<textarea
						value={formData.description}
						onChange={(e) =>
							handleChange("description", e.target.value)
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						rows={3}
						placeholder={t.settings.transactionFees.modal.descriptionPlaceholder}
						required
					/>
				</div>
				<div className="flex gap-3 justify-end pt-4">
					<CButton
						text={t.settings.transactionFees.modal.cancel}
						btnStyle="outlineDark"
						onClick={onClose}
						type="button"
					/>
					<CButton
						text={mutation.isLoading ? t.settings.transactionFees.modal.saving : t.settings.transactionFees.modal.save}
						btnStyle="blue"
						type="submit"
						disabled={mutation.isLoading}
					/>
				</div>
			</form>
		</div>
	);
}
