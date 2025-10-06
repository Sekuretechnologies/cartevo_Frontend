"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import { filter } from "lodash";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getCardsByCompany = async ({ queryKey }: any) => {
	const [_key, token, companyId, filterContent] = queryKey;

	const response = await AdminService.getCardByCompany({
		token,
		companyId,
		filters: filterContent,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch cards");
	}

	return data;
};

const Cards = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const [filterContent, setFilterContent] = useState<any>({});
	console.log("filter content", filterContent);

	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const cardsQuery = useQuery({
		queryKey: ["cards", currentToken, selectedCompany.id, filterContent],
		queryFn: getCardsByCompany,
		onError: (err: any) => {
			toast.error("Failed to get cards");
		},
	});

	useEffect(() => {
		console.log("filter content", filterContent);
	}, [cardsQuery.data]);

	const cardsHeaderData = {
		serial: "#",
		name: "Name",
		masked_number: "Number",
		status: "Status",
		balance: "Balance",
		currency: "Currency",
		brand: "Brand",
		expiry: "Expiration",
		actions: "Actions",
	};

	const cardsTableData = cardsQuery.data?.cards?.map(
		(card: any, index: number) => ({
			serial: index + 1,
			name: card.name ?? "-",
			masked_number: card.masked_number ?? "-",
			status: (
				<span
					className={
						card.status === "ACTIVE"
							? "px-2 py-1 rounded-full text-green-700 bg-green-100"
							: card.status === "FROZEN"
							? "px-2 py-1 rounded-full text-blue-700 bg-blue-100"
							: card.status === "TERMINATED"
							? "px-2 py-1 rounded-full text-red-700 bg-red-100"
							: "px-2 py-1 rounded-full text-gray-700 bg-gray-100"
					}
				>
					{card.status ?? "-"}
				</span>
			),
			balance: card.balance ?? "-",
			currency: card.currency ?? "-",
			brand: card.brand ?? "-",
			expiry: `${card.expiry_month ?? "-"} / ${card.expiry_year ?? "-"}`,
			actions: (
				<button
					className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
					onClick={() => {
						// Redirection vers la page de détails
						window.location.href = `/fr/cards/${card.id}`;
					}}
				>
					Details
				</button>
			),
		})
	);

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Cards List"} />

			<CustomTable
				headerData={cardsHeaderData}
				tableData={cardsTableData}
				isLoading={cardsQuery.isLoading || cardsQuery.isFetching}
				filter
				filterType={"cards"}
				filterContent={filterContent}
				setFilterContent={setFilterContent}
			/>
		</div>
	);
};

export default Cards;
