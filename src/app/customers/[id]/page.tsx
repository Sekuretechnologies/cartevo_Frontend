"use client";
import { CustomerService } from "@/api/services/cartevo-api/customer";
import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTitle } from "@/hooks/useTitle";
import {
	setCurrentCustomerCards,
	setCurrentCustomerDetails,
	setCurrentCustomerTransactions,
	setCurrentCustomerTransfers,
} from "@/redux/slices/customer";
import { I18nProvider } from "@react-aria/i18n";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import Cards from "./components/Tabs/Cards/Cards";
import Transactions from "./components/Tabs/Transactions/Transactions";
import UserDetails from "./components/UserDetails";
import { selectCurrentToken } from "@/redux/slices/auth";

const getCustomer = async ({ queryKey }: any) => {
	const [_key, token, id] = queryKey;

	const response = await CustomerService.get_customer({
		token,
		customerId: id,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get user " + id);
	}
	return responseJson.data;
};

const getCustomerTransactions = async ({ queryKey }: any) => {
	const [_key, token, id, page = 1, limit = 20] = queryKey;

	const response = await CustomerService.get_customer_transactions({
		token,
		customerId: id,
		page,
		limit,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get user transactions" + id
		);
	}
	return responseJson.data;
};

const getCustomerCards = async ({ queryKey }: any) => {
	const [_key, token, id, page = 1, limit = 20] = queryKey;

	const response = await CustomerService.get_customer_cards({
		token,
		customerId: id,
		page,
		limit,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get user cards" + id
		);
	}
	return responseJson.data;
};

export default function ManageUserAccount() {
	useTitle("Cartevo | Customer", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const { id } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();

	const [searchCards, setSearchCards] = useState("");
	const [searchTransactions, setSearchTransactions] = useState("");

	const oneUserQueryRes = useQuery({
		queryKey: ["oneCustomer", currentToken, id],
		queryFn: getCustomer,
		onError: (err) => {
			toast.error("Failed to get user : " + id);
		},
		// enabled: false,
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		// refetchOnMount: false,
		// staleTime: Infinity,
		refetchInterval: 300000, // Fetches data every 300 seconds / 5 mins - Disabled
	});
	dispatch(setCurrentCustomerDetails(oneUserQueryRes.data));
	console.log("userQueryRes.data : ", oneUserQueryRes.data);
	const userData = oneUserQueryRes.data;
	//------------------------------------------------
	const customerTransactionsQueryRes = useQuery({
		queryKey: ["oneCustomerTransactions", currentToken, id],
		queryFn: getCustomerTransactions,
		onError: (err) => {
			toast.error("Failed to get user Transactions : " + id);
		},
		// enabled: false,
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		// refetchOnMount: false,
		// staleTime: Infinity,
		refetchInterval: 300000, // Fetches data every 300 seconds / 5 mins - Disabled
	});
	dispatch(setCurrentCustomerTransactions(customerTransactionsQueryRes.data));
	console.log(
		"customerTransactionsQueryRes.data : ",
		customerTransactionsQueryRes.data
	);
	const customerTransactionsData = customerTransactionsQueryRes.data;
	//------------------------------------------------
	const customerCardsQueryRes = useQuery({
		queryKey: ["oneCustomerCards", currentToken, id],
		queryFn: getCustomerCards,
		onError: (err) => {
			toast.error("Failed to get user Cards : " + id);
		},
		// enabled: false,
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		// refetchOnMount: false,
		// staleTime: Infinity,
		refetchInterval: 300000, // Fetches data every 300 seconds / 5 mins - Disabled
	});
	dispatch(setCurrentCustomerCards(customerCardsQueryRes.data));
	console.log("customerCardsQueryRes.data : ", customerCardsQueryRes.data);
	const customerCardsData = customerCardsQueryRes.data;

	return (
		<Layout
			title={"Customer details"}
			// backLink={URLConfig.usersAccounts.root}
			// goBack={() => router.back()} //urls.cards.manage
		>
			<div className="grid grid-cols-12 gap-5">
				<div className="col-span-3">
					<div className="flex flex-col px-3 py-4 bg-white rounded-lg shadow-md">
						{userData ? (
							<UserDetails />
						) : (
							<div className="flex justify-center w-full py-10">
								<div className={"loadingSpinner"}></div>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-9">
					<div className="px-5 py-4 bg-white rounded-lg shadow-md">
						<I18nProvider locale="fr-FR">
							<Tabs defaultValue="Cards" className="w-full">
								<div className="w-fit">
									<TabsList
										defaultValue={"Cards"}
										className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
									>
										<TabsTrigger
											className="TabsTrigger"
											value="Cards"
										>
											<span className="px-10 py-4 border-1 rounded-full">
												Cards
											</span>
										</TabsTrigger>
										<TabsTrigger
											className="TabsTrigger"
											value="Transactions"
										>
											<span className="px-10 py-4 border-1 rounded-full">
												Transactions
											</span>
										</TabsTrigger>
									</TabsList>
								</div>
								{oneUserQueryRes?.status === "loading" ? (
									<div className="flex justify-center w-full py-10">
										<div className={"loadingSpinner"}></div>
									</div>
								) : (
									<div className={`mt-5`}>
										<TabsContent value="Cards">
											{/* {"Cards"} */}
											<Cards
												search={searchCards}
												setSearch={setSearchCards}
											/>
										</TabsContent>
										<TabsContent value="Transactions">
											<Transactions
												search={searchTransactions}
												setSearch={
													setSearchTransactions
												}
											/>
										</TabsContent>
									</div>
								)}
							</Tabs>
						</I18nProvider>
					</div>
				</div>
			</div>
		</Layout>
	);
}
