import Title from "@/components/shared/Title";
import cstyle from "../../styles/style.module.scss";
import { FaTimes, FaCreditCard } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "react-query";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";

interface AddCardModalProps {
	setIsOpen?: (data?: any) => void;
}

export default function AddCardModal({ setIsOpen }: AddCardModalProps) {
	const [formData, setFormData] = useState({
		brand: "visa",
		amount: "",
		name: "",
	});

	const customerDetails = useSelector(selectCurrentCustomerDetails);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Mutation for creating card
	const createCardMutation = useMutation(
		async (cardData: any) => {
			const token = localStorage.getItem("sktoken");
			if (!token) {
				throw new Error("Authentication required");
			}

			return await CardService.create_card({
				token,
				data: cardData,
			});
		},
		{
			onSuccess: () => {
				toast.success("Card created successfully!");
				setIsOpen && setIsOpen(false);

				// Reset form
				setFormData({
					brand: "visa",
					amount: "",
					name: "",
				});

				// Refresh the page to show new card
				window.location.reload();
			},
			onError: (error: any) => {
				console.error("Error creating card:", error);
				toast.error(error.message || "Failed to create card");
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Cardholder name is required");
			return;
		}

		if (!formData.amount || parseFloat(formData.amount) <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}

		const cardData = {
			customer_id: customerDetails?.id || "customer_id_here",
			brand: formData.brand,
			amount: parseFloat(formData.amount),
			name: formData.name.trim(),
		};

		createCardMutation.mutate(cardData);
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md max-w-md w-full max-h-[90vh] overflow-y-auto">
			<div className="flex justify-between mb-6">
				<div className="flex items-center gap-3">
					<FaCreditCard className="text-blue-600" size={24} />
					<Title title={"Add New Card"} />
				</div>
				<div
					className="cursor-pointer hover:bg-gray-100 p-2 rounded-full"
					onClick={() => setIsOpen && setIsOpen(false)}
				>
					<FaTimes size={16} color={"#444"} />
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Card Brand */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Card Brand
					</label>
					<select
						name="brand"
						value={formData.brand}
						onChange={handleInputChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					>
						<option value="visa">Visa</option>
						<option value="mastercard">Mastercard</option>
					</select>
				</div>

				{/* Cardholder Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Cardholder Name
					</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						placeholder="Enter cardholder name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				{/* Initial Amount */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Initial Balance (USD)
					</label>
					<input
						type="number"
						name="amount"
						value={formData.amount}
						onChange={handleInputChange}
						placeholder="0.00"
						min="0"
						step="0.01"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						required
					/>
				</div>

				{/* Submit Button */}
				<div className="flex gap-3 pt-4">
					<button
						type="button"
						onClick={() => setIsOpen && setIsOpen(false)}
						className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
						disabled={createCardMutation.isLoading}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={createCardMutation.isLoading}
					>
						{createCardMutation.isLoading
							? "Creating..."
							: "Create Card"}
					</button>
				</div>
			</form>

			{/* Card Preview */}
			<div className="mt-6 p-4 bg-gray-50 rounded-lg">
				<h4 className="text-sm font-medium text-gray-700 mb-2">
					Preview
				</h4>
				<div className="bg-blue-600 text-white rounded-lg p-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-semibold">
							{formData.brand === "visa" ? "VISA" : "MASTERCARD"}
						</span>
						<span className="text-xs">
							{formData.brand === "visa"
								? "•••• •••• •••• 1234"
								: "•••• •••• •••• 5678"}
						</span>
					</div>
					<div className="text-sm">
						{formData.name || "CARDHOLDER NAME"}
					</div>
					<div className="text-xs mt-1">
						Balance: ${formData.amount || "0.00"}
					</div>
				</div>
			</div>
		</div>
	);
}
