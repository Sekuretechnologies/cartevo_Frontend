"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

import { TDataList } from "@/components/cards/InfoCard";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import { isObject, sortByCreatedAtDescending } from "@/utils/utils";

import { CustomerService } from "@/api/services/cartevo-api/customer";
import BadgeLabel from "@/components/shared/BadgeLabel";
import urls from "@/config/urls";
import { selectCurrentToken } from "@/redux/slices/auth";
import { selectSearchTerm } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
import { HiPlus } from "react-icons/hi";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import { ITableHeader } from "@/components/AdminTable/Table";

const getAllCustomers = async ({ queryKey }: any) => {
	const [_key, token, st, filterContent] = queryKey;
	let params: any = { token };
	if (st) params.searchTerm = st;

	if (isObject(filterContent)) {
		Object.entries(filterContent).map(([key, value]: any[]) => {
			if (value && value !== "all") params[key] = value;
		});
	}
	console.log("getAllCustomers searchTerm : ", st);
	console.log("getAllCustomers filterContent : ", filterContent);
	console.log("getAllCustomers params : ", params);

	console.log("get Company Customers accessToken :: ", token);

	const response = await CustomerService.get_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get customers");
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};

export default function Customers() {
	const { t } = useTranslation();
	const customerTranslate = t.customers;
	const headerTrans = t.customers.headerTable;
	const status = t.status;
	useTitle("Cartevo | Customers", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const [filterContent, setFilterContent] = useState({});
	const [statsData, setStatsData] = useState<TDataList[]>();
	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	const searchTerm: string = useSelector(selectSearchTerm);
	const { createLocalizedLink } = useLocalizedNavigation();

	const allCustomersQueryRes = useQuery({
		queryKey: ["allCustomers", currentToken, searchTerm, filterContent],
		queryFn: getAllCustomers,
		onError: (err) => {
			toast.error("Failed to get customers.");
		},
		// enabled: false,
		refetchInterval: 560000, // Fetches data every 60 seconds
	});

	console.log("allCustomersQueryRes.data : ", allCustomersQueryRes.data);

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	if (allCustomersQueryRes?.data) {
		const sortedTransactions = sortByCreatedAtDescending([
			...allCustomersQueryRes?.data,
		]);

		rearrangedTableData = sortedTransactions?.map(
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
						? `${item.country_phone_code} ${item.phone_number}`
						: item.phone_number,
					email: item.email,
					// balance: item.balance_xaf?.toLocaleString("en-EN"),
					// nbCards: item.number_of_cards, //item.numberOfCards,

					status: item.is_active ? (
						<BadgeLabel
							className={`text-xs`}
							label={status.active}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : (
						<BadgeLabel
							className={`text-xs`}
							label={status.active}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					), //<ActiveYesNo isActive={item.active} />,
					date: getFormattedDateTime(item.created_at, "en"), //item.date,
					actions: (
						<CButton
							text={"Details"}
							href={createLocalizedLink(
								`${urls.customers.root}/${item.id}`
							)}
							btnStyle={"outlineDark"}
							// icon={<FourDots />}
						/>
					),
				};
				item = rearrangedItem;
				return item;
			}
		);
	}

	const headerCustomersData: ITableHeader = {
		serial: "#",
		name: headerTrans.name,
		country: headerTrans.country,
		phone: headerTrans.phone,
		email: headerTrans.email,
		// "balance": "Balance",
		// nbCards: "Nb. Cards",
		// "kyc": "KYC",
		status: "Status",
		// locked: "Bloqué",
		date: "Date",
		edit: "",
	};

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
						isLoading={allCustomersQueryRes.status == "loading"}
						filter
						filterType={"transaction"}
						filterContent={filterContent}
						setFilterContent={setFilterContent}
						btn={
							<CButton
								text={customerTranslate.newCustomers}
								btnStyle={"blue"}
								href={createLocalizedLink("/customers/create")}
								icon={<HiPlus />}
								// width={"150px"}
								height={"33px"}
							/>
						}
					/>
				</div>

				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
