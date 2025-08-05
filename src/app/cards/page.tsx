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
import { TransactionService } from "@/api/services/v2/transaction";
import { headerUserTransactionDataV2 } from "@/constants/TransactionData";
import { headerCardData } from "@/constants/CardData";

const CountryFlags: any = CFlags;

const ItemFlagCM = CountryFlags["CM"];
const ItemFlagUS = CountryFlags["US"];

const getAllTrx = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.status) params.status = filter?.status;
	params.category = "card";
	params.type = "purchase";

	const response = await TransactionService.get_all_trxs(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get users");
	}
	return responseJson.data;
};

export default function Home() {
	useTitle("Cartevo | Cards", true);

	const [searchTrx, setSearchTrx] = useState("");
	const [filterContent, setFilterContent] = useState({});

	// const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

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
	// dispatch(setTrxAll(allTrxQueryRes.data));
	console.log("allTrxQueryRes.data : ", allTrxQueryRes.data);

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */

	rearrangedTableData = allTrxQueryRes?.data?.map((item: any, index: any) => {
		const rearrangedItem = {
			serial: index + 1,
			type: item.card_details.brand,
			number: `${item.card_details.masked_number}`,
			name: item.card_details.name,
			// phone: item.phone_number,
			balance: item.card_details.balance_usd,
			status:
				item.card_details.status === "ACTIVE" ? (
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
					href={`${urls.cards.root}/${item.user_id}`}
					btnStyle={"outlineDark"}
					// icon={<FourDots />}
				/>
			),
		};
		item = rearrangedItem;
		return item;
	});

	return (
		<Layout title={"Cards"}>
			<section className="mt-2">
				<div className="mb-[50px] bg-white  shadow-md rounded-xl p-5">
					{/* <div className="mb-5">
						<Title title={"Users list"} />
					</div> */}
					<CustomTable
						headerData={headerCardData}
						tableData={rearrangedTableData}
						isLoading={allTrxQueryRes?.status == "loading"}
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
