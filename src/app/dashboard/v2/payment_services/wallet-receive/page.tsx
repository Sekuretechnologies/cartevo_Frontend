"use client";

import Layout from "@/components/shared/Layout";
// import TabsComponent from "@/components/shared/TabsComponent";
import CButton from "@/components/shared/CButton";
import { FaFilter } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrxAll from "./components/Tabs/TrxAll";
import TrxSuccess from "./components/Tabs/TrxSuccess";
import TrxFailed from "./components/Tabs/TrxFailed";
import TrxPending from "./components/Tabs/TrxPending";
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
	setTrxAll,
	setTrxPending,
	setTrxSuccess,
	setTrxFailed,
} from "@/redux/slices_v2/nairapay";
import { selectSearchTerm } from "@/redux/slices/search";
import { useState } from "react";
import Title from "@/components/shared/Title";
import StatsToday from "./components/StatsToday";
import StatsDaily from "./components/StatsDaily";
import { TransactionService } from "@/api/services/v2/transaction";

const getAllTrx = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.status) params.status = filter?.status;
	params.category = "wallet";
	params.type = "receive";

	const response = await TransactionService.get_all_trxs(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get transactions");
	}
	return responseJson.data;
};

// const getKYCStats = async () => {
//   const response = await CustomerService.get_kyc_stats();
//   const responseJson = await response.json();
//   if (!response.ok) {
//     throw new Error(responseJson.message || 'Failed to get users statistics');
//   }
//   // console.log("getKYCStats.data : ", responseJson.data);
//   return responseJson.data;
// };

export default function Index() {
	useTitle("Wallet | Receive", true);
	const [searchTrx, setSearchTrx] = useState("");
	const [searchTrxSuccess, setSearchTrxSuccess] = useState("");
	const [searchTrxPending, setSearchTrxPending] = useState("");
	const [searchTrxFailed, setSearchTrxFailed] = useState("");

	const dispatch = useDispatch();
	const searchTerm: string = useSelector(selectSearchTerm);

	// const allKYCStatsQueryRes = useQuery({
	//     queryKey: ["allKYCStats"],
	//     queryFn: getKYCStats,
	//     onError: (err) => {
	//       toast.error("Failed to get KYC stats.");
	//       console.log("Failed to get KYC stats : ", err);
	//     },
	//     refetchInterval: 30000, // Fetches data every 30 seconds
	// });

	const allTrxQueryRes = useQuery({
		queryKey: ["allTrx", {}, searchTrx],
		queryFn: getAllTrx,
		onError: (err) => {
			toast.error("Failed to get Trx.");
			console.log("Failed to get Trx : ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setTrxAll(allTrxQueryRes.data));
	console.log("allTrxQueryRes.data : ", allTrxQueryRes.data);

	const allTrxSuccessQueryRes = useQuery({
		queryKey: ["allTrxSuccess", { status: "SUCCESS" }, searchTrxSuccess],
		queryFn: getAllTrx,
		onError: (err) => {
			toast.error("Failed to get Accepted KYC list.");
			console.log("Failed to get Accepted KYC list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setTrxSuccess(allTrxSuccessQueryRes.data));
	console.log("allTrxSuccessQueryRes.data : ", allTrxSuccessQueryRes.data);

	const allTrxPendingQueryRes = useQuery({
		queryKey: ["allTrxPending", { status: "PENDING" }, searchTrxPending],
		queryFn: getAllTrx,
		onError: (err) => {
			toast.error("Failed to get Pending Trx list.");
			console.log("Failed to get Pending Trx list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setTrxPending(allTrxPendingQueryRes.data));
	console.log("allTrxPendingQueryRes.data : ", allTrxPendingQueryRes.data);

	const allTrxFailedQueryRes = useQuery({
		queryKey: ["allTrxFailed", { status: "FAILED" }, searchTrxFailed],
		queryFn: getAllTrx,
		onError: (err) => {
			toast.error("Failed to get Failed Trx list.");
			console.log("Failed to get Failed Trx list: ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	dispatch(setTrxFailed(allTrxFailedQueryRes.data));
	console.log("allTrxFailedQueryRes.data : ", allTrxFailedQueryRes.data);

	return (
		<Layout title={"Reception de paiement"}>
			<>
				<section className="w-full my-[10px]">
					<div className="my-5">
						<Title title={"Evolution des transactions"} />
					</div>
					<Tabs defaultValue="02" className="w-full">
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
								<StatsToday />
							</TabsContent>
							<TabsContent value="02">
								<StatsDaily />
							</TabsContent>
						</div>
					</Tabs>
				</section>
				<section className="my-10">
					<div className="mb-5">
						<Title title={"Liste des transactions"} />
					</div>
					<Tabs defaultValue="pending" className="w-full">
						<div className="border-b-1">
							<TabsList className="TabsList">
								<TabsTrigger
									className="TabsTrigger"
									value="pending"
								>
									En attente
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="success"
								>
									Réussis
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="failed"
								>
									Echoués
								</TabsTrigger>
								<TabsTrigger
									className="TabsTrigger"
									value="all"
								>
									Tous
								</TabsTrigger>
							</TabsList>
						</div>
						<div className={`mt-5`}>
							<TabsContent value="all">
								<TrxAll
									isLoading={
										allTrxQueryRes.status == "loading"
									}
									search={searchTrx}
									setSearch={setSearchTrx}
								/>
							</TabsContent>
							<TabsContent value="success">
								<TrxSuccess
									isLoading={
										allTrxSuccessQueryRes.status ==
										"loading"
									}
									search={searchTrxSuccess}
									setSearch={setSearchTrxSuccess}
								/>
							</TabsContent>
							<TabsContent value="failed">
								<TrxFailed
									isLoading={
										allTrxFailedQueryRes.status == "loading"
									}
									search={searchTrxFailed}
									setSearch={setSearchTrxFailed}
								/>
							</TabsContent>
							<TabsContent value="pending">
								<TrxPending
									isLoading={
										allTrxPendingQueryRes.status ==
										"loading"
									}
									search={searchTrxPending}
									setSearch={setSearchTrxPending}
								/>
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
