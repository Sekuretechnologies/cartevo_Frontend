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
import { headerUserTransactionDataV2 } from "@/constants/TransactionData";
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

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Transactions = ({ search, setSearch }: Props) => {
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
				refTrx: item.trx_ref,
				//item.mode, //item.paymentMethod,
				oldNew: !item.is_from_v1 ? (
					<LabelWithBadge
						className={`text-xs`}
						label={`Nouveau`}
						badgeColor={"#1F66FF"}
						textColor={"#444"}
					/>
				) : (
					<LabelWithBadge
						className={`text-xs`}
						label={`Ancien`}
						badgeColor={"#444"}
						textColor={"#444"}
					/>
				),

				amount: item.amount_xaf?.toLocaleString("fr-FR") ?? 0,
				method: item.method,
				//item.mode, //item.paymentMethod,
				mode:
					getCategoryModeV2(item.category, item.type, item.mode)
						.mode == "CREDIT" ? (
						<LabelWithBadge
							icon={<FaLongArrowAltDown color={"#1F66FF"} />}
							className={`text-xs`}
							label={`${
								getCategoryModeV2(
									item.category,
									item.type,
									item.mode
								).text
							}`}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : getCategoryModeV2(item.category, item.type, item.mode)
							.mode == "DEBIT" ? (
						<LabelWithBadge
							icon={<FaLongArrowAltUp color={"#F85D4B"} />}
							className={`text-xs`}
							label={`${
								getCategoryModeV2(
									item.category,
									item.type,
									item.mode
								).text
							}`}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : (
						<>{item.mode}</>
					),
				status:
					item.status == "SUCCESS" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Réussi"}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : item.status == "FAILED" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Echec"}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : item.status?.toUpperCase() == "PENDING" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"En cours"}
							badgeColor={"orange"}
							textColor={"#444"}
						/>
					) : item.status == "INITIATED" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Initial"}
							badgeColor={"#007FFF"}
							textColor={"#444"}
						/>
					) : item.status == "CANCELLED" ||
					  item.status == "CANCELED" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Suspendu"}
							badgeColor={"#444"}
							textColor={"#444"}
						/>
					) : (
						<></>
					),
				// <LabelWithBadge className={`text-xs`} label={'En cours'} badgeColor={'#000'} textColor={'#000'}/>
				// <ActiveYesNo isActive={item.status} label="Réussi"/>
				// :<ActiveYesNo isActive={item.status} label="Echec"/>
				date: getFormattedDateTime(item.created_at),
				actions: (
					<>
						<div className="flex gap-5">
							<CButton
								text={"Details"}
								// href={`?transaction${index + 1}=true`}
								onClick={() => setIsOpen(index)}
								btnStyle={"dark"}
								icon={<FourDots />}
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
			<div className="w-full flex flex-col md:flex-row gap-10 md:gap-0 justify-start items-center">
				<div className="pr-10">
					<h1 className="text-sm font-semibold mb-2">
						Nombre de transactions
						<span className="text-base font-semibold text-[#18BC7A] ml-5">
							{customerDetails?.transactions?.stats?.totalCount ??
								0}
						</span>
					</h1>
					<div className="flex justify-start items-center gap-10 w-full">
						<p
							title="Réussis"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							{/* Actives  */}
							<FaCheckCircle size={24} color="#1F66FF" />
							<span className="ml-1 font-bold">
								{customerDetails?.transactions?.stats
									?.totalSuccessCount ?? 0}
							</span>
						</p>
						<p
							title="En cours"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							<IoEllipsisHorizontalCircleSharp
								size={24}
								color="#777"
							/>
							<span className="ml-1 font-bold">
								{customerDetails?.transactions?.stats
									?.totalPendingCount ?? 0}
							</span>
						</p>
						<p
							title="Echoués"
							className=" flex items-center gap-2 text-sm font-normal"
						>
							<IoMdCloseCircle size={24} color="#F85D4B" />
							<span className="ml-1 font-bold">
								{customerDetails?.transactions?.stats
									?.totalFailedCount ?? 0}
							</span>
						</p>
					</div>
				</div>
				{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
				<div className="h-full pt-2 border-l-1 px-10">
					<h1 className="text-sm font-bold mb-2">
						Total transactions réussies
					</h1>
					<p className="text-xl font-bold text-[#18BC7A]">
						{customerDetails?.transactions?.stats?.totalSuccessAmount?.toLocaleString(
							"fr-FR"
						) ?? 0}{" "}
						XAF
					</p>
				</div>
				{/* <Separator orientation="vertical" className="h-10 mr-10" /> */}
				<div className="h-full border-l-1 px-10">
					<h1 className="text-sm font-bold mb-2">
						moyenne par semaine
					</h1>
					<p className="text-xl font-bold text-[#18BC7A]">
						{Math.round(
							customerDetails?.transactions?.stats
								?.averageTransactionsPerWeek?.amount ?? 0
						)?.toLocaleString("fr-FR") ?? 0}{" "}
						XAF / sem
					</p>
				</div>
			</div>
			<div className="my-[50px]">
				<div className="mb-5">
					<Title title={"Liste des transactions"} />
				</div>
				<CustomTable
					headerData={headerUserTransactionDataV2}
					tableData={rearrangedTableData}
					threeButtons
					search={search}
					setSearch={setSearch}
				/>
			</div>
		</section>
	);
};

export default Transactions;
