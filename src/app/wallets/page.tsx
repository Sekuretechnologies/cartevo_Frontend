"use client";
import Image from "next/image";
import { useTitle } from "@/hooks/useTitle";
import ProductsSection from "@/components/sections/ProductsSection";
import { useMutation, useQuery } from "react-query";
import { axiosOpenedInstance } from "@/utils/axios";
import toast from "react-hot-toast";
import { Kbd } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";

import SideBar from "@/components/shared/SideBar";
import { RxCaretDown, RxDotsHorizontal } from "react-icons/rx";
import { IoIosDisc, IoIosNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Navbar from "@/components/shared/Navbar";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import CustomDropdown from "@/components/shared/CustomDropdown";
import Link from "next/link";
import ButtonFilled from "@/components/shared/ButtonFilled";
import { IGenericRow } from "@/components/AdminTable/Table";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import ButtonOutlined from "@/components/shared/ButtonOutlined";
import { FourDots } from "@/components/shared/icons";
import { isObject, isString } from "@/utils/utils";
import Transfers from "@/components/cards/Transfers";
import TransfersTotal from "@/components/cards/TransfersTotal";
import TransferType from "@/components/cards/TransferType";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import AreaChart from "@/components/charts/AreaChart";
import Doughnut from "@/components/charts/Doughnut";
import Title from "@/components/shared/Title";
import { ScriptableContext } from "chart.js";
import LegendItem from "@/components/shared/LegendItem";
import PieChart from "@/components/charts/pieChart/PieChart";
import CButton from "@/components/shared/CButton";
import { FaLock, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import classNames from "classnames";

import {
	headerUserAccountDataV2 as headerData,
	tableUserAccountData as tableData,
	trxData as data,
	pieData,
	pieData2,
	doughnutData,
} from "@/constants/Index";
import {
	waitCircleIcon,
	checkCircleIcon,
	ongoingCircleIcon,
	haltCircleIcon,
} from "@/constants/icons";
import InfoCardGrid from "@/components/cards/InfoCardGrid";
import Modal from "@/components/shared/Modal/Modal";
import { UserService } from "@/api/services/user";
import { getFormattedDate, getFormattedDateTime } from "@/utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import urlsV2 from "@/config/urls_v2";
import { selectSearchTerm, setSearchTerm } from "@/redux/slices/search";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { CustomerService } from "@/api/services/v2/customer";
import { HashLoader } from "react-spinners";
import useKeyPressed from "@/hooks/useKeyPressed";
import WalletCardGrid from "@/components/cards/WalletCardGrid";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import * as CFlags from "country-flag-icons/react/3x2";
import { getCategoryModeV2, getCategoryTypeV2 } from "@/utils/graphs";
import TransactionModal from "../dashboard/v2/users_accounts/manage/[id]/components/Tabs/Transactions/modals/TransactionModal";
import { headerUserTransactionDataV2 } from "@/constants/TransactionData";
import BadgeLabel from "@/components/shared/BadgeLabel";

const CountryFlags: any = CFlags;

const ItemFlagCM = CountryFlags["CM"];
const ItemFlagUS = CountryFlags["US"];

let infoData: TDataList[] = [
	[
		[
			{
				label: {
					text: "Wallet",
					fw: "bold",
					fs: "20px",
					color: "#444",
				},
				value: {
					text: (
						<span className="flex gap-2 items-center">
							<span>XAF</span>
							<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
								<ItemFlagCM />
							</span>
						</span>
					),
					fs: "20px",
					fw: "bold",
					color: "#444",
				},
			},
			{
				label: { text: "Solde disponible", fw: "", color: "#444" },
				value: {
					text: "136 000",
					fs: "25px",
					fw: "bold",
					color: "#444",
				},
			},
		],
		[
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={"Recharger"}
							btnStyle={"blue"}
							// href={`/`}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={"Convertir"}
							btnStyle={"outlineDark"}
							// href={`/`}
							icon={<FaArrowsRotate />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: "Wallet",
					fw: "bold",
					fs: "20px",
					color: "#444",
				},
				value: {
					text: (
						<span className="flex gap-2 items-center">
							<span>USD</span>
							<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
								<ItemFlagUS />
							</span>
						</span>
					),
					fs: "20px",
					fw: "bold",
					color: "#444",
				},
			},
			{
				label: { text: "Solde disponible", fw: "", color: "#444" },
				value: {
					text: "1460",
					fs: "25px",
					fw: "bold",
					color: "#444",
				},
			},
		],
		[
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={"Recharger"}
							btnStyle={"blue"}
							// href={`/`}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={"Convertir"}
							btnStyle={"outlineDark"}
							// href={`/`}
							icon={<FaArrowsRotate />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
		],
	],
];

// infoData[0][0][0].value.text = 0;
// infoData[0][1][0].value.text = 0 + "  /jour";
// infoData[1][0][0].value.text = 0;
// infoData[1][1][0].value.text = 0 + "  XAF";

// infoData[2][0][0].value.text = 0;
// infoData[2][1][0].value.text = 0 + "  XAF";
// infoData[3][0][0].value.text = 0;
// infoData[3][1][0].value.text = 0 + "  XAF";

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

const getCustomersStats = async ({ queryKey }: any) => {
	const [_key, filterContent] = queryKey;
	let params: any = {};
	if (isObject(filterContent)) {
		Object.entries(filterContent).map(([key, value]: any[]) => {
			if (value && value !== "all") params[key] = value;
		});
	}
	const response = await CustomerService.get_customers_stats(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get users statistics"
		);
	}
	return responseJson.data;
};

export default function Home() {
	useTitle("Cartevo | wallets", true);

	const [filterContent, setFilterContent] = useState({});

	const [statsData, setStatsData] = useState<TDataList[]>();

	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	//------------------------------------------------
	const oneUserTransactionsQueryRes = useQuery({
		queryKey: [
			"oneUserTransactions",
			"2920c23e-3389-4caf-ba26-569683eb4b7a",
		],
		queryFn: getOneCustomerTransactions,
		onError: (err) => {
			toast.error(
				"Failed to get user Transactions : " +
					"2920c23e-3389-4caf-ba26-569683eb4b7a"
			);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	// dispatch(setCurrentCustomerTransactions(oneUserTransactionsQueryRes.data));
	console.log("userQueryRes.data : ", oneUserTransactionsQueryRes.data);
	const userTransactionsData = oneUserTransactionsQueryRes.data;

	//------------------------------------------------

	const allUsersStatsQueryRes = useQuery({
		queryKey: ["allUsersStats", filterContent],
		queryFn: getCustomersStats,
		onError: (err) => {
			toast.error("Failed to get users stats.");
		},
		refetchInterval: 30000, // Fetches data every 30 seconds
	});

	//------------------------------------------------

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	const { shiftDown, iPressed, ePressed } = useKeyPressed();

	// useEffect(() => {
	// 	if (shiftDown && ePressed) {
	// 		if (allUsersStatsQueryRes?.data) {
	// 			infoData[0][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.external?.todayCountUsers?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[0][1][0].value.text =
	// 				Math.round(
	// 					allUsersStatsQueryRes?.data?.external?.avgUsers ?? 0
	// 				) + "  /jour";
	// 			infoData[1][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.external?.countUsers?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[1][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.external?.totalSolde?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";
	// 			infoData[2][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.external?.countV1Users?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[2][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.external?.totalSoldeV1?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";
	// 			infoData[3][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.external?.countV2Users?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[3][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.external?.totalSoldeV2?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";

	// 			setStatsData(infoData);
	// 		}
	// 	} else if (shiftDown && iPressed) {
	// 		if (allUsersStatsQueryRes?.data) {
	// 			infoData[0][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.internal?.todayCountUsers?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[0][1][0].value.text =
	// 				Math.round(
	// 					allUsersStatsQueryRes?.data?.internal?.avgUsers ?? 0
	// 				) + "  /jour";
	// 			infoData[1][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.internal?.countUsers?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[1][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.internal?.totalSolde?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";
	// 			infoData[2][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.internal?.countV1Users?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[2][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.internal?.totalSoldeV1?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";
	// 			infoData[3][0][0].value.text =
	// 				allUsersStatsQueryRes?.data?.internal?.countV2Users?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0;
	// 			infoData[3][1][0].value.text =
	// 				(allUsersStatsQueryRes?.data?.internal?.totalSoldeV2?.toLocaleString(
	// 					"fr-FR"
	// 				) ?? 0) + "  XAF";

	// 			setStatsData(infoData);
	// 		}
	// 	}
	// }, [shiftDown, ePressed, iPressed]);
	/** ------------------------------------------------- */

	if (allUsersStatsQueryRes?.data) {
		// infoData[0][0][0].value.text =
		// 	allUsersStatsQueryRes?.data?.internal?.todayCountUsers?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0;
		// infoData[0][1][0].value.text =
		// 	Math.round(allUsersStatsQueryRes?.data?.internal?.avgUsers ?? 0) +
		// 	"  /jour";

		// infoData[1][0][0].value.text =
		// 	allUsersStatsQueryRes?.data?.internal?.countUsers?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0;
		// infoData[1][1][0].value.text =
		// 	(allUsersStatsQueryRes?.data?.internal?.totalSolde?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0) + "  XAF";
		// infoData[2][0][0].value.text =
		// 	allUsersStatsQueryRes?.data?.internal?.countV1Users?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0;
		// infoData[2][1][0].value.text =
		// 	(allUsersStatsQueryRes?.data?.internal?.totalSoldeV1?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0) + "  XAF";
		// infoData[3][0][0].value.text =
		// 	allUsersStatsQueryRes?.data?.internal?.countV2Users?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0;
		// infoData[3][1][0].value.text =
		// 	(allUsersStatsQueryRes?.data?.internal?.totalSoldeV2?.toLocaleString(
		// 		"fr-FR"
		// 	) ?? 0) + "  XAF";

		rearrangedTableData =
			oneUserTransactionsQueryRes?.data?.transactions?.data?.map(
				(item: any, index: any) => {
					const rearrangedItem = {
						serial: index + 1,
						type: getCategoryTypeV2(item.category, item.type),
						name: item.merchant?.name,
						country: item.country,
						phone: item.phone_number,
						idTrx: item.id,
						amount: item.amount_xaf?.toLocaleString("en-EN") ?? 0,
						status:
							item.status == "SUCCESS" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"Réussi"}
									badgeColor={"#1F66FF"}
									textColor={"#444"}
								/>
							) : item.status == "FAILED" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"Echec"}
									badgeColor={"#F85D4B"}
									textColor={"#444"}
								/>
							) : item.status?.toUpperCase() == "PENDING" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"En cours"}
									badgeColor={"#FFAC1C"}
									textColor={"#444"}
								/>
							) : item.status == "CANCELLED" ||
							  item.status == "CANCELED" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"Suspendu"}
									badgeColor={"#444"}
									textColor={"#444"}
								/>
							) : (
								<></>
							),
						date: getFormattedDateTime(item.created_at, "en"),
						actions: (
							<>
								<div className="flex gap-5">
									<CButton
										text={"Details"}
										// href={`?transaction${index + 1}=true`}
										onClick={() => setIsOpen(index)}
										btnStyle={"outlineDark"}
									/>
									<Modal
										index={`${index}`}
										name={"pending"}
										isOpen={isOpen === index}
										setIsOpen={setIsOpen}
										modalContent={
											<TransactionModal
												setIsOpen={setIsOpen}
												// customer={customerDetails?.customer}
												item={item}
											/>
										}
									/>
								</div>
							</>
						),
					};
					item = rearrangedItem;
					return item;
				}
			);
	}

	return (
		<Layout title={"Wallets"}>
			<section className="mt-2">
				{allUsersStatsQueryRes?.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
					</div>
				) : (
					<WalletCardGrid walletData={infoData} />
				)}

				{/* <div className='mb-10 grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1' style={{gap:'20px'}}>
                    {infoData.map((data, index) => (
                        <InfoCard key={index} data={data} />
                    ))}
                </div> */}

				{/* <div 
                style={{width:'calc(100vw - 350px)', overflowX:'auto'}}
                className={`relative flex flex-row w-full items-start mt-6 gap-16`}>
                    <div className='flex flex-col justify-between items-start gap-2'>
                        <div className='w-full flex justify-between items-center'>
                            <Title 
                            title={"Évolution des utilisateurs"}
                            subtitle={"Visualisez la courbe d'évolution en nombre de cartes parrainées"}
                            />
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
                        <div className="relative mt-5 w-[810px]">                        
                            <AreaChart data={data} />
                        </div>
                    </div>          
                    <div>
                        <div className="relative  h-80 overflow-hidden">
                            <Title title={"Traffic de paiements"} />
                            <Doughnut data={doughnutData} />
                            <div className='grid grid-cols-2 gap-x-10 gap-3'>
                                <LegendItem  label={`Facebook.com`} color={`#33E89C`} value={`46%`}/>
                                <LegendItem  label={`Amazon.com`} color={`#FFDB5A`} value={`46%`}/>
                                <LegendItem  label={`Tinder.com`} color={`#FD8A49`} value={`46%`}/>
                                <LegendItem  label={`Alibaba.com`} color={`#6200EE`} value={`46%`}/>
                                <LegendItem  label={`Google ads`} color={`#5BCEFF`} value={`46%`}/>
                                <LegendItem  label={`Autres`} color={`#F85D4B`} value={`46%`}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <Title title={"Etat des comptes créés"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>
                                    <LegendItem  label={`Vérifiés`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`En attente`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`Bloqués`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`No KYC`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                        <div>
                            <Title title={"Nombre de cartes par compte"} />
                            <div className='flex justify-between items-center gap-2 flex-1'>
                                <div className='flex flex-col justify-start items-start gap-1 w-[120px]'>                                    
                                    <LegendItem  label={`0`} color={`#33E89C`} value={`46%`}/>
                                    <LegendItem  label={`1`} color={`#FFDB5A`} value={`46%`}/>
                                    <LegendItem  label={`2`} color={`#FD8A49`} value={`46%`}/>
                                    <LegendItem  label={`3 et plus`} color={`#6200EE`} value={`46%`}/>
                                </div>
                                <PieChart data={pieData} size={150}/>
                            </div>
                        </div>
                    </div>
                </div> */}

				<div className="my-[50px] bg-white  shadow-md rounded-xl p-5">
					<div className="mb-5">
						<Title title={"Last transactions"} />
					</div>
					<CustomTable
						headerData={headerUserTransactionDataV2}
						tableData={rearrangedTableData}
						isLoading={
							oneUserTransactionsQueryRes?.status == "loading"
						}
						// threeButtons
						filter
						filterType={"transaction"}
						filterContent={filterContent}
						setFilterContent={setFilterContent}
						// generateExcel={() => mutationExcel.mutate()}
					/>
				</div>

				{/* <div
					style={{ zIndex: 9000 }}
					className={classNames(
						"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-20":
								mutationExcel.isLoading,
						}
					)}
				>
					<HashLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div> */}
				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
