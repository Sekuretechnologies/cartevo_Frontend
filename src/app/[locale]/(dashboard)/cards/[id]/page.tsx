"use client";
import { CardService } from "@/api/services/cartevo-api/card";
import Layout from "@/components/shared/Layout";
import { useTitle } from "@/hooks/useTitle";
import { useTranslation } from "@/hooks/useTranslation";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import { selectCurrentToken } from "@/redux/slices/auth";
import { setCardTransactions, setCurrentCard } from "@/redux/slices/card";
import CardDetails from "./components/CardDetails";
import Transactions from "./components/Transactions/Transactions";

const getCardDetails = async ({ queryKey }: any) => {
	const [_key, token, cardId] = queryKey;
	if (!token) {
		throw new Error("No authentication token found");
	}
	const response = await CardService.get_card({
		token,
		cardId,
		reveal: true,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get card " + cardId);
	}
	return responseJson;
};

const getCardTransactions = async ({ queryKey }: any) => {
	const [_key, token, cardId] = queryKey;
	if (!token) {
		throw new Error("No authentication token found");
	}
	const response = await CardService.get_card_transactions({
		token,
		cardId,
		page: 1,
		limit: 20,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get card transactions " + cardId
		);
	}
	return responseJson;
};

export default function ManageCard() {
	const { t }: { t: any } = useTranslation();
	useTitle(t.cards.details.pageTitle, true);
	const currentToken: any = useSelector(selectCurrentToken);
	const { id } = useParams();
	// const id = "2bfc06e5-195e-4482-b728-9b84a5a45af4";
	const dispatch = useDispatch();
	const router = useRouter();

	const [searchCards, setSearchCards] = useState("");
	const [searchTransactions, setSearchTransactions] = useState("");

	const cardDetailsQueryRes: any = useQuery({
		queryKey: ["cardDetails", currentToken, id],
		queryFn: getCardDetails,
		onError: (err) => {
			toast.error(t.cards.details.failedToGetCard + " : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});

	const cardTransactionsQueryRes: any = useQuery({
		queryKey: ["cardTransactions", currentToken, id],
		queryFn: getCardTransactions,
		onError: (err) => {
			toast.error(
				t.cards.details.failedToGetCardTransactions + " : " + id
			);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});

	let cardData: any = null;

	// Update Redux store when card details change
	// useEffect(() => {
	// 	if (cardDetailsQueryRes.data?.card) {
	cardData = cardDetailsQueryRes.data?.card;
	dispatch(setCurrentCard(cardDetailsQueryRes.data?.card));
	// 	}
	// }, [cardDetailsQueryRes, dispatch]);

	// Update Redux store when card transactions change
	// useEffect(() => {
	// 	if (cardTransactionsQueryRes?.transactions) {
	dispatch(setCardTransactions(cardTransactionsQueryRes.data?.transactions));
	// }
	// }, [cardTransactionsQueryRes, dispatch]);

	console.log(
		"cardDetailsQueryRes.data?.card : ",
		cardDetailsQueryRes.data?.card
	);

	console.log(
		"cardTransactionsQueryRes.data?.transactions : ",
		cardTransactionsQueryRes.data?.transactions
	);
	const transactionsData = cardTransactionsQueryRes.data?.transactions;

	return (
		<Layout
			title={t.cards.details.mainTitle}
			// backLink={URLConfig.usersAccounts.root}
			// goBack={() => router.back()} //urls.cards.manage
		>
			<div className="relative flex gap-5">
				<div className="col-span-3 min-w-[350px] max-w-[380px]">
					<div className="flex flex-col px-3 py-4 bg-white rounded-lg shadow-md">
						{cardData ? (
							<CardDetails />
						) : (
							<div className="flex justify-center w-full py-10">
								<div className={"loadingSpinner"}></div>
							</div>
						)}
					</div>
				</div>
				<div className="grid grid-cols-1 min-w-[400px]">
					<div className="px-0 py-4 bg-white rounded-lg shadow-md">
						{transactionsData ? (
							<Transactions
								search={searchTransactions}
								setSearch={setSearchTransactions}
							/>
						) : (
							<div className="flex justify-center w-full py-10">
								<div className={"loadingSpinner"}></div>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}
