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
import React from "react";
import {
	FaMicrochip,
	FaSyncAlt,
	FaLock,
	FaRegCopy,
	FaCheck,
	FaUpload,
	FaDownload,
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { isObject } from "@/utils/utils";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

export function VirtualVisaCard() {
	const [copied, setCopied] = useState("");
	const details = [
		{ label: "Card ID", value: "45E5R76T77" },
		{ label: "Card Number", value: "---- ---- ---- 4565" },
		{ label: "Name on Card", value: "Mohamed Lerry Issa" },
		{ label: "CVV", value: "165" },
		{ label: "Date Exp", value: "01 / 25" },
	];

	const handleCopy = (label: any, text: any) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 2000);
	};

	return (
		// <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
		<div>
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
						Détails De Carte
					</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Créé le 05 Aout 2024
					</p>
				</div>
				<div>
					<span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
						252.50 XAF
					</span>
				</div>
			</div>

			{/* Card */}
			<div className="bg-blue-600 text-white rounded-xl p-6 mt-6">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center space-x-2">
						<FaMicrochip size={24} />
						<span className="font-semibold">
							Carte Virtuelle VISA
						</span>
					</div>
					<SiVisa size={48} />
				</div>
				<div className="text-2xl tracking-widest mb-4">
					•••• •••• •••• 5587
				</div>
				<div className="flex justify-between items-center">
					<span className="uppercase">MOHAMED LERRY ISSA</span>
					<div className="flex space-x-4">
						<span>•••</span>
						<span>• • /27</span>
					</div>
				</div>
			</div>

			{/* Actions */}
			<div className="flex space-x-4 mt-4">
				<button className="flex-1 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
					<FaSyncAlt className="mr-2" />
					Recharger
				</button>
				<button className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition">
					<FaLock className="mr-2" />
					Verrouiller
				</button>
			</div>

			{/* Details Grid */}
			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
				{details.map(({ label, value }) => (
					<div
						key={label}
						className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded"
					>
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{label}
							</p>
							<p className="font-medium text-gray-800 dark:text-gray-100">
								{value}
							</p>
						</div>
						<button
							onClick={() => handleCopy(label, value)}
							aria-label={`Copy ${label}`}
							className="focus:outline-none"
						>
							{copied === label ? (
								<FaCheck className="text-green-500" />
							) : (
								<FaRegCopy className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition" />
							)}
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

const CardDetails = ({ search, setSearch }: Props) => {
	const redirectRef: any = useRef();
	const dispatch = useDispatch();
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	const cardDetails: any = customerDetails?.cards?.data?.[0];

	const [copied, setCopied] = useState("");

	const handleCopy = (label: any, text: any) => {
		navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(""), 2000);
	};
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
	const Labels: any = {
		brand: "Brand",
		cvv: "CVV",
		masked_number: "Number",
		name: "Name",
		expired_at: "Expiry Date",
		created_at: "Issuing Date",
		balance_usd: "Balance",
	};
	return (
		<section className="">
			<div>
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
							Card details
						</h2>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{`Created at ${getFormattedDateTime(
								cardDetails?.created_at
							)}`}
						</p>
					</div>
					<div>
						<span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
							{`${cardDetails?.balance_usd} USD`}
						</span>
					</div>
				</div>

				{/* Card */}
				<div className="bg-blue-600 text-white rounded-xl p-6 mt-6">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center space-x-2">
							{/* <FaMicrochip size={24} /> */}
							<span className="font-semibold">Virtual Card</span>
						</div>
						{cardDetails?.brand?.toLowerCase() === "visa" ? (
							<SiVisa size={48} />
						) : cardDetails?.brand?.toLowerCase() ===
						  "mastercard" ? (
							<SiMastercard size={48} />
						) : (
							<></>
						)}
					</div>
					<div className="text-2xl tracking-widest mb-4">
						{cardDetails?.masked_number}
						{/* •••• •••• •••• 5587 */}
					</div>
					<div className="flex justify-between items-center">
						<span className="uppercase">{cardDetails?.name}</span>
						<div className="flex space-x-4">
							<span>•••</span>
							<span>
								{cardDetails?.expired_at}
								{/* •• /27 */}
							</span>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="grid grid-cols-2 gap-4 mt-4">
					<button className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition">
						{/* <FaSyncAlt className="" /> */}
						<FaDownload className="" />
						Fund
					</button>
					<button className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition">
						<FaUpload className="" />
						Withdraw
					</button>
					<button className="flex-1 flex gap-2 items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition">
						<FaLock className="" />
						Deactivate
					</button>
				</div>

				{/* Details Grid */}
				<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{isObject(cardDetails) &&
						Object.entries(cardDetails).map(
							([label, value]: any[]) => {
								if (
									[
										"brand",
										"cvv",
										"masked_number",
										"name",
										"created_at",
										"expired_at",
										"balance_usd",
									].includes(label)
								)
									return (
										<div
											key={label}
											className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded"
										>
											<div>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													{Labels[label]}
												</p>
												<p className="font-medium text-gray-800 dark:text-gray-100">
													{label === "cvv"
														? "***"
														: label === "created_at"
														? getFormattedDateTime(
																cardDetails?.created_at
														  )
														: value}
												</p>
											</div>
											<button
												onClick={() =>
													handleCopy(label, value)
												}
												aria-label={`Copy ${label}`}
												className="focus:outline-none"
											>
												{copied === label ? (
													<FaCheck className="text-green-500" />
												) : (
													<FaRegCopy className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition" />
												)}
											</button>
										</div>
									);
							}
						)}
				</div>
			</div>
		</section>
	);
};

export default CardDetails;
