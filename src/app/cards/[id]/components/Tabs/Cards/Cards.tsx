"use client";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import urls from "@/config/urls";
import { headerCardData } from "@/constants/CardData";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useState } from "react";
import { useSelector } from "react-redux";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Cards = ({ search, setSearch }: Props) => {
	const [filterContent, setFilterContent] = useState({});

	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const [isOpen, setIsOpen] = useState(false);

	const rearrangedTableData = customerDetails?.cards?.data?.map(
		(item: any, index: any) => {
			let mode;
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
				/>
			</div>
		</section>
	);
};

export default Cards;
