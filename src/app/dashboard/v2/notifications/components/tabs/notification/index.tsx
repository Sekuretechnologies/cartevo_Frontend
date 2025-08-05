import React, { useState } from "react";
import Title from "@/components/shared/Title";
import NotificationForm from "./NotificationForm";
import NotificationsDropdown from "../../NotificationsDropdown";
import CustomTable from "@/components/shared/CustomTable";
import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import { IGenericRow, ITableHeader } from "@/components/AdminTable/Table";
import { useQuery } from "react-query";
import { NotificationService } from "@/api/services/v2/notification";
import toast from "react-hot-toast";
import { getFormattedDateTime } from "@/utils/DateFormat";

const headerData: ITableHeader = {
	date: "Date",
	customers: "Destinataires",
	title: "Titre",
	content: "Contenu",
	action: "",
};

const getAllNotifications = async ({ queryKey }: any) => {
	const [_key, st] = queryKey;
	let params: any = {};
	if (st) params.searchTerm = st;
	// console.log("getCustomers searchTerm : ", st, queryKey);
	const response = await NotificationService.get_all_notifcations(params);
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get notifications");
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};

const Notification = () => {
	const [search, setSearch] = useState("");

	const allNotificationsQueryRes = useQuery({
		queryKey: ["allNotifications"],
		queryFn: getAllNotifications,
		onError: (err) => {
			toast.error("Failed to get notifications.");
		},
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	console.log(
		"allNotificationsQueryRes.data : ",
		allNotificationsQueryRes?.data
	);

	const rearrangedTableData = allNotificationsQueryRes?.data?.map(
		(item: any, index: any) => {
			let customersList = "";

			item?.customers?.map((elt: any, idx: any) => {
				if (idx == 0) {
					customersList = customersList + elt.name;
				} else if (idx > 0 && idx <= 2) {
					customersList = customersList + ", " + elt.name;
				}
			});
			if (item?.customers?.length > 3)
				customersList += ` ... et ${item?.customers?.length - 3} autre${
					item?.customers?.length - 3 > 1 ? "s" : ""
				}`;
			const rearrangedItem = {
				date: getFormattedDateTime(item?.created_at),
				customers: customersList,
				title: item?.title,
				content: item?.text,
				actions: (
					<>
						{/* <div className='flex gap-5'>
			  <CButton 
			  text={'Details'}
			  href={item.edit}
			  btnStyle={'outlineGreen'}
			  icon={<FourDots />} 
			  />
			  </div> */}
					</>
				),
			};
			item = rearrangedItem;
			return item;
		}
	);

	return (
		<div className="w-full">
			<NotificationForm />

			<div className="mt-7">
				<Title title="Dernieres campagnes" />
				<div className="mt-4">
					<CustomTable
						headerData={headerData}
						tableData={rearrangedTableData}
						isLoading={
							!allNotificationsQueryRes?.data &&
							allNotificationsQueryRes.status === "loading"
						}
						// btn={<CButton
						//   text={'Ajouter un Admin'}
						//   btnStyle={'green'}
						//   href={'/administration/create'}
						//   />}
					/>
				</div>
			</div>
		</div>
	);
};

export default Notification;
