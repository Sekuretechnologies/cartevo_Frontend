"use client";
import { CardService } from "@/api/services/cartevo-api/card";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/useTitle";
import {
	setCurrentCustomerDetails,
	setCurrentCustomerTransactions,
	setCurrentCustomerTransfers,
} from "@/redux/slices/customer";
import { I18nProvider } from "@react-aria/i18n";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import Cards from "./components/Tabs/Cards/Cards";
import Transactions from "./components/Tabs/Transactions/Transactions";
import CardDetails from "./components/CardDetails";

const getCardDetails = async ({ queryKey }: any) => {
	const [_key, cardId] = queryKey;
	const token = localStorage.getItem("sktoken");

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
	return responseJson.data;
};

const getCardTransactions = async ({ queryKey }: any) => {
	const [_key, cardId] = queryKey;
	const token = localStorage.getItem("sktoken");

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
	return responseJson.data;
};

export default function ManageUserAccount() {
	useTitle("Cartevo | Customer", true);
	const { id } = useParams();
	// const id = "2bfc06e5-195e-4482-b728-9b84a5a45af4";
	const dispatch = useDispatch();
	const router = useRouter();

	const [searchCards, setSearchCards] = useState("");
	const [searchTransactions, setSearchTransactions] = useState("");

	const cardDetailsQueryRes = useQuery({
		queryKey: ["cardDetails", id],
		queryFn: getCardDetails,
		onError: (err) => {
			toast.error("Failed to get card : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(
		setCurrentCustomerDetails({
			cards: { data: [cardDetailsQueryRes.data] },
		})
	);
	console.log("cardDetailsQueryRes.data : ", cardDetailsQueryRes.data);
	const userData = cardDetailsQueryRes.data;
	//------------------------------------------------
	const cardTransactionsQueryRes = useQuery({
		queryKey: ["cardTransactions", id],
		queryFn: getCardTransactions,
		onError: (err) => {
			toast.error("Failed to get card Transactions : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(
		setCurrentCustomerTransactions({
			transactions: { data: cardTransactionsQueryRes.data },
		})
	);
	console.log(
		"cardTransactionsQueryRes.data : ",
		cardTransactionsQueryRes.data
	);
	const userTransactionsData = cardTransactionsQueryRes.data;

	return (
		<Layout
			title={"Card details"}
			// backLink={URLConfig.usersAccounts.root}
			// goBack={() => router.back()} //urls.cards.manage
		>
			<div className="grid grid-cols-12 gap-5">
				<div className="col-span-3">
					<div className="flex flex-col px-3 py-4 bg-white rounded-lg shadow-md">
						{userData ? (
							<CardDetails />
						) : (
							<div className="flex justify-center w-full py-10">
								<div className={"loadingSpinner"}></div>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-9">
					<div className="px-5 py-4 bg-white rounded-lg shadow-md">
						<Transactions
							search={searchTransactions}
							setSearch={setSearchTransactions}
						/>
					</div>
				</div>
			</div>
		</Layout>
	);
}
