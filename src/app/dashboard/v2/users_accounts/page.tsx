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
import { FaLock } from "react-icons/fa";
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

let infoData: TDataList[] = [
	[
		[
			{
				label: {
					text: "Comptes créés aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "42", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: { text: "Moyenne de création", fw: "", color: "#444" },
				value: { text: "80 / jour", fw: "bold", color: "#444" },
			},
		],
	],
	[
		[
			{
				label: { text: "Comptes créés ", fw: "bold", color: "#444" },
				value: { text: "1456", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: "Total solde SEKURE ",
					fw: "bold",
					color: "#444",
				},
				value: { text: "24 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
		// [
		//     {
		//         label:{text:checkCircleIcon, tooltip:"Actifs", fw:"", color:"#444"},
		//         value:{text:"1399", fw:"bold", color:"#1F66FF"}
		//     },
		//     {
		//         label:{text:haltCircleIcon, tooltip:"Bloqués", fw:"", color:"#444"},
		//         value:{text:"57", fw:"bold", color:"#F85D4B"}
		//     },
		// ]
	],
	[
		[
			{
				label: { text: "Anciens comptes ", fw: "bold", color: "#444" },
				value: { text: "1456", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: "Solde total anciens comptes ",
					fw: "bold",
					color: "#444",
				},
				value: { text: "24 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
	],
	[
		[
			{
				label: { text: "Nouveaux comptes ", fw: "bold", color: "#444" },
				value: { text: "1456", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: "Solde total nouveaux comptes ",
					fw: "bold",
					color: "#444",
				},
				value: { text: "24 558 450 XAF", fw: "bold", color: "#444" },
			},
		],
	],
	// [
	//     [{
	//         label:{text:"Verifications KYC ", fw:"bold", color:"#444"},
	//         value:{text:"1456", fw:"bold", color:"#444"}
	//     }],
	//     [
	//         {
	//             label:{text:waitCircleIcon, tooltip:"En attente", fw:"", color:"#444", fs:'11px'},
	//             value:{text:"1399", fw:"bold", color:"#888", fs:'14px'}
	//         },
	//         {
	//             label:{text:checkCircleIcon, tooltip:"Validés", fw:"", color:"#444", fs:'11px'},
	//             value:{text:"443", fw:"bold", color:"#1F66FF", fs:'14px'}
	//         },
	//         {
	//             label:{text:haltCircleIcon, tooltip:"Bloqués", fw:"", color:"#444", fs:'11px'},
	//             value:{text:"57", fw:"bold", color:"#F85D4B", fs:'14px'}
	//         },
	//     ]
	// ]
];

infoData[0][0][0].value.text = 0;
infoData[0][1][0].value.text = 0 + "  /jour";
infoData[1][0][0].value.text = 0;
infoData[1][1][0].value.text = 0 + "  XAF";
// infoData[1][1][1].value.text = 0;
infoData[2][0][0].value.text = 0;
infoData[2][1][0].value.text = 0 + "  XAF";
infoData[3][0][0].value.text = 0;
infoData[3][1][0].value.text = 0 + "  XAF";
// infoData[4][0][0].value.text = 0;
// infoData[4][1][0].value.text = 0 + "  XAF";
// infoData[3][1][1].value.text = 0;
// infoData[3][1][2].value.text = 0;

const getAllCustomers = async ({ queryKey }: any) => {
	const [_key, st, filterContent] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;

	if (isObject(filterContent)) {
		Object.entries(filterContent).map(([key, value]: any[]) => {
			if (value && value !== "all") params[key] = value;
		});
	}
	console.log("getAllCustomers searchTerm : ", st);
	console.log("getAllCustomers filterContent : ", filterContent);
	console.log("getAllCustomers params : ", params);

	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}
	console.log("responseJson.data : ", responseJson.data);

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

const generateCustomersExcel = async (queryData: any) => {
	const { filterContent } = queryData;
	let params: any = {};
	if (isObject(filterContent)) {
		Object.entries(filterContent).map(([key, value]: any[]) => {
			if (value && value !== "all") params[key] = value;
		});
	}
	const response = await CustomerService.generate_customers_excel(params);

	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function Home() {
	useTitle("Sekure | Comptes utilisateurs", true);

	const [filterContent, setFilterContent] = useState({});

	const [statsData, setStatsData] = useState<TDataList[]>();

	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	const mutationExcel = useMutation({
		mutationFn: (data) => generateCustomersExcel({ filterContent }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Echec lors de la generation de fichier excel : ` + err.message
			);
			// downloadLink
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Fichier excel généré avec succes.`);
			redirectRef.current.href = data?.data;
			redirectRef.current.click();
		},
	});

	const allUsersStatsQueryRes = useQuery({
		queryKey: ["allUsersStats", filterContent],
		queryFn: getCustomersStats,
		onError: (err) => {
			toast.error("Failed to get users stats.");
		},
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	const allUsersQueryRes = useQuery({
		queryKey: ["allCustomers", searchTerm, filterContent],
		queryFn: getAllCustomers,
		onError: (err) => {
			toast.error("Failed to get users.");
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});

	console.log("allUsersQueryRes.data : ", allUsersQueryRes.data);
	console.log("allUsersStatsQueryRes.data : ", allUsersStatsQueryRes.data);

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
		infoData[0][0][0].value.text =
			allUsersStatsQueryRes?.data?.internal?.todayCountUsers?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[0][1][0].value.text =
			Math.round(allUsersStatsQueryRes?.data?.internal?.avgUsers ?? 0) +
			"  /jour";
		infoData[1][0][0].value.text =
			allUsersStatsQueryRes?.data?.internal?.countUsers?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[1][1][0].value.text =
			(allUsersStatsQueryRes?.data?.internal?.totalSolde?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[2][0][0].value.text =
			allUsersStatsQueryRes?.data?.internal?.countV1Users?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[2][1][0].value.text =
			(allUsersStatsQueryRes?.data?.internal?.totalSoldeV1?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";
		infoData[3][0][0].value.text =
			allUsersStatsQueryRes?.data?.internal?.countV2Users?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[3][1][0].value.text =
			(allUsersStatsQueryRes?.data?.internal?.totalSoldeV2?.toLocaleString(
				"fr-FR"
			) ?? 0) + "  XAF";

		// infoData[4][0][0].value.text = allUsersStatsQueryRes?.data?.todayTotal?.toLocaleString('fr-FR') ?? 0;
		// infoData[4][1][0].value.text = (allUsersStatsQueryRes?.data?.totalSolde?.toLocaleString('fr-FR') ?? 0) + "  XAF";

		// setStatsData(infoData);

		rearrangedTableData = allUsersQueryRes?.data?.map(
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
		<Layout title={"Comptes utilisateurs"}>
			<section className="mt-2">
				{allUsersStatsQueryRes?.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
					</div>
				) : (
					<InfoCardGrid infoData={infoData} />
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

				<div className="my-[50px]">
					<div className="mb-5">
						<Title
							title={"Liste des utilisateurs v2"}
							subtitle={
								"Liste en temps réel des derniers utilisateurs inscrits"
							}
						/>
					</div>
					<CustomTable
						headerData={headerData}
						tableData={rearrangedTableData}
						isLoading={allUsersQueryRes.status == "loading"}
						threeButtons
						filter
						filterType={"user"}
						filterContent={filterContent}
						setFilterContent={setFilterContent}
						generateExcel={() => mutationExcel.mutate()}
					/>
				</div>

				<div
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
				</div>
				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
