"use client";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { FourDots } from "@/components/shared/icons";
import { selectCurrentCustomerTransfers } from "@/redux/slices/customer";
import { useSelector } from "react-redux";
// import TransactionModal from "@/app/dashboard/v2/wallet_transactions/components/TransactionModal";
import { CustomerService } from "@/api/services/v2/customer";
import { ITableHeader } from "@/components/AdminTable/Table";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import urlsV2 from "@/config/urls_v2";
import { headerUserAccountDataV2 as headerData } from "@/constants/Index";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

const getUserFilleuls = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	let params: any = {};
	if (id) params.sponsor_code = id;
	console.log("getUserFilleuls : ", id, queryKey);
	const response = await CustomerService.get_all_customers(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get user notifications"
		);
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

const Filleuls = ({ search, setSearch }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const customerDetails: any = useSelector(selectCurrentCustomerTransfers);

	const userFilleulsQueryRes = useQuery({
		queryKey: ["userFilleuls", customerDetails?.customer?.sponsorship_code],
		queryFn: getUserFilleuls,
		onError: (err) => {
			toast.error("Failed to get user filleuls.");
		},
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	console.log("userFilleulsQueryRes.data : ", userFilleulsQueryRes?.data);

	const rearrangedTableData = userFilleulsQueryRes?.data?.map(
		(item: any, index: any) => {
			const rearrangedItem = {
				serial: index + 1,
				name: `${item.last_name} ${item.first_name}`,
				country:
					item.country.includes("Congo") &&
					item.country.includes("Democratic")
						? "Congo RDC"
						: item.country,
				phone: item.country_phone_code
					? `${item.country_phone_code} ${item.phone}`
					: item.phone,
				email: item.email,
				solde: item.balance_xaf?.toLocaleString("fr-FR"),
				soldeStandby:
					item.old_balance_xaf?.toLocaleString("fr-FR") ?? 0,
				nbCartes: item.number_of_cards, //item.numberOfCards,
				totalTrx:
					item.total_transaction_amount?.toLocaleString("fr-FR"), // item.totalTransactionAmount.toLocaleString('fr-FR'),
				avgTrx: item.average_transaction_amount
					? Math.round(
							item.average_transaction_amount
					  )?.toLocaleString("fr-FR")
					: 0, // item.avgTransactionAmount ? Math.round(item.avgTransactionAmount).toLocaleString('fr-FR') : 0,
				oldNew: item.is_v1 ? (
					<LabelWithBadge label="Ancien" badgeColor="#000" />
				) : (
					<LabelWithBadge label="Nouveau" badgeColor="#1F66FF" />
				),
				kyc:
					item.kyc_result == "APPROVED" ? (
						<LabelWithBadge label="Approuvé" badgeColor="#1F66FF" />
					) : item.kyc_result == "DECLINED" ? (
						<LabelWithBadge label="Refusé" badgeColor="#F85D4B" />
					) : item.kyc_status == "PENDING" ? (
						<LabelWithBadge label="En cours" badgeColor="#999" />
					) : (
						<LabelWithBadge label="Aucun" badgeColor="#000" />
					),
				status: <ActiveYesNo isActive={item.active} />,
				locked: (
					<ActiveYesNo
						isActive={item.blocked}
						colorActive={"#F85D4B"}
						labelActive={"Bloqué"}
						labelInactive={"Non"}
					/>
				),
				date: getFormattedDateTime(item.created_at), //item.date,
				actions: (
					<CButton
						text={"Manager"}
						href={`${urlsV2.usersAccounts.manage}/${item.id}`}
						btnStyle={"dark"}
						icon={<FourDots />}
					/>
				),
			};
			item = rearrangedItem;
			return item;
		}
	);

	return (
		<section className="p-0 md:p-6 pt-6 md:pt-0">
			<div className="my-[50px]">
				<div className="mb-5">
					<Title title={"Liste des filleuls"} />
				</div>
				<CustomTable
					headerData={headerData}
					tableData={rearrangedTableData}
					threeButtons
					search={search}
					setSearch={setSearch}
				/>
			</div>
		</section>
	);
};

export default Filleuls;
