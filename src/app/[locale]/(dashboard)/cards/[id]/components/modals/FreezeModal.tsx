"use client";
import { Button } from "@/components/ui/button";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";
import { FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useMutation } from "react-query";
import LoadingOverlay from "@/components/shared/LoadingOverlay";

interface FreezeModalProps {
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	cardId: string;
}

const handleFreezeCard = async (token: string, cardId: string) => {
	const response = await CardService.freeze_card({ token, cardId });
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message || "Failed to freeze card");
	}
	const responseJson = await response.json();
	return responseJson;
};

const FreezeModal = ({ isOpen, setIsOpen, cardId }: FreezeModalProps) => {
	const token: any = useSelector(selectCurrentToken);
	const mutation = useMutation({
		mutationFn: () => handleFreezeCard(token, cardId),
		onError: (err: any) => {
			console.error("Freeze card submission error:", err.message);
			toast.error(err.message);
		},
		onSuccess: (data: any) => {
			console.log("Freeze card submitted successfully:", data);
			toast.success(
				"Card is successfully frozen and temporarily unavailable for transactions"
			);
			setIsOpen(false);
			window.location.reload();
		},
	});

	const handleFreeze = () => {
		mutation.mutate();
	};

	return (
		<div className="bg-white rounded-lg p-6 w-full max-w-md">
			<div className="flex items-center gap-3 mb-4">
				<FaLock className="text-orange-500 text-xl" />
				<h2 className="text-xl font-semibold">Freeze Card</h2>
			</div>
			<p className="text-gray-600 mb-6">
				Are you sure you want to freeze this card? The card will be
				temporarily unavailable for transactions.
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
					onClick={handleFreeze}
					disabled={mutation.isLoading}
					className="bg-orange-500 hover:bg-orange-600"
				>
					{mutation.isLoading ? "Freezing..." : "Freeze Card"}
				</Button>
			</div>
			<LoadingOverlay isLoading={mutation.isLoading} />
		</div>
	);
};

export default FreezeModal;
