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
import { CardService } from "@/api/services/cartevo-api/card";
import { headerCardData } from "@/constants/CardData";

const CountryFlags: any = CFlags;

const ItemFlagCM = CountryFlags["CM"];
const ItemFlagUS = CountryFlags["US"];

const getAllCards = async ({ queryKey }: any) => {
	const [_key, filter, st] = queryKey;
	const token = localStorage.getItem("sktoken");

	if (!token) {
		throw new Error("No authentication token found");
	}

	let params: any = {};
	if (st) params.searchTerm = st;
	if (filter?.status) params.status = filter.status;

	const response = await CardService.get_cards({
		token,
		page: 1,
		limit: 20,
		status: params.status,
	});

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get cards");
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

	const allCardsQueryRes = useQuery({
		queryKey: ["allCards", filterContent, searchTrx],
		queryFn: getAllCards,
		onError: (err) => {
			toast.error("Failed to get cards.");
			console.log("Failed to get cards : ", err);
		},
		// enabled: false,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	// dispatch(setTrxAll(allCardsQueryRes.data));
	console.log("allCardsQueryRes.data : ", allCardsQueryRes.data);

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */

	rearrangedTableData = allCardsQueryRes?.data?.map(
		(item: any, index: any) => {
			const rearrangedItem = {
				serial: index + 1,
				type: item.brand,
				number: `${item.masked_number}`,
				name: item.name,
				// phone: item.phone_number,
				balance: item.balance_usd,
				status:
					item.status === "ACTIVE" ? (
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
						href={`${urls.cards.root}/${item.id}`}
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
		<Layout title={"Cards"}>
			<section className="mt-2">
				<div className="mb-[50px] bg-white  shadow-md rounded-xl p-5">
					{/* <div className="mb-5">
						<Title title={"Users list"} />
					</div> */}
					<CustomTable
						headerData={headerCardData}
						tableData={rearrangedTableData}
						isLoading={allCardsQueryRes?.status == "loading"}
						// threeButtons
						filter
						filterType={"card"}
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
