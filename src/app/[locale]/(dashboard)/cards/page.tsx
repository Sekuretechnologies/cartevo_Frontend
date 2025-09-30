"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import { sortByCreatedAtDescending } from "@/utils/utils";

import { CardService } from "@/api/services/cartevo-api/card";
import BadgeLabel from "@/components/shared/BadgeLabel";
import urls from "@/config/urls";
import { headerCardData } from "@/constants/CardData";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { selectSearchTerm } from "@/redux/slices/search";
import { getFormattedDateTime } from "@/utils/DateFormat";
import * as CFlags from "country-flag-icons/react/3x2";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import CreateCardModal from "./components/modals/CreateCardModal";

const CountryFlags: any = CFlags;

const ItemFlagCM = CountryFlags["CM"];
const ItemFlagUS = CountryFlags["US"];

const getAllCards = async ({ queryKey }: any) => {
	const [_key, token, filter, st] = queryKey;

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

export default function Cards() {
	useTitle("Cartevo | Cards", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const [searchTrx, setSearchTrx] = useState("");
	const [filterContent, setFilterContent] = useState({});
	const { createLocalizedLink } = useLocalizedNavigation();

	// const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	const allCardsQueryRes = useQuery({
		queryKey: ["allCards", currentToken, filterContent, searchTrx],
		queryFn: getAllCards,
		onError: (err) => {
			toast.error("Failed to get cards.");
			console.log("Failed to get cards : ", err);
		},
		// enabled: false,
		enabled: !!currentToken,
		refetchInterval: 30000, // Fetches data every 30 seconds
	});
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	// dispatch(setTrxAll(allCardsQueryRes.data));
	console.log("allCardsQueryRes.data : ", allCardsQueryRes.data);

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	if (allCardsQueryRes?.data) {
		const sortedTransactions = sortByCreatedAtDescending([
			...allCardsQueryRes?.data,
		]);

		rearrangedTableData = sortedTransactions?.map(
			(item: any, index: any) => {
				const rearrangedItem = {
					serial: index + 1,
					type: item.brand,
					number: `${item.masked_number}`,
					name: item.name,
					// phone: item.phone_number,
					balance: item.balance,
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
							href={createLocalizedLink(
								`${urls.cards.root}/${item.id}`
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
						btn={
							<CButton
								text={"Create Card"}
								btnStyle={"blue"}
								icon={<Plus size={18} color="#fff" />}
								height={"33px"}
								onClick={() => setIsCreateOpen(true)}
							/>
						}
						// generateExcel={() => mutationExcel.mutate()}
					/>
				</div>
				{isCreateOpen ? (
					<CreateCardModal
						isOpen={isCreateOpen}
						setIsOpen={setIsCreateOpen}
					/>
				) : null}

				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
