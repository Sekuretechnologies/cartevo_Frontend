"use client";
import { CustomerService } from "@/api/services/v2/customer";
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
import UserDetails from "./components/UserDetails";

const getOneCustomer = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	// console.log("getCustomers searchTerm : ", st, queryKey);

	const response = await CustomerService.get_one_customer(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get user " + id);
	}
	return responseJson.data;
};

const getOneCustomerTransactions = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	// console.log("getCustomers searchTerm : ", st, queryKey);

	const response = await CustomerService.get_one_customer_transactions(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get user transactions" + id
		);
	}
	return responseJson.data;
};

const getOneCustomerTransfers = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	// console.log("getCustomers searchTerm : ", st, queryKey);

	const response = await CustomerService.get_one_customer_transfers(id);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get user transfers" + id
		);
	}
	return responseJson.data;
};

export default function ManageUserAccount() {
	useTitle("Cartevo | Customer", true);
	const { id } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();

	const [searchCards, setSearchCards] = useState("");
	const [searchTransactions, setSearchTransactions] = useState("");

	const oneUserQueryRes = useQuery({
		queryKey: ["oneUser", id],
		queryFn: getOneCustomer,
		onError: (err) => {
			toast.error("Failed to get user : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(setCurrentCustomerDetails(oneUserQueryRes.data));
	console.log("userQueryRes.data : ", oneUserQueryRes.data);
	const userData = oneUserQueryRes.data;
	//------------------------------------------------
	const oneUserTransactionsQueryRes = useQuery({
		queryKey: ["oneUserTransactions", id],
		queryFn: getOneCustomerTransactions,
		onError: (err) => {
			toast.error("Failed to get user Transactions : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(setCurrentCustomerTransactions(oneUserTransactionsQueryRes.data));
	console.log("userQueryRes.data : ", oneUserTransactionsQueryRes.data);
	const userTransactionsData = oneUserTransactionsQueryRes.data;
	//------------------------------------------------
	const oneUserTransfersQueryRes = useQuery({
		queryKey: ["oneUserTransfers", id],
		queryFn: getOneCustomerTransfers,
		onError: (err) => {
			toast.error("Failed to get user Transfers : " + id);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	dispatch(setCurrentCustomerTransfers(oneUserTransfersQueryRes.data));
	console.log("userQueryRes.data : ", oneUserTransfersQueryRes.data);
	const userTransfersData = oneUserTransfersQueryRes.data;

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
							<Tabs
								defaultValue="Transactions"
								className="w-full"
							>
								<div className="w-fit">
									<TabsList
										defaultValue={"Transactions"}
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
