import { SettingsService } from "@/api/services/cartevo-api/settings";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import {
	CreateExchangeRateRequest,
	ExchangeRate,
	UpdateExchangeRateRequest,
} from "@/types/settings";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

const getExchangeRates = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;

	const response = await SettingsService.get_exchange_rates({ token });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get exchange rates");
	}
	return responseJson.data;
};

const ExchangeRateComponents = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const queryClient = useQueryClient();

	const [isExchangeRateModalOpen, setIsExchangeRateModalOpen] =
		useState(false);
	const [editingExchangeRate, setEditingExchangeRate] =
		useState<ExchangeRate | null>(null);

	const exchangeRatesQuery = useQuery({
		queryKey: ["exchangeRates", currentToken],
		queryFn: getExchangeRates,
		onError: (err) => {
			toast.error("Failed to get exchange rates.");
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

	const handleEditExchangeRate = (rate: ExchangeRate) => {
		setEditingExchangeRate(rate);
		setIsExchangeRateModalOpen(true);
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
	return (
		<div className=" p-5">
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
				btn={
					<CButton
						text="Add Exchange Rate"
						btnStyle="blue"
						icon={<HiPlus />}
						onClick={() => {
							setEditingExchangeRate(null);
							setIsExchangeRateModalOpen(true);
						}}
						height="33px"
					/>
				}
			/>
		</div>
	);
};

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

export default ExchangeRateComponents;
