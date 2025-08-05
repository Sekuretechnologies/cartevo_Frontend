"use client";

import { BeninService } from "@/api/services/benin";
import { GabonService } from "@/api/services/gabon";
import { useTitle } from "@/hooks/useTitle";
import { selectCurrentGetSekureApiToken } from "@/redux/slices/auth";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getGabonBalance = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	if (token) {
		const response = await GabonService.get_gabon_balance_intouch({
			token,
		});
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get Gabon Balance"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No token provided" } };
	}
};

const getBeninBalance = async ({ queryKey }: any) => {
	const [_key, trxId] = queryKey;
	if (trxId) {
		const response = await BeninService.get_benin_payout_status({ trxId });
		const responseJson = await response.json();
		if (!response.ok) {
			throw new Error(
				responseJson.message || "Failed to get_benin_payout_status"
			);
		}
		return responseJson.data;
	} else {
		return { data: { message: "No trxId provided" } };
	}
};

export default function CheckBJPayoutStatus({
	trxId,
	trxStatus,
	setTrxStatus,
}: {
	trxId: string;
	trxStatus?: string;
	setTrxStatus: (data?: any) => void;
}) {
	const beninBalanceQueryRes = useQuery({
		queryKey: ["benin", trxId],
		queryFn: getBeninBalance,
		onError: (err) => {
			toast.error("Failed to get Benin balance.");
		},
		// enabled: false,
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	console.log("beninBalanceQueryRes.data : ", beninBalanceQueryRes.data);

	if (beninBalanceQueryRes?.data?.status === "SUCCESS") {
		setTrxStatus("success");
	} else if (beninBalanceQueryRes?.data?.status === "FAILED") {
		setTrxStatus("failed");
	}

	useTitle("Sekure | Accueil", true);
	return (
		<div className="flex flex-col justify-center items-center my-[30px] w-full">
			<div className="text-xl font-bold text-gray-900">
				Payout pending
			</div>
			<div className={"loadingSpinner"}></div>
		</div>
	);
}
