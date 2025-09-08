import { SettingsService } from "@/api/services/cartevo-api/settings";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { selectCurrentToken } from "@/redux/slices/auth";
import {
	CreateTransactionFeeRequest,
	TransactionFee,
	UpdateTransactionFeeRequest,
} from "@/types/settings";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

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

const TransactionFees = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const queryClient = useQueryClient();

	const [editingTransactionFee, setEditingTransactionFee] =
		useState<TransactionFee | null>(null);

	const [isTransactionFeeModalOpen, setIsTransactionFeeModalOpen] =
		useState(false);

	const transactionFeesQuery = useQuery({
		queryKey: ["transactionFees", currentToken],
		queryFn: getTransactionFees,
		onError: (err) => {
			toast.error("Failed to get transaction fees.");
		},
	});

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

	const handleEditTransactionFee = (fee: TransactionFee) => {
		setEditingTransactionFee(fee);
		setIsTransactionFeeModalOpen(true);
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
		<div className=" p-5">
			<div className="mb-4">
				<h2 className="text-xl font-semibold text-gray-800">
					Transaction Fees
				</h2>
				<p className="text-gray-600 text-sm mt-1">
					Configure transaction fees for different payment types and
					countries
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
	);
};

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

export default TransactionFees;
