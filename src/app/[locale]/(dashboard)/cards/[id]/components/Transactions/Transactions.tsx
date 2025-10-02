"use client";
import { DataTable } from "@/components/Tables/DataTable";
import { data } from "@/constants/Index";
import { columns } from "@/components/Tables/Column";
import BtnTrio from "@/components/shared/BtnTrio";
import SearchBar from "@/components/shared/SearchBar";
import { Separator } from "@/components/ui/separator";
import Title from "@/components/shared/Title";
import { useTranslation } from "@/hooks/useTranslation";
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
import { selectCardTransactions } from "@/redux/slices/card";
import { sortByCreatedAtDescending } from "@/utils/utils";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Transactions = ({ search, setSearch }: Props) => {
	const { t }: { t: any } = useTranslation();
	const [filterContent, setFilterContent] = useState({});

	const cardTransactions: any = useSelector(selectCardTransactions);

	const [isOpen, setIsOpen] = useState(false);

	const sortedTransactions = sortByCreatedAtDescending([...cardTransactions]);

	const rearrangedTableData = sortedTransactions?.map(
		(item: any, index: any) => {
			let mode;
			const rearrangedItem = {
				serial: index + 1,
				type: getCategoryTypeV2(item.category, item.type),
				name: item.merchant?.name,
				// country: item.country,
				// phone: item.phone_number,
				idTrx: item.id,
				amount: item.amount?.toLocaleString("en-EN") ?? 0,
				status:
					item.status == "SUCCESS" ? (
						<BadgeLabel
							className={`text-xs`}
							label={t.wallets.labels.status.success}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : item.status == "FAILED" ? (
						<BadgeLabel
							className={`text-xs`}
							label={t.wallets.labels.status.failed}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : item.status?.toUpperCase() == "PENDING" ? (
						<BadgeLabel
							className={`text-xs`}
							label={t.wallets.labels.status.pending}
							badgeColor={"#FFAC1C"}
							textColor={"#444"}
						/>
					) : item.status == "CANCELLED" ||
					  item.status == "CANCELED" ? (
						<BadgeLabel
							className={`text-xs`}
							label={t.wallets.labels.status.cancelled}
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
								text={t.cards.details.actions.details}
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

	return (
		<section className="p-0 md:p-6 pt-6 md:pt-0">
			<div className="">
				<div className="mb-5">
					<Title size={20} title={t.cards.details.transactions.title} />
				</div>
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
