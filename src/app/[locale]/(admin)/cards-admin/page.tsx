"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

const getCards = async ({ queryKey }: any) => {
	const [_key, token, filterContent] = queryKey;

	console.log("filtre envoyer au backend", filterContent);

	const response = await AdminService.getAllCards({
		token,
		filters: filterContent,
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || "Failed to fetch cards");
	}

	return data;
};

const CardsAdmin = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const [filterContent, setFilterContent] = useState<any>({});

	const cardsQuery = useQuery({
		queryKey: ["cards", currentToken, filterContent],
		queryFn: getCards,
		onError: () => {
			toast.error("Failed to get cards");
		},
	});

	const allCardsHeaderData = {
		serial: "#",
		name: "Cardholder",
		maskedNumber: "Card Number",
		status: "Status",
		balance: "Balance",
		currency: "Currency",
		brand: "Brand",
		expiry: "Expiry",
		city: "City",
		state: "State",
		country: "Country",
		provider: "Provider",
		isVirtual: "Virtual",
		actions: "Actions",
	};

	const allCardsTableData = cardsQuery.data?.cards?.map(
		(card: any, index: number) => ({
			serial: index + 1,
			name: card.name ?? "-",
			maskedNumber: card.masked_number ?? "-",
			status: (
				<span
					className={`px-2 py-1 rounded-full text-sm font-semibold ${
						card.status === "ACTIVE"
							? "bg-green-100 text-green-800"
							: card.status === "FROZEN"
							? "bg-blue-100 text-blue-800"
							: card.status === "TERMINATED"
							? "bg-gray-200 text-gray-700"
							: "bg-red-100 text-red-800"
					}`}
				>
					{card.status ?? "-"}
				</span>
			),
			balance: card.balance ?? "-",
			currency: card.currency ?? "-",
			brand: card.brand ?? "-",
			expiry: `${card.expiry_month ?? "-"} / ${card.expiry_year ?? "-"}`,
			city: card.city ?? "-",
			state: card.state_code ?? "-",
			country: card.country ?? "-",
			provider: atob(card.provider) ?? "-",
			isVirtual: card.is_virtual ? "Yes" : "No",
			actions: (
				<button
					className="px-2 py-1 bg-primary text-white text-sm rounded hover:bg-blue-600"
					onClick={() =>
						(window.location.href = `/fr/cards/${card.id}`)
					}
				>
					See more
				</button>
			),
		})
	);

	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Cards">
				<section>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={"Cards List"} />

						<CustomTable
							headerData={allCardsHeaderData}
							tableData={allCardsTableData}
							isLoading={
								cardsQuery.isLoading || cardsQuery.isFetching
							}
							filter
							filterType={"cards"}
							filterContent={filterContent}
							setFilterContent={setFilterContent}
						/>
					</div>
				</section>
			</Layout>
		</ProtectedRoute>
	);
};

export default CardsAdmin;
