import Title from "@/components/shared/Title";
import cstyle from "../../styles/style.module.scss";
import { FaTimes, FaCreditCard } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import CButton from "@/components/shared/CButton";
import { selectCurrentToken } from "@/redux/slices/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { PuffLoader } from "react-spinners";

interface AddCardModalProps {
	setIsOpen?: (data?: any) => void;
}

const createCardSchema = z.object({
	brand: z.string(),
	amount: z.number(),
	name_on_card: z.string().min(1),
	customer_id: z.string().min(1),
});

const handleCreateCard = async (
	token: string,
	data: z.infer<typeof createCardSchema>
) => {
	const response = await CardService.create_card({
		token,
		data,
	});
	if (response.status === 504) {
		// Special handling for 504 Gateway Timeout
		throw new Error("504");
	}
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function AddCardModal({ setIsOpen }: AddCardModalProps) {
	const currentToken: any = useSelector(selectCurrentToken);
	const customerDetails = useSelector(selectCurrentCustomerDetails);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<z.infer<typeof createCardSchema>>({
		resolver: zodResolver(createCardSchema),
		defaultValues: {
			customer_id: `${customerDetails?.id}`,
			brand: "VISA",
			amount: 2,
			name_on_card: `${customerDetails?.first_name} ${customerDetails?.last_name}`,
		},
	});

	// Mutation for creating card
	const createCardMutation = useMutation({
		mutationFn: (data: any) => handleCreateCard(currentToken, data),
		onSuccess: () => {
			toast.success("Card created successfully!");
			setIsOpen && setIsOpen(false);

			// Reset form
			reset();

			// Refresh the page to show new card
			// window.location.reload();
		},
		onError: (error: any) => {
			console.error("Error creating card:", error);
			if (error.message === "504") {
				// Special handling for 504 Gateway Timeout
				toast.success("Card creation initiated");
				setIsOpen && setIsOpen(false);
				reset();
				window.location.reload();
			} else {
				toast.error(error.message || "Failed to create card");
			}
		},
	});

	const onSubmit = (data: any) => {
		const cardData = {
			customer_id: customerDetails?.id || "customer_id_here",
			brand: data.brand,
			amount: parseFloat(data.amount),
			name_on_card: data.name_on_card.trim(),
		};

		createCardMutation.mutate(cardData);
	};

	return (
		<div className="bg-white m-auto p-8 rounded-md w-md max-h-[90vh] overflow-y-auto">
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

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Cardholder Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Cardholder Name
					</label>
					<input
						type="text"
						{...register("name_on_card", {
							required: "Cardholder name is required",
						})}
						disabled
						placeholder="Enter cardholder name"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.name_on_card && (
						<p className="text-red-500 text-sm mt-1">
							{errors.name_on_card.message}
						</p>
					)}
				</div>
				{/* Card Brand */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Card Brand
					</label>
					<select
						{...register("brand", {
							required: "Please select a card brand",
						})}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="VISA">VISA</option>
						<option value="MASTERCARD">MASTERCARD</option>
					</select>
					{errors.brand && (
						<p className="text-red-500 text-sm mt-1">
							{errors.brand.message}
						</p>
					)}
				</div>

				{/* Initial Amount */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Initial Balance (USD)
					</label>
					<input
						type="number"
						{...register("amount", {
							required: "Please enter a valid amount",
							min: {
								value: 1,
								message: "Amount must be at least 1",
							},
							valueAsNumber: true,
						})}
						placeholder="0.00"
						min="2"
						// step="0.01"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{errors.amount && (
						<p className="text-red-500 text-sm mt-1">
							{errors.amount.message}
						</p>
					)}
				</div>

				{/* Submit Button */}
				<div className="flex flex-col gap-3 pt-4">
					<CButton
						text={
							createCardMutation.isLoading
								? "Creating..."
								: "Create Card"
						}
						btnStyle={"blue"}
						type={"submit"}
						disabled={createCardMutation.isLoading}
						// width={"150px"}
						height={"33px"}
					/>
					<CButton
						text={"Cancel"}
						btnStyle={"outlineDark"}
						onClick={() => setIsOpen && setIsOpen(false)}
						disabled={createCardMutation.isLoading}
						// width={"150px"}
						height={"33px"}
					/>
				</div>
			</form>

			<div
				className={classNames(
					"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
					{
						"!opacity-100 !visible z-[1000]":
							createCardMutation.isLoading,
					}
				)}
			>
				<PuffLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>

			{/* Card Preview */}
			{/* <div className="mt-6 p-4 bg-gray-50 rounded-lg">
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
			</div> */}
		</div>
	);
}
