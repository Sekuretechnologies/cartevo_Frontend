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
import { selectCurrentCustomerTransfers } from "@/redux/slices/customer";
import TransactionModal from "./modals/NotificationModal";
// import TransactionModal from "@/app/dashboard/v2/wallet_transactions/components/TransactionModal";
import Modal from "@/components/shared/Modal/Modal";
import {
	categoryType,
	categoryMode,
	getCategoryMode,
	getCategoryTypeV2,
} from "@/utils/graphs";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { transformArray } from "@/utils/utils";
import { useState } from "react";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import { ITableHeader } from "@/components/AdminTable/Table";
import NotificationModal from "./modals/NotificationModal";
import { NotificationService } from "@/api/services/v2/notification";

const getUserNotifications = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	let params: any = {};
	if (id) params.customerId = id;
	// console.log("getCustomers searchTerm : ", st, queryKey);
	const response = await NotificationService.get_user_notifcations(params);
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

const headerData: ITableHeader = {
	date: "Date",
	title: "Titre",
	content: "Contenu",
	action: "",
};

const Notifications = ({ search, setSearch }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const customerDetails: any = useSelector(selectCurrentCustomerTransfers);

	const userNotificationsQueryRes = useQuery({
		queryKey: ["userNotifications", customerDetails?.customer?.id],
		queryFn: getUserNotifications,
		onError: (err) => {
			toast.error("Failed to get user notifications.");
		},
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	console.log(
		"userNotificationsQueryRes.data : ",
		userNotificationsQueryRes?.data
	);

	const rearrangedTableData = userNotificationsQueryRes?.data?.map(
		(item: any, index: any) => {
			const rearrangedItem = {
				date: getFormattedDateTime(item?.created_at),
				title: item?.title,
				content: item?.text,
				// actions: (
				// 	<>
				// 		<div className="flex gap-5">
				// 			<CButton
				// 				text={"Details"}
				// 				// href={`?transaction${index + 1}=true`}
				// 				onClick={() => setIsOpen(index)}
				// 				btnStyle={"dark"}
				// 				icon={<FourDots />}
				// 			/>
				// 			<Modal
				// 				index={`${index}`}
				// 				name={"pending"}
				// 				isOpen={isOpen === index}
				// 				setIsOpen={setIsOpen}
				// 				modalContent={
				// 					<NotificationModal
				// 						setIsOpen={setIsOpen}
				// 						customer={item?.userDetails}
				// 						recipient={item?.recipientDetails}
				// 						item={item}
				// 					/>
				// 				}
				// 			/>
				// 		</div>
				// 	</>
				// ),
			};
			item = rearrangedItem;
			return item;
		}
	);

	return (
		<section className="p-0 md:p-6 pt-6 md:pt-0">
			<div className="my-[50px]">
				<div className="mb-5">
					<Title title={"Liste des notifications"} />
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

export default Notifications;
