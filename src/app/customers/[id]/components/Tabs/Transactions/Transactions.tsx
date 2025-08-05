"use client";
import { DataTable } from "@/components/Tables/DataTable";
import { data } from "@/constants/Index";
import { columns } from "@/components/Tables/Column";
import BtnTrio from "@/components/shared/BtnTrio";
import SearchBar from "@/components/shared/SearchBar";
import { Separator } from "@/components/ui/separator";
import Title from "@/components/shared/Title";
import CustomTable from "@/components/shared/CustomTable";
import { headerUserAccountData, tableUserAccountData } from "@/constants/Index";
import CButton from "@/components/shared/CButton";
import { FaLock, FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { FourDots } from "@/components/shared/icons";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { IoEllipsisHorizontalCircleSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectCurrentCustomerTransactions } from "@/redux/slices/customer";
import TransactionModal from "./modals/TransactionModal";
import Modal from "@/components/shared/Modal/Modal";
import {
	headerTransactionData,
	headerUserTransactionDataV2,
} from "@/constants/TransactionData";
import {
	categoryType,
	categoryMode,
	getCategoryMode,
	getCategoryTypeV2,
	getCategoryModeV2,
} from "@/utils/graphs";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useState } from "react";
import BadgeLabel from "@/components/shared/BadgeLabel";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Transactions = ({ search, setSearch }: Props) => {
	const [filterContent, setFilterContent] = useState({});

	const customerDetails: any = useSelector(selectCurrentCustomerTransactions);

	const [isOpen, setIsOpen] = useState(false);

	const rearrangedTableData = customerDetails?.transactions?.data?.map(
		(item: any, index: any) => {
			let mode;
			const rearrangedItem = {
				serial: index + 1,
				type: getCategoryTypeV2(item.category, item.type),
				name: item.merchant?.name,
				country: item.country,
				phone: item.phone_number,
				idTrx: item.id,
				amount: item.amount_xaf?.toLocaleString("en-EN") ?? 0,
				status:
					item.status == "SUCCESS" ? (
						<BadgeLabel
							className={`text-xs`}
							label={"Réussi"}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : item.status == "FAILED" ? (
						<BadgeLabel
							className={`text-xs`}
							label={"Echec"}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : item.status?.toUpperCase() == "PENDING" ? (
						<BadgeLabel
							className={`text-xs`}
							label={"En cours"}
							badgeColor={"#FFAC1C"}
							textColor={"#444"}
						/>
					) : item.status == "CANCELLED" ||
					  item.status == "CANCELED" ? (
						<BadgeLabel
							className={`text-xs`}
							label={"Suspendu"}
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
								// icon={<FourDots />}
							/>
							<Modal
								index={`${index}`}
								name={"pending"}
								isOpen={isOpen === index}
								setIsOpen={setIsOpen}
								modalContent={
									<TransactionModal
										setIsOpen={setIsOpen}
										customer={customerDetails?.customer}
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

	return (
		<section className="p-0 md:p-6 pt-6 md:pt-0">
			<div className="my-[30px]">
				{/* <div className="mb-5">
					<Title title={"Liste des transactions"} />
				</div> */}
				<CustomTable
					headerData={headerTransactionData}
					tableData={rearrangedTableData}
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

export default Transactions;
