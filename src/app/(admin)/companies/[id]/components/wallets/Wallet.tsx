"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getWalletsByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getWalletsByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch wallets");
	}

	return responseJson;
};

const Wallet = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const walletQuery = useQuery({
		queryKey: ["users", selectedCompany.id, currentToken],
		queryFn: () =>
			getWalletsByCompany({
				companyId: selectedCompany.id,
				token: currentToken,
			}),

		onError: (err: any) => {
			toast.error("Failed to get wallets");
		},
	});

	return <div>Wallet</div>;
};

export default Wallet;
