"use client";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Modal from "@/components/shared/Modal/Modal";
import urls from "@/config/urls";
import { headerCardData } from "@/constants/CardData";
import {
	selectCurrentCustomerCards,
	selectCurrentCustomerDetails,
} from "@/redux/slices/customer";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useSelector } from "react-redux";
import CardDetailsModal from "./modals/CardDetailsModal";
import AddCardModal from "./modals/AddCardModal";
import { sortByCreatedAtDescending } from "@/utils/utils";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Cards = ({ search, setSearch }: Props) => {
	const [filterContent, setFilterContent] = useState({});

	const customerCards: any = useSelector(selectCurrentCustomerCards);

	const [isOpen, setIsOpen] = useState<boolean | string | number>(false);

	const sortedCards = sortByCreatedAtDescending([...customerCards]);

	const rearrangedTableData = sortedCards?.map((item: any, index: any) => {
		let mode;
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
				<>
					<div className="flex gap-5">
						<CButton
							text={"Details"}
							// onClick={() => setIsOpen(index)}
							btnStyle={"outlineDark"}
							href={`${urls.cards.root}/${item.id}`}
							// icon={<FourDots />}
						/>
						{/* <Modal
							index={`${index}`}
							name={"cardDetails"}
							isOpen={isOpen === index}
							setIsOpen={setIsOpen}
							modalContent={
								<CardDetailsModal
									setIsOpen={setIsOpen}
									item={item}
								/>
							}
						/> */}
					</div>
				</>
			),
		};

		item = rearrangedItem;
		return item;
	});

	return (
		<section className="p-0 md:p-6 pt-6 md:pt-0">
			<div className="my-[30px]">
				{/* <div className="mb-5">
					<Title title={"Liste des transactions"} />
				</div> */}

				<CustomTable
					headerData={headerCardData}
					tableData={rearrangedTableData}
					// isLoading={allTrxQueryRes?.status == "loading"}
					// threeButtons
					search={search}
					setSearch={setSearch}
					filter
					filterType={"transaction"}
					filterContent={filterContent}
					setFilterContent={setFilterContent}
					btn={
						<CButton
							text={"Add card"}
							btnStyle={"blue"}
							onClick={() => setIsOpen("addCard")}
							icon={<HiPlus />}
							// width={"150px"}
							height={"33px"}
						/>
					}
				/>

				{/* Add Card Modal */}
				<Modal
					index={"addCard"}
					name={"addCard"}
					isOpen={isOpen === "addCard"}
					setIsOpen={setIsOpen}
					modalContent={<AddCardModal setIsOpen={setIsOpen} />}
				/>
			</div>
		</section>
	);
};

export default Cards;
