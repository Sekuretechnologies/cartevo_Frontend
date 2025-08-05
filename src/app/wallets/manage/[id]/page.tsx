"use client";
import Layout from "@/components/shared/Layout";
import Cartes from "./components/Tabs/Cartes";
import Details from "./components/Tabs/Details";
import Transactions from "./components/Tabs/Transactions/Transactions";
import Transferts from "./components/Tabs/Transferts/Transferts";
import Notifications from "./components/Tabs/Notifications/Notifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { UserService } from "@/api/services/user";
import { useDispatch, useSelector } from "react-redux";
import { useTitle } from "@/hooks/useTitle";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import {
	setCurrentCustomerDetails,
	setCurrentCustomerTransactions,
	setCurrentCustomerTransfers,
} from "@/redux/slices/customer";
import Image from "next/image";
import URLConfig from "@/config/urls";
import { I18nProvider } from "@react-aria/i18n";
import { useRouter } from "next/navigation";
import { CustomerService } from "@/api/services/v2/customer";
import Filleuls from "./components/Tabs/Filleuls/Filleuls";

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
	useTitle("Sekure | Comptes utilisateurs", true);
	const { id } = useParams();
	const dispatch = useDispatch();
	const router = useRouter();

	const [searchTransactions, setSearchTransactions] = useState("");
	const [searchTransfers, setSearchTransfers] = useState("");
	const [searchNotifications, setSearchNotifications] = useState("");
	const [searchFilleuls, setSearchFilleuls] = useState("");

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
			title={"Details utilisateur V2"}
			// backLink={URLConfig.usersAccounts.root}
			goBack={() => router.back()} //urls.cards.manage
		>
			<I18nProvider locale="fr-FR">
				<Tabs defaultValue="Details" className="w-full">
					{userData ? (
						<div className="pl-5 flex gap-5 justify-center items-center pb-5">
							<div>
								<div
									style={{
										width:
											window.innerWidth > 800 ? 100 : 60,
										height:
											window.innerWidth > 800 ? 100 : 60,
										borderRadius: "50%",
										position: "relative",
										overflow: "hidden",
									}}
								>
									<Image
										alt="photo"
										src={
											userData?.customer?.profile_picture?.startsWith(
												"http"
											)
												? userData?.customer
														?.profile_picture
												: `https://ui-avatars.com/api/?size=250&name=${`${userData?.customer?.first_name} ${userData?.customer?.last_name}`
														?.toLowerCase()
														?.replace(
															/\s+/g,
															"+"
														)}&background=FFDB5A&color=18BC7A`
										}
										layout="fill"
										objectFit="cover"
									/>
								</div>
							</div>
							<div className="w-full py-5 ">
								<h1 className="text-xl text-gray-700 font-bold">{`${userData?.customer?.first_name} ${userData?.customer?.last_name}`}</h1>
								<p className="text-md text-gray-500">
									{userData?.customer?.email}
								</p>
								<p className="text-md text-gray-500">
									{userData?.customer?.phone}
								</p>
							</div>
						</div>
					) : (
						<></>
					)}

					<div className="border-b-0 md:border-b-1">
						<TabsList
							defaultValue={"Details"}
							className="TabsList grid grid-cols-2 md:flex mb-[120px] md:mb-0"
						>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Details"
							>
								Details
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Cartes"
							>
								Cartes
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Transactions"
							>
								Transactions
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Transferts"
							>
								Transferts
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Notifications"
							>
								Notifications
							</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="Filleuls"
							>
								Filleuls
							</TabsTrigger>
						</TabsList>
					</div>
					{oneUserQueryRes?.status === "loading" ? (
						<div className="flex justify-center w-full py-10">
							<div className={"loadingSpinner"}></div>
						</div>
					) : (
						<div className={`mt-5`}>
							<TabsContent value="Details">
								<Details />
							</TabsContent>
							<TabsContent value="Cartes">
								<Cartes />
							</TabsContent>
							<TabsContent value="Transactions">
								<Transactions
									search={searchTransactions}
									setSearch={setSearchTransactions}
								/>
							</TabsContent>
							<TabsContent value="Transferts">
								<Transferts
									search={searchTransfers}
									setSearch={setSearchTransfers}
								/>
							</TabsContent>
							<TabsContent value="Notifications">
								<Notifications
									search={searchNotifications}
									setSearch={setSearchNotifications}
								/>
							</TabsContent>
							<TabsContent value="Filleuls">
								<Filleuls
									search={searchFilleuls}
									setSearch={setSearchFilleuls}
								/>
							</TabsContent>
						</div>
					)}
				</Tabs>
			</I18nProvider>
		</Layout>
	);
}
