"use client";

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KYCAll from "./components/Tabs/KYCAll";
import KYCNone from "./components/Tabs/KYCNone";
import KYCAccepted from "./components/Tabs/KYCAccepted";
import KYCDeclined from "./components/Tabs/KYCDeclined";
import KYCPending from "./components/Tabs/KYCPending";
import InfoCard, { TDataList } from "@/components/cards/InfoCard";
import {
	checkCircleIcon,
	haltCircleIcon,
	stopIcon,
	folderIcon,
	ongoingCircleIcon,
	verifiedIcon,
	waitCircleIcon,
} from "@/constants/icons";
import { UserService } from "@/api/services/user";
import { useTitle } from "@/hooks/useTitle";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import {
	setKYCAccepted,
	setKYCAll,
	setKYCDeclined,
	setKYCNone,
	setKYCPending,
} from "@/redux/slices_v2/kyc";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";
import { CustomerService } from "@/api/services/v2/customer";

const infoData: TDataList[] = [
	[
		[
			{
				label: {
					text: "KYC aujourd'hui",
					tooltip: "KYC aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "75/120 comptes", fw: "bold", color: "#444" },
			},
		],
		[
			{
				label: {
					text: checkCircleIcon,
					tooltip: "KYC Approuvés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "65",
					fw: "bold",
					color: "#1F66FF",
					fs: "14px",
					tooltip: "KYC Approuvés",
				},
			},
			{
				label: {
					text: waitCircleIcon,
					tooltip: "KYC En attente",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "4",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "En cours",
				},
			},
			{
				label: {
					text: haltCircleIcon,
					tooltip: "KYC Rejetés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "6",
					fw: "bold",
					color: "#F85D4B",
					fs: "14px",
					tooltip: "KYC Rejetés",
				},
			},
			{
				label: {
					text: stopIcon,
					tooltip: "Pas de KYC",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "0",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "Pas de KYC",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: "Total KYC",
					tooltip: "Total KYC",
					fw: "bold",
					color: "#444",
				},
				value: { text: "5780/8852", fw: "bold", color: "#444" },
			},
		],
		[
			// {
			//     label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
			//     value:{text:"2781", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
			// },
			{
				label: {
					text: checkCircleIcon,
					tooltip: "KYC Approuvés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "2500",
					fw: "bold",
					color: "#1F66FF",
					fs: "14px",
					tooltip: "KYC Approuvés",
				},
			},
			{
				label: {
					text: waitCircleIcon,
					tooltip: "KYC En attente",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "399",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "En cours",
				},
			},
			{
				label: {
					text: haltCircleIcon,
					tooltip: "KYC Rejetés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "281",
					fw: "bold",
					color: "#F85D4B",
					fs: "14px",
					tooltip: "KYC Rejetés",
				},
			},
			{
				label: {
					text: stopIcon,
					tooltip: "Pas de KYC",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "0",
					fw: "bold",
					color: "#888",
					fs: "14px",
					tooltip: "Pas de KYC",
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: "KYC traités aujourd'hui",
					tooltip: "KYC traités aujourd'hui",
					fw: "bold",
					color: "#444",
				},
				value: { text: "5780/8852", fw: "bold", color: "#444" },
			},
		],
		[
			// {
			//     label:{text:verifiedIcon, tooltip:"KYC Vérifiés", fw:"", color:"#444", fs:'11px'},
			//     value:{text:"2781", fw:"bold", color:"#888", fs:'14px', tooltip:"KYC Vérifiés",}
			// },
			{
				label: {
					text: checkCircleIcon,
					tooltip: "KYC Approuvés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "2500",
					fw: "bold",
					color: "#1F66FF",
					fs: "14px",
					tooltip: "KYC Approuvés",
				},
			},
			{
				label: {
					text: haltCircleIcon,
					tooltip: "KYC Rejetés",
					fw: "",
					color: "#444",
					fs: "11px",
				},
				value: {
					text: "281",
					fw: "bold",
					color: "#F85D4B",
					fs: "14px",
					tooltip: "KYC Rejetés",
				},
			},
		],
	],
];

infoData[0][0][0].value.text = `${0}/${0} comptes`;
infoData[0][1][0].value.text = 0;
infoData[0][1][1].value.text = 0;
infoData[0][1][2].value.text = 0;
infoData[0][1][3].value.text = 0;
//
infoData[1][0][0].value.text = `${0}/${0} comptes`;
infoData[1][1][0].value.text = 0;
infoData[1][1][1].value.text = 0;
infoData[1][1][2].value.text = 0;
infoData[1][1][3].value.text = 0;
//
infoData[2][0][0].value.text = 0;
infoData[2][1][0].value.text = 0;
infoData[2][1][1].value.text = 0;

const getAllKYC = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.kyc_result) params.kyc_result = filter?.kyc_result;
	if (filter?.kyc_status) params.kyc_status = filter?.kyc_status;

	const response = await CustomerService.get_kyc_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}

	return responseJson.data;
};
const getKYCStats = async () => {
	const response = await CustomerService.get_kyc_stats();
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get users statistics"
		);
	}
	// console.log("getKYCStats.data : ", responseJson.data);
	return responseJson.data;
};

export default function KYC() {
	useTitle("Sekure | Vérifications KYC", true);
	const [searchKYC, setSearchKYC] = useState("");
	const [searchKYCAccepted, setSearchKYCAccepted] = useState("");
	const [searchKYCPending, setSearchKYCPending] = useState("");
	const [searchKYCDeclined, setSearchKYCDeclined] = useState("");
	const [searchKYCNone, setSearchKYCNone] = useState("");

	const dispatch = useDispatch();
	const searchTerm: string = useSelector(selectSearchTerm);

	const allKYCStatsQueryRes = useQuery({
		queryKey: ["allKYCStats"],
		queryFn: getKYCStats,
		onError: (err) => {
			toast.error("Failed to get KYC stats.");
			console.log("Failed to get KYC stats : ", err);
		},
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	console.log("allKYCStatsQueryRes.data : ", allKYCStatsQueryRes.data);

	const allKYCQueryRes = useQuery({
		queryKey: ["allKYC", {}, searchKYC],
		queryFn: getAllKYC,
		onError: (err) => {
			toast.error("Failed to get KYC.");
			console.log("Failed to get KYC : ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setKYCAll(allKYCQueryRes.data));
	console.log("allKYCQueryRes.data : ", allKYCQueryRes.data);

	const allKYCAcceptedQueryRes = useQuery({
		queryKey: [
			"allKYCAccepted",
			{ kyc_result: "APPROVED", kyc_status: "COMPLETED" },
			searchKYCAccepted,
		],
		queryFn: getAllKYC,
		onError: (err) => {
			toast.error("Failed to get Accepted KYC list.");
			console.log("Failed to get Accepted KYC list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setKYCAccepted(allKYCAcceptedQueryRes.data));
	console.log("allKYCAcceptedQueryRes.data : ", allKYCAcceptedQueryRes.data);

	const allKYCPendingQueryRes = useQuery({
		queryKey: [
			"allKYCPending",
			{ kyc_status: "PENDING" },
			searchKYCPending,
		],
		queryFn: getAllKYC,
		onError: (err) => {
			toast.error("Failed to get Pending KYC list.");
			console.log("Failed to get Pending KYC list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setKYCPending(allKYCPendingQueryRes.data));
	console.log("allKYCPendingQueryRes.data : ", allKYCPendingQueryRes.data);

	const allKYCDeclinedQueryRes = useQuery({
		queryKey: [
			"allKYCDeclined",
			{ kyc_result: "DECLINED", kyc_status: "COMPLETED" },
			searchKYCDeclined,
		],
		queryFn: getAllKYC,
		onError: (err) => {
			toast.error("Failed to get Declined KYC list.");
			console.log("Failed to get Declined KYC list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setKYCDeclined(allKYCDeclinedQueryRes.data));
	console.log("allKYCDeclinedQueryRes.data : ", allKYCDeclinedQueryRes.data);

	const allKYCNoneQueryRes = useQuery({
		queryKey: ["allKYCNone", { kyc_status: "NOT_STARTED" }, searchKYCNone],
		queryFn: getAllKYC,
		onError: (err) => {
			toast.error("Failed to get None KYC list.");
			console.log("Failed to get None KYC list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setKYCNone(allKYCNoneQueryRes.data));
	console.log("allKYCNoneQueryRes.data : ", allKYCNoneQueryRes.data);

	if (allKYCStatsQueryRes?.data) {
		infoData[0][0][0].value.text = `${
			allKYCStatsQueryRes?.data?.stats?.today?.countAll?.toLocaleString(
				"fr-FR"
			) ?? 0
		} comptes`;
		infoData[0][1][0].value.text =
			allKYCStatsQueryRes?.data?.stats?.today?.countAccepted?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[0][1][1].value.text =
			allKYCStatsQueryRes?.data?.stats?.today?.countPending?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[0][1][2].value.text =
			allKYCStatsQueryRes?.data?.stats?.today?.countDeclined?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[0][1][3].value.text =
			allKYCStatsQueryRes?.data?.stats?.today?.countNone?.toLocaleString(
				"fr-FR"
			) ?? 0;

		infoData[1][0][0].value.text = `${
			allKYCStatsQueryRes?.data?.stats?.overall?.countAll?.toLocaleString(
				"fr-FR"
			) ?? 0
		} comptes`;
		infoData[1][1][0].value.text =
			allKYCStatsQueryRes?.data?.stats?.overall?.countAccepted?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[1][1][1].value.text =
			allKYCStatsQueryRes?.data?.stats?.overall?.countPending?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[1][1][2].value.text =
			allKYCStatsQueryRes?.data?.stats?.overall?.countDeclined?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[1][1][3].value.text =
			allKYCStatsQueryRes?.data?.stats?.overall?.countNone?.toLocaleString(
				"fr-FR"
			) ?? 0;

		infoData[2][0][0].value.text = `${
			allKYCStatsQueryRes?.data?.stats?.completedToday?.countAll?.toLocaleString(
				"fr-FR"
			) ?? 0
		} comptes`;
		infoData[2][1][0].value.text =
			allKYCStatsQueryRes?.data?.stats?.completedToday?.countAccepted?.toLocaleString(
				"fr-FR"
			) ?? 0;
		infoData[2][1][1].value.text =
			allKYCStatsQueryRes?.data?.stats?.completedToday?.countDeclined?.toLocaleString(
				"fr-FR"
			) ?? 0;
	}

	return (
		<Layout title={"Vérifications KYC V2"}>
			<>
				<section className="px-2">
					<div
						className="mb-10 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1"
						style={{ gap: "20px" }}
					>
						{allKYCStatsQueryRes?.status === "loading" ? (
							<div className="flex justify-center w-full py-10">
								<div className={"loadingSpinner"}></div>
							</div>
						) : (
							<>
								{infoData.map((data, index) => (
									<InfoCard key={index} data={data} />
								))}
							</>
						)}
					</div>
				</section>
				<section className="my-10">
					<Tabs defaultValue="pending" className="w-full">
						<div className="border-b-0 md:border-b-1">
							<TabsList className="TabsList grid grid-cols-2 md:flex mb-[200px] md:mb-0">
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="pending"
								>
									KYC en cours
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="accepted"
								>
									KYC approuvés
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="declined"
								>
									KYC rejetés
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="none"
								>
									Pas de KYC
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="all"
								>
									Tous les KYC
								</TabsTrigger>
							</TabsList>
						</div>
						<div className={`mt-5`}>
							<TabsContent value="all">
								<KYCAll
									isLoading={
										allKYCQueryRes.status == "loading"
									}
									search={searchKYC}
									setSearch={setSearchKYC}
								/>
							</TabsContent>
							<TabsContent value="accepted">
								<KYCAccepted
									isLoading={
										allKYCAcceptedQueryRes.status ==
										"loading"
									}
									search={searchKYCAccepted}
									setSearch={setSearchKYCAccepted}
								/>
							</TabsContent>
							<TabsContent value="declined">
								<KYCDeclined
									isLoading={
										allKYCDeclinedQueryRes.status ==
										"loading"
									}
									search={searchKYCDeclined}
									setSearch={setSearchKYCDeclined}
								/>
							</TabsContent>
							<TabsContent value="pending">
								<KYCPending
									isLoading={
										allKYCPendingQueryRes.status ==
										"loading"
									}
									search={searchKYCPending}
									setSearch={setSearchKYCPending}
								/>
							</TabsContent>
							<TabsContent value="none">
								<KYCNone
									isLoading={
										allKYCNoneQueryRes.status == "loading"
									}
									search={searchKYCNone}
									setSearch={setSearchKYCNone}
								/>
								KYC{" "}
							</TabsContent>
						</div>
					</Tabs>
					{/* <Tabs defaultValue="Dossiers KYC" className="w-full">
					<div className="flex justify-between items-center mt-3 w-full">
						<TabsComponent data={['Dossiers KYC', 'KYC vérifiés', 'KYC approuvés', 'KYC rejetés', 'KYC en attente']} />
						<CButton
							text={'Filtrer par'}
							icon={<HiOutlineFilter/>}
							btnStyle={'green'}
							height={'32px'}
						/>
					</div>
					<TabsContent value="Dossiers KYC">
						<DosiersKYC />
					</TabsContent>
				</Tabs> */}
				</section>
			</>
		</Layout>
	);
}
