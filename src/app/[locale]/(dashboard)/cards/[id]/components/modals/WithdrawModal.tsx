"use client";
import { CardService } from "@/api/services/cartevo-api/card";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";

interface WithdrawModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	cardId: string;
	customerId: string;
}

interface WithdrawFormData {
	amount: string;
}

const handleWithdrawCard = async (
	token: string,
	data: WithdrawFormData,
	cardId: string,
	customerId: string
) => {
	const response = await CardService.withdraw_card({
		token,
		cardId,
		data: {
			amount: parseFloat(data.amount),
			customer_id: customerId,
			card_id: cardId,
		},
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message || "Failed to withdraw from card");
	}
	const responseJson = await response.json();
	return responseJson;
};

const WithdrawModal = ({
	isOpen,
	setIsOpen,
	cardId,
	customerId,
}: WithdrawModalProps) => {
	const token: any = useSelector(selectCurrentToken);

	const form = useForm<WithdrawFormData>({
		defaultValues: {
			amount: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: WithdrawFormData) =>
			handleWithdrawCard(token, data, cardId, customerId),
		onError: (err: any) => {
			console.error("Withdraw card submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Withdraw card submitted successfully:", data);
			toast.success("Money is successfully withdrawed from the card");
			setIsOpen(false);
			form.reset();
			window.location.reload();
		},
	});

	const onSubmit = (data: WithdrawFormData) => {
		mutation.mutate(data);
	};

	return (
		<div className="bg-white rounded-lg p-6  max-w-md md:w-[490px]  mx-auto">
			<h2 className="text-xl font-semibold mb-4">Withdraw from Card</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-4"
				>
					<FormField
						control={form.control}
						name="amount"
						rules={{
							required: "Amount is required",
							min: {
								value: 0.01,
								message: "Amount must be greater than 0",
							},
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amount (USD)</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder="Enter amount"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={mutation.isLoading}>
							{mutation.isLoading ? "Withdrawing..." : "Withdraw"}
						</Button>
					</div>
				</form>
			</Form>
			<LoadingOverlay isLoading={mutation.isLoading} />
		</div>
	);
};

export default WithdrawModal;
