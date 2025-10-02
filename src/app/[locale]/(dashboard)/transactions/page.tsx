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
import { IGenericRow, ITableHeader } from "@/components/AdminTable/Table";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import ButtonOutlined from "@/components/shared/ButtonOutlined";
import { FourDots } from "@/components/shared/icons";
import { isObject, isString, sortByCreatedAtDescending } from "@/utils/utils";
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
import TransactionModal from "../cards/[id]/components/Transactions/modals/TransactionModal";
import { headerUserTransactionDataV2 } from "@/constants/TransactionData";
import BadgeLabel from "@/components/shared/BadgeLabel";
import { CompanyService } from "@/api/services/cartevo-api/company";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useTranslation } from "@/hooks/useTranslation";

const CountryFlags: any = CFlags;

const ItemFlagCM = CountryFlags["CM"];
const ItemFlagUS = CountryFlags["US"];

const getCompanyTransactions = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	// console.log("getCustomers searchTerm : ", st, queryKey);

	const response = await CompanyService.get_transactions({ token });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get company transactions"
		);
	}
	return responseJson.data;
};

export default function Home() {
	useTitle("Cartevo | transactions", true);
	const { t } = useTranslation();
	const transactionTrans = t.transaction;
	const statusTrans = t.status;

	const currentToken: any = useSelector(selectCurrentToken);
	const [filterContent, setFilterContent] = useState({});
	const [statsData, setStatsData] = useState<TDataList[]>();
	const [isOpen, setIsOpen] = useState<number | false>(false);

	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	//------------------------------------------------
	const companyTransactionsQueryRes = useQuery({
		queryKey: ["companyTransactions", currentToken],
		queryFn: getCompanyTransactions,
		onError: (err) => {
			toast.error(
				"Failed to get user Transactions : " +
					"2920c23e-3389-4caf-ba26-569683eb4b7a"
			);
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	// dispatch(setCurrentCustomerTransactions(companyTransactionsQueryRes.data));
	console.log(
		"companyTransactionsQueryRes.data : ",
		companyTransactionsQueryRes.data
	);
	const userTransactionsData = companyTransactionsQueryRes.data;

	//------------------------------------------------

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	const { shiftDown, iPressed, ePressed } = useKeyPressed();
	const headerAllTransactionData: ITableHeader = {
		serial: "#",
		type: transactionTrans.type,
		name: transactionTrans.merchant,
		country: transactionTrans.counrtry,
		wallet: transactionTrans.wallet,
		card: transactionTrans.card,
		phone: transactionTrans.phone,
		idTrx: transactionTrans.idTrans,
		// refTrx: "Ref Transaction",
		currency: transactionTrans.currency,
		amount: transactionTrans.amount,
		// method: "Methode",
		// mode: "Mode",
		status: "Status",
		date: "Date",
		edit: "",
	};

	if (companyTransactionsQueryRes.data) {
		const sortedTransactions = sortByCreatedAtDescending([
			...companyTransactionsQueryRes.data,
		]);
		rearrangedTableData = sortedTransactions?.map(
			(item: any, index: any) => {
				const rearrangedItem = {
					serial: index + 1,
					type: getCategoryTypeV2(item.category, item.type),
					name: item.merchant?.name,
					country: item.country,
					wallet: `${item.wallet?.country_iso_code || ""} - ${
						item.wallet?.currency || ""
					}`,
					card: item.card?.masked_number,
					phone: item.phone_number,
					idTrx: item.id,
					currency: item.currency,
					amount: item.amount?.toLocaleString("en-EN") ?? 0,
					status:
						item.status == "SUCCESS" ? (
							<BadgeLabel
								className={`text-xs`}
								label={statusTrans.success}
								badgeColor={"#1F66FF"}
								textColor={"#444"}
							/>
						) : item.status == "FAILED" ? (
							<BadgeLabel
								className={`text-xs`}
								label={statusTrans.failed}
								badgeColor={"#F85D4B"}
								textColor={"#444"}
							/>
						) : item.status?.toUpperCase() == "PENDING" ? (
							<BadgeLabel
								className={`text-xs`}
								label={statusTrans.pending}
								badgeColor={"#FFAC1C"}
								textColor={"#444"}
							/>
						) : item.status == "CANCELLED" ||
						  item.status == "CANCELED" ? (
							<BadgeLabel
								className={`text-xs`}
								label={statusTrans.canceled}
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
									name={"transactionDetails"}
									isOpen={isOpen === index}
									setIsOpen={setIsOpen}
									modalContent={
										<TransactionModal
											setIsOpen={setIsOpen}
											customer={item?.customer}
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
		<Layout title={"Transactions"}>
			<section className="mt-2">
				<div className="mb-[50px] bg-white  shadow-md rounded-xl p-5">
					{/* <div className="mb-5">
						<Title title={"Last transactions"} />
					</div> */}
					<CustomTable
						headerData={headerAllTransactionData}
						tableData={rearrangedTableData}
						isLoading={
							companyTransactionsQueryRes?.status == "loading"
						}
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
