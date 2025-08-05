"use client";
// import BlockCardModalForm from "@/app/dashboard/v1/users_accounts/manage/[id]/components/Tabs/Cartes/modals/BlockCardModalForm";
// import RechargeWithdrawCardBalanceModalForm from "@/app/dashboard/v1/users_accounts/manage/[id]/components/Tabs/Cartes/modals/RechargeWithdrawCardBalanceModalForm";
// import UnblockCardModalForm from "@/app/dashboard/v1/users_accounts/manage/[id]/components/Tabs/Cartes/modals/UnblockCardModalForm";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import Modal from "@/components/shared/Modal/Modal";
import urls from "@/config/urls";
import { selectCurrentUser } from "@/redux/slices/auth";
import { hasPermission } from "@/utils/permissions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoDotFill } from "react-icons/go";
import { useSelector } from "react-redux";

interface ICartesCard {
	cardNumber: string;
	type: string;
	matricule: string;
	date: string;
	solde: string | number;
	soldeUSD: string | number;
	status: string;
	activateDate: string;
	title?: string;
	expanded?: boolean;
	nbPayments?: string | number;
	nbPaymentsSuccess?: string | number;
	nbPaymentsFailed?: string | number;
	totalRecharges?: string | number;
	totalPayments?: string | number;
	totalRetraits?: string | number;
	averagePaymentAmountPerWeek?: string | number;
	color?: string;
	index?: number;
	card?: any;
	customer?: any;
}

const CartesCard = ({
	cardNumber,
	type,
	matricule,
	date,
	solde,
	soldeUSD,
	status,
	activateDate,
	title,
	expanded,
	nbPayments,
	nbPaymentsSuccess,
	nbPaymentsFailed,
	totalRecharges,
	totalPayments,
	totalRetraits,
	averagePaymentAmountPerWeek,
	color,
	index,
	card,
	customer,
}: ICartesCard) => {
	const router = useRouter();
	const currentUser = useSelector(selectCurrentUser);
	return (
		<div className="flex flex-col justify-start items-start gap-3">
			{/* <h1 className="text-base font-semibold tracking-tight">{title ?? `Carte ${index}`}</h1> */}

			<div
				style={{ background: `#${color ?? "FFDB5A"}` }}
				className={`px-3 py-3 bg-[#FFDB5A] outline-none border-none shadow-sm 
      flex justify-center items-center rounded-2xl w-full`}
			>
				<h1 className="text-lg font-bold tracking-wide">
					<span className="flex flex-wrap items-center gap-2">
						{[1, 1, 1].map((item, idx) => (
							<span key={idx} className="flex h-5 items-center">
								{[1, 1, 1, 1].map((si, sidx) => (
									<GoDotFill key={sidx} size={10} />
								))}
							</span>
						))}
						{cardNumber?.slice(12)?.trim()}
					</span>
				</h1>
			</div>
			{/* <div className="flex justify-between items-center w-full mb-2"> */}
			<div className="grid grid-cols-2 gap-x-3 gap-y-1">
				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Type
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{type}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Matricule
				</h1>
				<span className="text-sm font-[400] tracking-tighter">
					{matricule}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Créé le
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{date}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Solde
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{solde}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Solde USD
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{soldeUSD}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Etat
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{status}
				</span>

				<h1
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-semibold text-left tracking-tight"
				>
					Dernière activité
				</h1>
				<span
					style={{ whiteSpace: "nowrap" }}
					className="text-sm font-[400] tracking-tighter"
				>
					{activateDate}
				</span>
			</div>

			{/* {hasPermission(currentUser, "home:cards", "edit") ? (
				<>
					<div className="grid grid-cols-2 gap-3 w-full">
						<div className="col-span-2">
							<CButton
								text={"Recharger"}
								href={`?rechargeCard${index}=true`}
								btnStyle={"dark"}
								icon={<FourDots />}
								width={"100%"}
							/>
							<Modal
								name={`rechargeCard${index}`}
								modalContent={
									<RechargeWithdrawCardBalanceModalForm
										index={index}
										card={card}
										customer={customer}
									/>
								}
							/>
						</div>
						<div className="col-span-2">
							<CButton
								text={"Retirer"}
								href={`?withdrawCard${index}=true`}
								btnStyle={"dark"}
								icon={<FourDots />}
								width={"100%"}
							/>
							<Modal
								name={`withdrawCard${index}`}
								modalContent={
									<RechargeWithdrawCardBalanceModalForm
										index={index}
										card={card}
										customer={customer}
									/>
								}
							/>
						</div>
						{card?.status === "ACTIVE" ? (
							<div className="col-span-2">
								<CButton
									text={"Bloquer"}
									href={`?freezeCard${index}=true`}
									btnStyle={"dark"}
									icon={<FourDots />}
									width={"100%"}
								/>
								<Modal
									name={`freezeCard${index}`}
									modalContent={
										<BlockCardModalForm
											index={index}
											card={card}
											customer={customer}
										/>
									}
								/>
							</div>
						) : card?.status === "FREEZE" ? (
							<div className="col-span-2">
								<CButton
									text={"Débloquer"}
									href={`?unfreezeCard${index}=true`}
									btnStyle={"dark"}
									icon={<FourDots />}
									width={"100%"}
								/>
								<Modal
									name={`unfreezeCard${index}`}
									modalContent={
										<UnblockCardModalForm
											index={index}
											card={card}
											customer={customer}
										/>
									}
								/>
							</div>
						) : (
							<></>
						)}

						<div className="col-span-2">
							{!expanded ? (
								<>
									<CButton
										text={"Voir transactions"}
										href={`${urls.cards.manage}/${card?._id}`}
										btnStyle={"dark"}
										icon={<FourDots />}
										width={"100%"}
									/>									
								</>
							) : (
								<></>
							)}
						</div>
						
					</div>
					{expanded ? (
						<>
							<div className={`my-3`}>
								<div className="text-sm font-semibold">
									Propriétaire de la carte
								</div>
								<Link
									href={`${urls.usersAccounts.manage}/${customer?._id}`}
									className="hover:text-[#18BC7A] "
								>
									<div
										onClick={() =>
											router.push(
												`${urls.usersAccounts.manage}/${customer?._id}`
											)
										}
										className="text-md cursor-pointer font-normal "
									>
										{customer?.name}
									</div>
									<div
										onClick={() =>
											router.push(
												`${urls.usersAccounts.manage}/${customer?._id}`
											)
										}
										className="text-sm cursor-pointer font-normal "
									>
										{customer?.email}
									</div>
									<div
										onClick={() =>
											router.push(
												`${urls.usersAccounts.manage}/${customer?._id}`
											)
										}
										className="text-sm cursor-pointer font-normal "
									>
										{customer?.phone}
									</div>
								</Link>
							</div>

						
						</>
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)} */}
		</div>
	);
};

export default CartesCard;
