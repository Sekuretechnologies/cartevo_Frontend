import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { FourDots } from "@/components/shared/icons";
import {
	headerCardTopupDataV2,
	headerTransactionDataV2,
} from "@/constants/TransactionData";
import { selectTrxSuccess } from "@/redux/slices_v2/nairapay";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { getCategoryModeV2, getCategoryTypeV2 } from "@/utils/graphs";
import { usePathname } from "next/navigation";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import TransactionModal from "./modals/TransactionModal";
import Modal from "@/components/shared/Modal/Modal";
import { useState } from "react";
type Props = {
	isLoading?: boolean;
	search?: string;
	setSearch?: (data?: any) => void;
};
export default function Index({ isLoading, search, setSearch }: Props) {
	const pathname = usePathname();
	const trxAll: any = useSelector(selectTrxSuccess);
	const [isOpen, setIsOpen] = useState(false);

	const rearrangedTableData = trxAll?.map((item: any, index: any) => {
		const rearrangedItem = {
			serial: index + 1,
			type: getCategoryTypeV2(item.category, item.type),
			country: item.country,
			phone: item.phone_number,
			idTrx: item.trx_ref,
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
			fee: item.fee?.toLocaleString("fr-FR") ?? 0,
			method: item.method,
			//item.mode, //item.paymentMethod,
			mode:
				getCategoryModeV2(item.category, item.type, item.mode).mode ==
				"CREDIT" ? (
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
				) : item.status == "CANCELLED" || item.status == "CANCELED" ? (
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
									customer={item?.user_details}
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
	});

	return (
		<section>
			<CustomTable
				headerData={headerCardTopupDataV2}
				tableData={rearrangedTableData}
				filter
				threeButtons
				isLoading={isLoading && !trxAll}
				search={search}
				setSearch={setSearch}
			/>
		</section>
	);
}
