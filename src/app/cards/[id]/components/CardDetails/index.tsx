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
import { isObject, formatSingleDigit } from "@/utils/utils";
import { CardService } from "@/api/services/cartevo-api/card";
import toast from "react-hot-toast";
import { selectCurrentCard } from "@/redux/slices/card";
import Modal from "@/components/shared/Modal/Modal";
import FundModal from "../modals/FundModal";
import WithdrawModal from "../modals/WithdrawModal";
import FreezeModal from "../modals/FreezeModal";
import UnfreezeModal from "../modals/UnfreezeModal";
import BadgeLabel from "@/components/shared/BadgeLabel";

type Props = {
	search?: string;
	setSearch?: (data?: any) => void;
};

export function VirtualVisaCard() {
	const [copied, setCopied] = useState("");
	const [isFundModalOpen, setIsFundModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
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
	const cardDetails: any = useSelector(selectCurrentCard);
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);

	console.log("cardDetails :: ", cardDetails);

	// const cardDetails: any = customerDetails?.cards?.data?.[0];

	const [copied, setCopied] = useState("");
	const [isFundModalOpen, setIsFundModalOpen] = useState(false);
	const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
	const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
	const [isUnfreezeModalOpen, setIsUnfreezeModalOpen] = useState(false);

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
		status: "Status",
		created_at: "Issuing Date",
		balance: "Balance",
	};

	const handleFundCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			// For now, show a prompt for amount. In a real app, you'd have a modal
			const amount = prompt("Enter amount to fund:");
			if (!amount) return;

			await CardService.fund_card({
				token,
				cardId,
				data: {
					amount: parseFloat(amount),
					customer_id: "customer_id_here",
				}, // You'd get customer_id from context
			});
			toast.success("Card funded successfully");
		} catch (error) {
			toast.error("Failed to fund card");
			console.error(error);
		}
	};

	const handleWithdrawCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			const amount = prompt("Enter amount to withdraw:");
			if (!amount) return;

			await CardService.withdraw_card({
				token,
				cardId,
				data: {
					amount: parseFloat(amount),
					customer_id: "customer_id_here",
				},
			});
			toast.success("Withdrawal successful");
		} catch (error) {
			toast.error("Failed to withdraw from card");
			console.error(error);
		}
	};

	const handleFreezeCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			await CardService.freeze_card({ token, cardId });
			toast.success("Card frozen successfully");
		} catch (error) {
			toast.error("Failed to freeze card");
			console.error(error);
		}
	};

	const handleUnfreezeCard = async (cardId: string) => {
		if (!cardId) return;
		const token = localStorage.getItem("sktoken");
		if (!token) {
			toast.error("Authentication required");
			return;
		}

		try {
			await CardService.unfreeze_card({ token, cardId });
			toast.success("Card unfrozen successfully");
		} catch (error) {
			toast.error("Failed to unfreeze card");
			console.error(error);
		}
	};

	return (
		<section className="">
			<div>
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						{/* <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
							Card details
						</h2> */}
						<div>
							{cardDetails.status == "ACTIVE" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"ACTIVE"}
									badgeColor={"#1F66FF"}
									textColor={"#444"}
								/>
							) : cardDetails.status == "TERMINATED" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"TERMINATED"}
									badgeColor={"#F85D4B"}
									textColor={"#444"}
								/>
							) : cardDetails.status?.toUpperCase() ==
							  "FROZEN" ? (
								<BadgeLabel
									className={`text-xs`}
									label={"FROZEN"}
									badgeColor={"#FFAC1C"}
									textColor={"#444"}
								/>
							) : (
								<BadgeLabel
									className={`text-xs`}
									label={"Suspendu"}
									badgeColor={"#444"}
									textColor={"#444"}
								/>
							)}
						</div>
						{/* <p className="text-sm text-gray-500 dark:text-gray-400">
							{`Created at ${getFormattedDateTime(
								cardDetails?.created_at
							)}`}
						</p> */}
					</div>
					<div>
						<span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
							{`${cardDetails?.balance} USD`}
						</span>
					</div>
				</div>

				{/* Card */}
				<div
					className={`bg-blue-600 text-white rounded-xl p-6 mt-6 relative ${
						cardDetails?.status?.toUpperCase() !== "ACTIVE"
							? "blur-sm"
							: ""
					}`}
				>
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center space-x-2">
							{/* <FaMicrochip size={24} /> */}
							<span className="font-semibold">
								{cardDetails?.brand?.toUpperCase() ||
									`VIRTUAL CARD`}
							</span>
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
					<div className="text-xl tracking-widest mb-4">
						{cardDetails?.masked_number}
						{/* •••• •••• •••• 5587 */}
					</div>
					<div className="flex justify-between items-center">
						<span className="uppercase">{cardDetails?.name}</span>
						<div className="flex space-x-4">
							<span>•••</span>
							{/* <span>{cardDetails?.cvv}</span> */}
							<span>
								{`${formatSingleDigit(
									cardDetails?.expiry_month
								)}/${cardDetails?.expiry_year}`}
								{/* •• /27 */}
							</span>
						</div>
					</div>
					{(cardDetails?.status?.toUpperCase() === "FROZEN" ||
						cardDetails?.status?.toUpperCase() ===
							"TERMINATED") && (
						<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
							{/* <span className="text-white font-bold text-lg uppercase">
								{cardDetails?.status?.toUpperCase()}
							</span> */}
						</div>
					)}
				</div>

				{/* Actions */}
				<div className="grid grid-cols-2 gap-4 mt-4">
					{cardDetails?.status?.toUpperCase() === "ACTIVE" ? (
						<>
							<button
								onClick={() => setIsFundModalOpen(true)}
								className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition"
							>
								<FaDownload className="" />
								Fund
							</button>
							<button
								onClick={() => setIsWithdrawModalOpen(true)}
								className="flex-1 flex gap-2 items-center justify-center bg-app-primary hover:bg-app-secondary text-white py-2 px-4 rounded transition"
							>
								<FaUpload className="" />
								Withdraw
							</button>
						</>
					) : (
						<></>
					)}
					{cardDetails.status?.toUpperCase() === "ACTIVE" ? (
						<button
							onClick={() => setIsFreezeModalOpen(true)}
							className="col-span-2 flex-1 flex gap-2 items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded transition"
						>
							<FaLock className="" />
							Freeze
						</button>
					) : cardDetails.status?.toUpperCase() === "FROZEN" ? (
						<button
							onClick={() => setIsUnfreezeModalOpen(true)}
							className="col-span-2 flex-1 flex gap-2 items-center justify-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition"
						>
							<FaLock className="" />
							Unfreeze
						</button>
					) : (
						<></>
					)}
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
										"status",
										"created_at",
										"balance",
									].includes(label)
								)
									return (
										<div
											key={label}
											className="relative flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded"
										>
											<div>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													{Labels[label]}
												</p>
												<p className="font-medium text-sm text-gray-800 dark:text-gray-100">
													{label === "cvv"
														? "***"
														: label === "created_at"
														? getFormattedDateTime(
																cardDetails?.created_at
														  )
														: label === "balance"
														? `${cardDetails?.balance} USD`
														: value}
												</p>
											</div>
											{/* <button
												onClick={() =>
													handleCopy(label, value)
												}
												aria-label={`Copy ${label}`}
												className="absolute top-[10px] right-[10px] focus:outline-none"
											>
												{copied === label ? (
													<FaCheck className="text-green-500" />
												) : (
													<FaRegCopy className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition" />
												)}
											</button> */}
										</div>
									);
							}
						)}
				</div>

				{/* Modals */}
				<Modal
					name="fund"
					isOpen={isFundModalOpen}
					setIsOpen={setIsFundModalOpen}
					modalContent={
						<FundModal
							isOpen={isFundModalOpen}
							setIsOpen={setIsFundModalOpen}
							cardId={cardDetails?.id}
							customerId={cardDetails?.customer_id}
						/>
					}
				/>
				<Modal
					name="withdraw"
					isOpen={isWithdrawModalOpen}
					setIsOpen={setIsWithdrawModalOpen}
					modalContent={
						<WithdrawModal
							isOpen={isWithdrawModalOpen}
							setIsOpen={setIsWithdrawModalOpen}
							cardId={cardDetails?.id}
							customerId={cardDetails?.customer_id}
						/>
					}
				/>
				<Modal
					name="freeze"
					isOpen={isFreezeModalOpen}
					setIsOpen={setIsFreezeModalOpen}
					modalContent={
						<FreezeModal
							isOpen={isFreezeModalOpen}
							setIsOpen={setIsFreezeModalOpen}
							cardId={cardDetails?.id}
						/>
					}
				/>
				<Modal
					name="unfreeze"
					isOpen={isUnfreezeModalOpen}
					setIsOpen={setIsUnfreezeModalOpen}
					modalContent={
						<UnfreezeModal
							isOpen={isUnfreezeModalOpen}
							setIsOpen={setIsUnfreezeModalOpen}
							cardId={cardDetails?.id}
						/>
					}
				/>
			</div>
		</section>
	);
};

export default CardDetails;
