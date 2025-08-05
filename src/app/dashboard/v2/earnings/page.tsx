"use client";

import Layout from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerService } from "@/api/services/v2/customer";
import { useTitle } from "@/hooks/useTitle";
import { usePathname, useRouter } from "next/navigation";
import { FaRegCreditCard, FaYenSign } from "react-icons/fa";
import { FaCreditCard, FaNairaSign } from "react-icons/fa6";
import {
	RiBankCard2Fill,
	RiBankCardFill,
	RiBankCardLine,
	RiHandCoinFill,
} from "react-icons/ri";
import {
	IoCardOutline,
	IoCardSharp,
	IoWallet,
	IoWalletOutline,
} from "react-icons/io5";
import {
	BsFillCreditCard2FrontFill,
	BsWallet2,
	BsWalletFill,
} from "react-icons/bs";
import { TransactionService } from "@/api/services/v2/transaction";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { getTransactionDailyPerCategoryTypeGraphData } from "@/utils/graphs";
import DataCard from "@/components/cards/DataCard/DataCard";

const getDailyCategoryTypeTransactions = async ({ queryKey }: any) => {
	const [_key, limitDate] = queryKey;
	let params: any = {};
	if (limitDate) params.limitDate = limitDate;

	const response = await TransactionService.get_all_fees_daily_stats(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get daily transactions"
		);
	}
	return responseJson.data;
};

export default function KYC() {
	useTitle("Sekure | ChinPay", true);
	const pathname = usePathname();
	const router = useRouter();

	const transactionDailyPerCategoryTypeQueryRes = useQuery({
		queryKey: ["transactionDailyPerCategoryType"],
		queryFn: getDailyCategoryTypeTransactions,
		onError: (err) => {
			toast.error("Une erreur est survenue:" + err);
		},
		refetchInterval: 35000, // Fetches data every 15 seconds
	});

	console.log(
		"transactionDailyPerCategoryType.data : ",
		transactionDailyPerCategoryTypeQueryRes.data
	);

	const paymentServices: any = [
		{
			title: "Frais de recharge de compte",
			slug: "wallet-topup-fee",
			icon: <BsWalletFill size={35} color="#1F66FF" />,
		},
		{
			title: "Frais de retrait de compte",
			slug: "wallet-withdrawal-fee",
			icon: <BsWallet2 size={35} color="#1F66FF" />,
		},
		{
			title: "Achat de carte",
			slug: "card-purchase",
			icon: <IoCardSharp size={35} color="#1F66FF" />,
		},
		{
			title: "Frais de recharge de carte",
			slug: "card-topup-fee",
			icon: <FaRegCreditCard size={35} color="#1F66FF" />,
		},
		{
			title: "Frais de retrait de carte",
			slug: "card-withdrawal-fee",
			icon: <IoCardOutline size={35} color="#1F66FF" />,
		},
		{
			title: "Frais de reception de paiement",
			slug: "wallet-receive-fee",
			icon: <RiHandCoinFill size={35} color="#1F66FF" />,
		},
		{
			title: "Tous les prélevements de frais de paiement par carte",
			slug: "all-card-payment_fee",
			icon: <BsFillCreditCard2FrontFill size={35} color="#1F66FF" />,
		},
		{
			title: "Prélevements de frais de paiement par carte",
			slug: "card-payment_fee",
			icon: <RiBankCard2Fill size={35} color="#1F66FF" />,
		},
		{
			title: "Prélevements dans la CARTE des frais de paiement ECHOUÉS",
			slug: "card-payment_fee_failed",
			icon: <RiBankCardLine size={35} color="#1F66FF" />,
		},
		{
			title: "Prélevements dans la CARTE des frais de paiement REUSSIS",
			slug: "card-payment_fee_success",
			icon: <RiBankCardFill size={35} color="#1F66FF" />,
		},
		{
			title: "Prélevements dans le WALLET des frais de paiement ECHOUÉS",
			slug: "wallet-payment_fee_failed",
			icon: <IoWalletOutline size={35} color="#1F66FF" />,
		},
		{
			title: "Prélevements dans le WALLET des frais de paiement REUSSIS",
			slug: "wallet-payment_fee_success",
			icon: <IoWallet size={35} color="#1F66FF" />,
		},
	];

	const handlePaymentServiceSelect = (payservice: any) => {
		router.push(`${pathname}/${payservice.slug}`);
	};

	return (
		<Layout title={"Gains"}>
			<>
				<section className="px-2">
					<Tabs defaultValue="02" className="w-full">
						<div className="border-b-1">
							<TabsList className="TabsList">
								<TabsTrigger
									className="TabsTrigger"
									value="01"
								>{`Categories`}</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="02"
								>{`Stats par jour`}</TabsTrigger>
							</TabsList>
						</div>
						<div className={`mt-5`}>
							<TabsContent value="01">
								<div className="pl-[30px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
									{paymentServices.map(
										(paymentService: any) => {
											return (
												<div
													key={paymentService.slug}
													onClick={() =>
														handlePaymentServiceSelect(
															paymentService
														)
													}
													className="flex flex-col justify-center items-center gap-3 w-[200px] cursor-pointer rounded-xl p-[10px] hover:bg-gray-100"
												>
													<div className="img-container bg-white border rounded-lg h-[120px] w-[120px] overflow-hidden flex justify-center items-center">
														{paymentService.icon}
													</div>
													<div className="text-md text-center w-full">
														{paymentService.title}
													</div>
												</div>
											);
										}
									)}
								</div>
							</TabsContent>
							<TabsContent value="02">
								<>
									{/* <div className='w-full my-[50px] border border-gray-800'/> */}
									{transactionDailyPerCategoryTypeQueryRes.status ===
									"loading" ? (
										<div className="flex w-full py-10 justify-center items-center">
											<div
												className={"loadingSpinner"}
											></div>
										</div>
									) : (
										<div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-col-5 w-full gap-5">
											{transactionDailyPerCategoryTypeQueryRes?.data &&
												Object.values(
													transactionDailyPerCategoryTypeQueryRes
														.data?.transactions
												)?.map(
													(item: any, index: any) => {
														const itemGraphData =
															getTransactionDailyPerCategoryTypeGraphData(
																item?.transactions ??
																	[],
																index
															);
														return (
															<div
																key={index}
																className={
																	index === 0
																		? ``
																		: ``
																}
															>
																<DataCard
																	title={
																		item?.title
																	}
																	change_per="24%"
																	chartData={
																		itemGraphData
																	}
																	mainData={
																		item?.transactions ??
																		[]
																	}
																	withDailyStats={
																		true
																	}
																	data={{
																		dailyStats:
																			item?.stats,
																	}}
																/>
															</div>
														);
													}
												)}
											{transactionDailyPerCategoryTypeQueryRes?.data && (
												<>
													{/* <div>
											<DataCard 
											  title={"Comptes créés"}
											  change_per="24%"
											  chartData={usersGraphData}
											  data={{
												today: `${usersData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												total: `${usersData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												average: `${usersData?.avgTotal?.avg ? Math.round(usersData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
											  }}
											/>
										  </div>
										  <div>
											<DataCard 
											  title={"Création de cartes"}
											  change_per="24%"
											  chartData={cardsGraphData}
											  data={{
												today: `${cardsData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												total: `${cardsData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												average: `${cardsData?.avgTotal?.avg ? Math.round(cardsData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
											  }}
											/>
										  </div>
										  <div>
											<DataCard 
											  title={"Recharges de cartes par jour"}
											  change_per="24%"
											  chartData={cardsTopUpsGraphData}
											  data={{
												today: `${cardsTopUpsData?.todayTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												total: `${cardsTopUpsData?.avgTotal?.total?.toLocaleString('fr-FR') ?? 0}`,
												average: `${cardsTopUpsData?.avgTotal?.avg ? Math.round(cardsTopUpsData?.avgTotal?.avg).toLocaleString('fr-FR') : 0}`,
											  }}
											/>
										  </div> */}
												</>
											)}
										</div>
									)}
								</>
							</TabsContent>
						</div>
					</Tabs>
				</section>
			</>
		</Layout>
	);
}
