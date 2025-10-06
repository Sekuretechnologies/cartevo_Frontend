"use client";
import CustomTable from "@/components/shared/CustomTable";
import Title from "@/components/shared/Title";
import { useDispatch, useSelector } from "react-redux";
// import TransactionModal from "@/app/dashboard/v2/wallet_transactions/components/TransactionModal";
import { ITableHeader } from "@/components/AdminTable/Table";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { selectCurrentUser } from "@/redux/slices/auth";
import { useRef, useState } from "react";
import Image from "next/image";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useTranslation } from "@/hooks/useTranslation";

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

const UserDetails = ({ search, setSearch }: Props) => {
	const { t } = useTranslation();
	const customerTrans = t.customers.details;
	const redirectRef: any = useRef();
	const dispatch = useDispatch();
	const userData: any = useSelector(selectCurrentCustomerDetails);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);
	// const [
	// 	isUpdateVerificationStatusModalFormOpen,
	// 	setIsUpdateVerificationStatusModalFormOpen,
	// ] = useState(false);
	// const [isNotificationModalFormOpen, setIsNotificationModalFormOpen] =
	// 	useState(false);
	// const [isWhatsappModalFormOpen, setIsWhatsappModalFormOpen] =
	// 	useState(false);

	// const [isOpen, setIsOpen] = useState<string | boolean>("");

	// const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

	// const userData = useSelector(selectCurrentUser);

	return (
		<section className="">
			<div className="flex flex-col gap-3 justify-center items-center pb-5 border-b-1 ">
				<div>
					<div
						style={{
							width: window.innerWidth > 800 ? 70 : 60,
							height: window.innerWidth > 800 ? 70 : 60,
							borderRadius: "50%",
							position: "relative",
							overflow: "hidden",
						}}
					>
						<Image
							alt="photo"
							src={
								userData?.customer?.profile_picture?.startsWith(
									"http"
								)
									? userData?.customer?.profile_picture
									: `https://ui-avatars.com/api/?size=250&name=${`${userData?.first_name} ${userData?.last_name}`
											?.toLowerCase()
											?.replace(
												/\s+/g,
												"+"
											)}&background=1F66FF&color=FFFFFF`
							}
							layout="fill"
							objectFit="cover"
						/>
					</div>
				</div>
				<div className="w-full text-center ">
					<h1 className="text-md text-gray-700 font-bold">{`${userData?.first_name} ${userData?.last_name}`}</h1>
					<p className="text-sm text-gray-500">{userData?.email}</p>
					{/* <p className="text-md text-gray-500">
						{userData?.phone}
					</p> */}
				</div>
			</div>

			{/* <div className="flex flex-col gap-5 py-5 border-b-1">
				<div className="">
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{`Sum of cards balances`}
					</p>
					<p className="text-[#000] text-xl font-bold tracking-tight my-1">
						{`${
							customerDetails?.balance_xaf?.toLocaleString(
								"fr-FR"
							) ?? 0
						} USD `}
					</p>
				</div>
				<div className="">
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{`Sum of payments`}
					</p>
					<p className="text-[#000] text-xl font-bold tracking-tight my-1">
						{`${
							customerDetails?.balance_xaf?.toLocaleString(
								"fr-FR"
							) ?? 0
						} USD `}
					</p>
				</div>
			</div> */}
			<div className="flex flex-col gap-5 py-5 border-t-1">
				<div>
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{customerTrans.phone}
					</p>
					<span className="font-bold">
						{`(${customerDetails?.country_phone_code}) ${customerDetails?.phone_number}`}
					</span>
				</div>

				<div>
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{customerTrans.country}
					</p>
					<span className="font-bold">
						{`(${customerDetails?.country_iso_code}) ${customerDetails?.country}`}
					</span>
				</div>
				<div>
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{"ID"}
					</p>
					<span className="font-bold">{customerDetails?.id}</span>
				</div>
				<div>
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						{customerTrans.create}
					</p>
					<span className="font-bold">
						{getFormattedDateTime(customerDetails?.created_at)}
					</span>
				</div>
			</div>
		</section>
	);
};

export default UserDetails;
