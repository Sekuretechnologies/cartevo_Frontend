"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

import { TDataList } from "@/components/cards/InfoCard";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import { isObject } from "@/utils/utils";

import { CustomerService } from "@/api/services/v2/customer";
import BadgeLabel from "@/components/shared/BadgeLabel";
import urls from "@/config/urls";
import { headerCustomersData } from "@/constants/UserAccountData";
import { selectSearchTerm } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import * as CFlags from "country-flag-icons/react/3x2";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

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
	useTitle("Cartevo | Customers", true);

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
						href={`${urls.customers.root}/${item.id}`}
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

				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
