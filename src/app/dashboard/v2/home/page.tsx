"use client";

// import Category, { ICategory } from "@/components/cards/Category";
import CButton from "@/components/shared/CButton";
import DataCard from "@/components/cards/DataCard/DataCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from "@/components/charts/Doughnut";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Layout from "@/components/shared/Layout";
import LegendItem from "@/components/shared/LegendItem";
import Title from "@/components/shared/Title";
import {
	doughnutData,
	gradientData1,
	gradientData2,
	gradientData3,
	pieData,
	pieDataFour,
	pieDataThree,
	pieDataTwo,
} from "@/constants/graphData";
import { IoChatbubble } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FourDots } from "@/components/shared/icons";
import { FaChevronRight } from "react-icons/fa";
import ChartLabelBox from "@/components/shared/ChartLabelBox";
import PieChart from "@/components/charts/pieChart/PieChart";
import CustomTable from "@/components/shared/CustomTable";
import {
	headerHomeUserAccountData as headerData,
	tableHomeUserAccountData as tableData,
} from "@/constants/Index";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import { useTitle } from "@/hooks/useTitle";
import { useMutation, useQuery } from "react-query";

import toast from "react-hot-toast";
import { getFormattedDate, getFormattedDateTime } from "@/utils/DateFormat";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTransactionPeriod, setPeriod } from "@/redux/slices/transaction";
import { selectLimitDate, selectStartDate } from "@/redux/slices_v2/settings";
import {
	getGraphData,
	getTransactionPerCategoryTypeGraphData,
	getTransactionPerCountryGraphData,
	getTransactionTrendGraphData,
} from "@/utils/graphs";
import { selectSearchTerm, setSearchTerm } from "@/redux/slices/search";
import urlsV2 from "@/config/urls_v2";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
// import { TransactionService } from "@/api/services/v2/transaction";
import { TransactionService } from "@/api/services/v1v2/transaction";
import { CustomerService } from "@/api/services/v2/customer";
import StatsPerCategoryType from "./components/StatsPerCategoryType";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsDailyPerCategoryType from "./components/StatsDailyPerCategoryType";

const dataCardsData = [
	// {title:'Recharges de comptes'},
	// {title:'Retraits de comptes'},
	// {title:'Transferts entre comptes'},
	{ title: "Transferts Mobile Money" },
	// {title:'Recharges de cartes'},
	// {title:'Retraits de cartes'},
	{ title: "Création de cartes" },
	{ title: "Comptes créés" },
];

interface Periods {
	hour: string;
	"3hours": string;
	"6hours": string;
	"12hours": string;
	day: string;
	week: string;
	month: string;
	"6months": string;
	year: string;
	[key: string]: string; // Index signature
}

// Assuming periods is defined somewhere in your code
const periods: Periods = {
	hour: "1h",
	"3hours": "3h",
	"6hours": "6h",
	"12hours": "12h",
	day: "Jour",
	week: "Semaine",
	month: "Mois",
	"6months": "Semestre",
	year: "Année",
};

const backgroundColor = [
	"#FFDB5A",
	"#F85D4B",
	"#6200EE",
	"#FD8A49",
	"#33E89C",
	"#5BCEFF",
];

const getBestUsers = async ({ queryKey }: any) => {
	const [_key, st] = queryKey;
	let params: any = { label: "best_customers" };
	if (st) params.searchTerm = st;
	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}
	return responseJson.data;
};

const getTransactionTrends = async ({ queryKey }: any) => {
	const [_key, period, startDate, limitDate] = queryKey;
	let params: any = {};
	if (period) params.period = period;
	if (startDate) params.startDate = startDate;
	if (limitDate) params.limitDate = limitDate;
	const response = await TransactionService.get_stats_periodic(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get transactions");
	}
	return responseJson.data;
};

const getUsersPerCountry = async ({ queryKey }: any) => {
	const [_key, startDate, limitDate] = queryKey;
	let params: any = {};
	if (startDate) params.startDate = startDate;
	if (limitDate) params.limitDate = limitDate;
	const response = await CustomerService.get_stats_countries(params);
	// const response = await TransactionService.get_stats_countries();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get transactions per country"
		);
	}
	return responseJson.data;
};

// const getCategoryTypeTransactions = async ({queryKey}:any) => {
//   const [_key, limitDate] = queryKey;
//   let params:any = {};
//   if(limitDate) params.limitDate = limitDate;
//   const response = await TransactionService.get_stats_category_type(params);
//   const responseJson = await response.json();
//   if (!response.ok) {
//     throw new Error(responseJson.message || 'Failed to get transactions per category and type');
//   }
//   return responseJson.data;
// };

export default function Home() {
	useTitle("Sekure | Accueil", true);
	const dispatch = useDispatch();
	const period: string = useSelector(selectTransactionPeriod);
	const startDate: string = useSelector(selectStartDate);
	const limitDate: string = useSelector(selectLimitDate);
	const searchTerm: string = useSelector(selectSearchTerm);

	const bestUsersQueryRes = useQuery({
		queryKey: ["bestUsers", searchTerm],
		queryFn: getBestUsers,
		onError: (err) => {
			toast.error("Failed to get users.");
		},
		refetchInterval: 50000, // Fetches data every 50 seconds
	});

	const transactionTrendsQueryRes = useQuery({
		queryKey: ["transactionTrends", period, startDate, limitDate],
		queryFn: getTransactionTrends,
		onError: (err) => {
			toast.error("Une erreur est survenue:" + err);
		},
		refetchInterval: 30000, // Fetches data every 15 seconds
	});

	const transactionPerCountryQueryRes = useQuery({
		queryKey: ["transactionPerCountry", startDate, limitDate],
		queryFn: getUsersPerCountry,
		onError: (err) => {
			toast.error("Une erreur est survenue:" + err);
		},
		refetchInterval: 75000, // Fetches data every 15 seconds
	});

	// const transactionPerCategoryTypeQueryRes = useQuery({
	//   queryKey: ["transactionPerCategoryType", limitDate],
	//   queryFn: getCategoryTypeTransactions,
	//   onError: (err) => {
	//     toast.error("Une erreur est survenue:"+err);
	//   },
	//   refetchInterval: 35000, // Fetches data every 15 seconds
	// });

	// console.log("last10TransactionsRes.data : ", last10TransactionsRes.data ? new Date(last10TransactionsRes.data[0]): null, last10TransactionsRes.data);

	console.log("bestUsersQueryRes.data : ", bestUsersQueryRes.data);

	console.log("transactionTrends.data : ", transactionTrendsQueryRes.data);

	console.log(
		"transactionPerCountry.data : ",
		transactionPerCountryQueryRes.data
	);

	// console.log("transactionPerCategoryType.data : ", transactionPerCategoryTypeQueryRes.data);

	const { transactionTrendsGraphData, chartOptions } =
		getTransactionTrendGraphData({
			trxData: transactionTrendsQueryRes.data ?? {},
			dual: true,
		});
	const { transactionPerCountryGraphData, transactionPerCountryData } =
		getTransactionPerCountryGraphData(
			transactionPerCountryQueryRes.data ?? [],
			"Nbre utilisateurs"
		);
	// const {dataData:cardsGraphData, trxData:cardsData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.cards ?? [], 1);
	// const {dataData:usersGraphData , trxData:usersData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.users ?? [], 2);
	// const {dataData:cardsTopUpsGraphData , trxData:cardsTopUpsData} = getGraphData(transactionPerCategoryTypeQueryRes?.data?.cardTopUpPerDay ?? [], 3);

	let rearrangedTableData: any[] = [];
	if (bestUsersQueryRes.data) {
		rearrangedTableData = bestUsersQueryRes.data.map(
			(item: any, index: any) => {
				const rearrangedItem = {
					serial: index + 1,
					name: `${item.last_name} ${item.first_name}`,
					country:
						item.country.includes("Congo") &&
						item.country.includes("Democratic")
							? "Congo RDC"
							: item.country,
					phone: item.country_phone_code
						? `${item.country_phone_code} ${item.phone}`
						: item.phone,
					email: item.email,
					solde: item.balance_xaf?.toLocaleString("fr-FR"),
					soldeStandby:
						item.old_balance_xaf?.toLocaleString("fr-FR") ?? 0,
					nbCartes: item.number_of_cards, //item.numberOfCards,
					totalTrx:
						item.total_transaction_amount?.toLocaleString("fr-FR"), // item.totalTransactionAmount.toLocaleString('fr-FR'),
					avgTrx: item.average_transaction_amount
						? Math.round(
								item.average_transaction_amount
						  )?.toLocaleString("fr-FR")
						: 0, // item.avgTransactionAmount ? Math.round(item.avgTransactionAmount).toLocaleString('fr-FR') : 0,
					oldNew: item.is_v1 ? (
						<LabelWithBadge label="Ancien" badgeColor="#000" />
					) : (
						<LabelWithBadge label="Nouveau" badgeColor="#1F66FF" />
					),
					kyc:
						item.kyc_result == "APPROVED" ? (
							<LabelWithBadge
								label="Approuvé"
								badgeColor="#1F66FF"
							/>
						) : item.kyc_result == "DECLINED" ? (
							<LabelWithBadge
								label="Refusé"
								badgeColor="#F85D4B"
							/>
						) : item.kyc_status == "PENDING" ? (
							<LabelWithBadge
								label="En cours"
								badgeColor="#999"
							/>
						) : (
							<LabelWithBadge label="Aucun" badgeColor="#000" />
						),
					status: <ActiveYesNo isActive={item.active} />,
					locked: (
						<ActiveYesNo
							isActive={item.blocked}
							colorActive={"#F85D4B"}
							labelActive={"Bloqué"}
							labelInactive={"Non"}
						/>
					),
					date: getFormattedDateTime(item.created_at), //item.date,
					actions: (
						<CButton
							text={"Manager"}
							href={`${urlsV2.usersAccounts.manage}/${item.id}`}
							btnStyle={"dark"}
							icon={<FourDots />}
						/>
					),
				};
				item = rearrangedItem;
				return item;
			}
		);
	}

	return (
		<Layout title="Accueil et visualisation globale">
			<></>
			<section className="flex justify-between items-start gap-10 w-full">
				<div className="flex-1 overflow-hidden">
					<div className="w-full flex justify-between items-start mb-3">
						<Title
							title="Évolution des transactions "
							subtitle={
								transactionTrendsGraphData?.labels?.length > 0
									? `${
											transactionTrendsGraphData
												?.labels?.[0]
									  } - ${
											transactionTrendsGraphData
												?.labels?.[
												transactionTrendsGraphData
													?.labels?.length - 1
											]
									  }`
									: "Chargement ..."
							}
							// subtitle="visualisez la courbe d’evolution en nombre de cartes parrainées"
						/>
						<div className="flex flex-col gap-2">
							{transactionTrendsQueryRes.status == "loading" ? (
								<div className={"loadingSpinner"}></div>
							) : (
								<>
									<div className="flex justify-between items-center gap-8">
										<p className="text-xs">{`Transactions aujourd'hui`}</p>
										<h1 className="text-sm font-semibold">
											{transactionTrendsQueryRes?.data?.todayTotal?.todayTotalAmount?.toLocaleString(
												"fr-FR"
											) ?? 0}
											{` XAF`}
										</h1>
									</div>
									<div className="flex justify-between items-center gap-8">
										<p className="text-xs">
											Transactions Totales
										</p>
										<p className="text-xs text-right">
											{transactionTrendsQueryRes?.data?.avgTotal?.totalAmount?.toLocaleString(
												"fr-FR"
											) ?? 0}
											{` XAF`}
										</p>
									</div>
								</>
							)}
						</div>
					</div>
					{transactionTrendsQueryRes.status == "loading" ? (
						<></>
					) : (
						<CustomDropdown
							title={period && periods[period]}
							cstyle={"outline"}
							iconSize={20}
							items={[
								...Object.keys(periods).map((pkey, pindex) => (
									<div
										key={pkey}
										className="flex w-full justify-between gap-2"
										onClick={() =>
											dispatch(setPeriod(pkey))
										}
									>
										<span className="text-nowrap text-sm w-full">
											{periods[pkey]}
										</span>
									</div>
								)),
							]}
						/>
					)}
					<AreaChart
						data={transactionTrendsGraphData}
						options={chartOptions}
					/>
				</div>
				<div>
					<div
						className="relative overflow-hidden"
						style={{ height: "23rem" }}
					>
						<Title title={"Utilisateurs par pays"} />
						{transactionPerCountryQueryRes.status === "loading" ? (
							<div className="flex w-full py-10 justify-center items-center">
								<div className={"loadingSpinner"}></div>
							</div>
						) : (
							<>
								<Doughnut
									data={transactionPerCountryGraphData}
								/>
								<div className="grid grid-cols-2 gap-x-10 gap-3">
									{Object.entries(
										transactionPerCountryData
									)?.map(
										([key, value]: any[], index: any) => (
											<LegendItem
												key={index}
												label={key}
												title={String(value?.count)}
												color={value?.color}
												value={`${value.percentageCount}%`}
											/>
										)
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</section>

			<section className="w-full my-[50px]">
				<Tabs defaultValue="01" className="w-full">
					<div className="border-b-1">
						<TabsList className="TabsList">
							<TabsTrigger
								className="TabsTrigger"
								value="01"
							>{`Aujourd'hui`}</TabsTrigger>
							<TabsTrigger
								className="TabsTrigger"
								value="02"
							>{`Par jour`}</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="01">
							<StatsPerCategoryType />
						</TabsContent>
						<TabsContent value="02">
							<StatsDailyPerCategoryType />
						</TabsContent>
					</div>
				</Tabs>
			</section>

			<section>
				<div className="flex flex-between items-center p-8 w-full bg-[#FFDB5A] rounded-lg mt-10">
					<div className="flex items-start gap-4 flex-1">
						<IoChatbubble
							size={26}
							color="#994617"
							className="mt-2"
						/>
						<div className="flex flex-col items-start justify-start text-[#994617]">
							<h1 className="text-md lg:text-lg font-semibold text-[#994617]">
								03 Nouveaux messages des requetes clients
							</h1>
							<p className="text-xs text-[#994617]">
								Separated they live in Bookmarks right at the
								coast of the famous{" "}
							</p>
						</div>
					</div>
					<CButton
						text={"Voir"}
						href={"#"}
						btnStyle={"white_darkRed"}
						icon={<FaChevronRight />}
						iconSize={12}
						iconPosition={"end"}
					/>
				</div>
			</section>

			{/* <section>
        <div className='w-full my-[50px] border border-gray-800'/>
        <div className='grid grid-cols-2 gap-x-10 w-full mt-6'>
          <div className='flex flex-col gap-2 overflow-hidden'>
            <div className='flex justify-between items-center'>
              <Title title={"Évolution des utilisateurs"} />
              <CustomDropdown
                title={'Par jour'}			
                cstyle={'outline'}
                iconSize={20}
                items={[
                  <div key={'1'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par jour
                    </span>
                  </div>,
                  <div key={'2'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par semaine
                    </span>
                  </div>,
                  <div key={'3'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par mois
                    </span>
                  </div>,
                ]}
              />
            </div>
            <div className='w-full flex justify-between items-center gap-3'>
              <ChartLabelBox title="Comptes créés aujourd'hui" rate="42" />
              <ChartLabelBox title="Transactions Totales" rate="2550" />
              <ChartLabelBox title="Moy. de creation" rate="80/jour" />
            </div>
            <AreaChart data={gradientData2}/>
            <div className='grid grid-cols-2 gap-10 overflow-hidden  mt-5'>
              <div>
                <Title title={"Etat des comptes créés"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`Tinder.com`} color={`#F85D4B`} value={`46%`}/>
                        <LegendItem  label={`Alibaba.com`} color={`#B8A16B`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataFour} size={90}/>
                </div>
              </div>
              <div>
                <Title title={"Nbre de cartes par compte"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`0`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`1`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`2`} color={`#F85D4B`} value={`46%`}/>
                        <LegendItem  label={`3 et plus`} color={`#B8A16B`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataFour} size={90}/>
                </div>
              </div>
            </div>
          </div>
          

          <div className='flex flex-col gap-2 overflow-hidden'>
            <div className='flex justify-between items-center'>
              <Title title={"Évolution des cartes"} />
              <CustomDropdown
                title={'Par jour'}			
                cstyle={'outline'}
                iconSize={20}
                items={[
                  <div key={'1'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par jour
                    </span>
                  </div>,
                  <div key={'2'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par semaine
                    </span>
                  </div>,
                  <div key={'3'} className='flex justify-between gap-2'>            
                    <span className='text-nowrap text-sm '>
                    Par mois
                    </span>
                  </div>,
                ]}
              />
            </div>
            <div className='w-full flex justify-between items-center gap-3'>
              <ChartLabelBox title="Cartes créés aujourd'hui" rate="42" />
              <ChartLabelBox title="Transactions Totales" rate="2550" />
              <ChartLabelBox title="Moy. de création" rate="80/jour" />
            </div>
            <AreaChart data={gradientData3}/>
            <div className='grid grid-cols-2 gap-10 overflow-hidden  mt-5'>
              <div>
                <Title title={"Etat des cartes créés"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Actives`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Bloquées`} color={`#FFDB5A`} value={`46%`}/>
                        <LegendItem  label={`Supprimées`} color={`#FD8A49`} value={`46%`}/>                      
                    </div>
                    <PieChart data={pieDataThree} size={90}/>
                </div>
              </div>
              <div>
                <Title title={"Nbre de cartes par type"} />
                <div className='flex justify-between items-center gap-2 flex-1'>
                    <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                        <LegendItem  label={`Mastercard`} color={`#33E89C`} value={`46%`}/>
                        <LegendItem  label={`Visa`} color={`#FFDB5A`} value={`46%`}/>
                    </div>
                    <PieChart data={pieDataTwo} size={90}/>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section> */}

			<section>
				<div className="w-full my-[50px] border border-gray-800" />
				<div className="">
					<div className="mb-5">
						<Title title={"Liste des meilleurs utilisateurs"} />
					</div>
					<CustomTable
						headerData={headerData}
						tableData={rearrangedTableData}
						isLoading={bestUsersQueryRes.status == "loading"}
						threeButtons
					/>
				</div>
			</section>
		</Layout>
	);
}
