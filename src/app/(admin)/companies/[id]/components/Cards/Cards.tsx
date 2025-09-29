"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import React from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getCardsByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getCardByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch cards");
	}

	return responseJson;
};
const Cards = () => {
	const currentToken: any = useSelector(selectCurrentToken);

	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const cardsQuery = useQuery({
		queryKey: ["users", selectedCompany.id, currentToken],
		queryFn: () =>
			getCardsByCompany({
				companyId: selectedCompany.id as string,
				token: currentToken as string,
			}),

		onError: (err: any) => {
			toast.error("Failed to get users");
		},
	});

	const cardsHeaderData = {
		serial: "#",
		name: "Nom",
		masked_number: "Numéro",
		status: "Statut",
		balance: "Solde",
		currency: "Devise",
		brand: "Marque",
		expiry: "Expiration",
	};

	const cardsTableData = cardsQuery.data?.cards?.map(
		(card: any, index: number) => ({
			serial: index + 1,
			name: card.name ?? "-",
			masked_number: card.masked_number ?? "-",
			status: card.status ?? "-",
			balance: card.balance ?? "-",
			currency: card.currency ?? "-",
			brand: card.brand ?? "-",
			expiry: `${card.expiry_month ?? "-"} / ${card.expiry_year ?? "-"}`,
		})
	);

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Cards List"} />

			<CustomTable
				headerData={cardsHeaderData}
				tableData={cardsTableData}
				isLoading={cardsQuery.isLoading || cardsQuery.isFetching}
			/>
		</div>
	);
};

export default Cards;
