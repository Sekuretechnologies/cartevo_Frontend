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
import WalletCardGrid from "@/components/cards/WalletCardGrid";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import * as CFlags from "country-flag-icons/react/3x2";
import { headerCustomersData } from "@/constants/UserAccountData";
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
	useTitle("Cartevo | Users", true);

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
				// balance: item.balance_xaf?.toLocaleString("en-EN"),
				nbCards: item.number_of_cards, //item.numberOfCards,

				status: item.active ? (
					<BadgeLabel
						className={`text-xs`}
						label={"Active"}
						badgeColor={"#1F66FF"}
						textColor={"#444"}
					/>
				) : (
					<BadgeLabel
						className={`text-xs`}
						label={"Inactive"}
						badgeColor={"#F85D4B"}
						textColor={"#444"}
					/>
				), //<ActiveYesNo isActive={item.active} />,
				date: getFormattedDateTime(item.created_at, "en"), //item.date,
				actions: (
					<CButton
						text={"Details"}
						href={`${urlsV2.usersAccounts.manage}/${item.id}`}
						btnStyle={"outlineDark"}
						// icon={<FourDots />}
					/>
				),
			};
			item = rearrangedItem;
			return item;
		}
	);

	return (
		<Layout title={"Customers"}>
			<section className="mt-2">
				<div className="mb-[50px] bg-white  shadow-md rounded-xl p-5">
					{/* <div className="mb-5">
						<Title title={"Users list"} />
					</div> */}
					<CustomTable
						headerData={headerCustomersData}
						tableData={rearrangedTableData}
						isLoading={allUsersQueryRes.status == "loading"}
						// threeButtons
						filter
						filterType={"transaction"}
						filterContent={filterContent}
						setFilterContent={setFilterContent}
						// generateExcel={() => mutationExcel.mutate()}
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
