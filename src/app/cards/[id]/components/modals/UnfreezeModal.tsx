"use client";
import { Button } from "@/components/ui/button";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";
import { FaLockOpen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useMutation } from "react-query";
import LoadingOverlay from "@/components/shared/LoadingOverlay";

interface UnfreezeModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	cardId: string;
}

const handleUnfreezeCard = async (token: string, cardId: string) => {
	const response = await CardService.unfreeze_card({ token, cardId });
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message || "Failed to unfreeze card");
	}
	const responseJson = await response.json();
	return responseJson;
};

const UnfreezeModal = ({ isOpen, setIsOpen, cardId }: UnfreezeModalProps) => {
	const token: any = useSelector(selectCurrentToken);
	const mutation = useMutation({
		mutationFn: () => handleUnfreezeCard(token, cardId),
		onError: (err: any) => {
			console.error("Unfreeze card submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Unfreeze card submitted successfully:", data);
			toast.success(
				"Card is successfully unfrozen and available for transactions"
			);
			setIsOpen(false);
			window.location.reload();
		},
	});

	const handleUnfreeze = () => {
		mutation.mutate();
	};

	return (
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<div className="flex items-center gap-3 mb-4">
				<FaLockOpen className="text-green-500 text-xl" />
				<h2 className="text-xl font-semibold">Unfreeze Card</h2>
			</div>
			<p className="text-gray-600 mb-6">
				Are you sure you want to unfreeze this card? The card will be
				available for transactions again.
			</p>
			<div className="flex gap-2 justify-end">
				<Button
					type="button"
					variant="outline"
					onClick={() => setIsOpen(false)}
				>
					Cancel
				</Button>
				<Button
					type="button"
					onClick={handleUnfreeze}
					disabled={mutation.isLoading}
					className="bg-green-500 hover:bg-green-600"
				>
					{mutation.isLoading ? "Unfreezing..." : "Unfreeze Card"}
				</Button>
			</div>
			<LoadingOverlay isLoading={mutation.isLoading} />
		</div>
	);
};

export default UnfreezeModal;
