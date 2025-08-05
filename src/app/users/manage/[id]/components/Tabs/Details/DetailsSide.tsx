import ActiveYesNo from "@/components/shared/ActiveYesNo";
import CButton from "@/components/shared/CButton";
import { FourDots } from "@/components/shared/icons";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { selectCurrentCustomerDetails } from "@/redux/slices/customer";
import { getFormattedDateTime } from "@/utils/DateFormat";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { PiCirclesFourFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import RechargeAccountBalanceModalForm from "./modals/RechargeAccountBalanceModalForm";
// import { Modal } from "@mui/material";
import Modal from "@/components/shared/Modal/Modal";
import { useEffect, useRef, useState } from "react";
import BlockUserAccountModalForm from "./modals/BlockUserAccountModalForm";
import UnblockUserAccountModalForm from "./modals/UnblockUserAccountModalForm";
import { retrieveUSDAmount } from "@/utils/utils";
import UpdateVerificationStatusModalForm from "./modals/UpdateVerificationStatusModalForm";
import { FaCheck, FaX } from "react-icons/fa6";
import { MdCheck, MdClose } from "react-icons/md";
import ActivateUserAccountModal from "./modals/ActivateUserAccountModal";
import { selectCurrentUser } from "@/redux/slices/auth";
import { KycService } from "@/api/services/v2/kyc";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { setKYCWarningsList } from "@/redux/slices_v2/kyc";
import { hasPermission } from "@/utils/permissions";
import { IoIosSend } from "react-icons/io";
import NotificationModalForm from "./modals/NotificationModalForm";
import ReleaseStandByAccountBalanceModalForm from "./modals/ReleaseStandByAccountBalanceModalForm";
import EditRegStatusModalForm from "./modals/EditRegStatusModalForm";
import { CustomerService } from "@/api/services/v2/customer";
import { HashLoader } from "react-spinners";
import classNames from "classnames";
import WhatsappModalForm from "./modals/WhatsappModalForm";

const getKYCWarningsList = async () => {
	const response = await KycService.get_kyc_warnings_list({ lang: "fr" });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get kyc warnings list"
		);
	}
	// console.log("getKYCStats.data : ", responseJson.data);
	return responseJson.data;
};

const handleUpdateUser = async (queryData: any) => {
	const { currentUserId, customerId, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await CustomerService.update_one_customer_infos({
		userId: currentUserId,
		customerId: customerId,
		body: body,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function DetailsSide() {
	const redirectRef: any = useRef();
	const dispatch = useDispatch();
	const customerDetails: any = useSelector(selectCurrentCustomerDetails);
	const [
		isUpdateVerificationStatusModalFormOpen,
		setIsUpdateVerificationStatusModalFormOpen,
	] = useState(false);
	const [isNotificationModalFormOpen, setIsNotificationModalFormOpen] =
		useState(false);
	const [isWhatsappModalFormOpen, setIsWhatsappModalFormOpen] =
		useState(false);

	const [isOpen, setIsOpen] = useState<string | boolean>("");

	const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

	const currentUser = useSelector(selectCurrentUser);

	const allKYCWarningsListRes = useQuery({
		queryKey: ["allKYCWarningsList"],
		queryFn: getKYCWarningsList,
		onError: (err) => {
			toast.error("Failed to get KYC warnings list.");
			console.log("Failed to get KYC warnings list : ", err);
		},
	});
	dispatch(setKYCWarningsList(allKYCWarningsListRes.data));

	const mutation = useMutation({
		mutationFn: (data) =>
			handleUpdateUser({
				currentUserId: currentUser?.id,
				customerId: customerDetails?.customer?.id,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`Erreur lors de la modification des informations du compte : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				`Modification des informations du compte effectué avec succès`
			);
			redirectRef.current.href = window.location.pathname;
			redirectRef.current.click();
		},
	});

	const updateUserStatus = (data: any) => {
		mutation.mutate(data);
	};

	return (
		<div className="w-full md:w-64 flex flex-col gap-y-[25px]">
			<div>
				<h1 className="text-lg text-gray-700 font-bold">
					Informations de compte
				</h1>
				{/* <p className="text-xs text-gray-500">liste en temps réel des dernieres transactions effectuées avec les cartes</p> */}
			</div>

			<div className="flex justify-between items-center w-full">
				{/* <p className="text-gray-800 text-sm font-normal tracking-tight">Statut</p> */}
				{customerDetails?.customer?.is_from_v1 ? (
					<LabelWithBadge
						className={`text-sm`}
						label={"Ancien"}
						badgeColor={"#000"}
						textColor={"#000"}
					/>
				) : (
					<LabelWithBadge
						className={`text-sm`}
						label={"Nouveau"}
						badgeColor={"#1F66FF"}
						textColor={"#444"}
					/>
				)}
			</div>

			<div>
				<p className="text-gray-800 text-sm font-normal tracking-tight">
					Compte créé le
				</p>
				<span className="">
					{getFormattedDateTime(
						customerDetails?.customer?.created_at
					)}
				</span>
			</div>
			{customerDetails?.customer?.regularisation_status ? (
				<>
					<div>
						<p className="text-gray-800 text-sm font-normal tracking-tight">
							Methode regularisation
						</p>
						<span className="">
							{customerDetails?.customer?.regularisation_method}
						</span>
					</div>

					<div>
						<p className="text-gray-800 text-sm font-normal tracking-tight">
							Numero telephone regularisation
						</p>
						<span className="">
							{customerDetails?.customer?.regularisation_phone}
						</span>
					</div>

					<div>
						<p className="text-gray-800 text-sm font-normal tracking-tight">
							Statut regularisation
						</p>
						<span className="">
							{customerDetails?.customer?.regularisation_status}
						</span>
					</div>

					{hasPermission(
						currentUser,
						"user_account_details:details",
						"edit"
					) &&
					customerDetails?.customer?.regularisation_status !==
						"PAID" ? (
						<>
							<CButton
								text={`Modifier statut regularisation`} //{'Reverser vers solde actif'}
								// href={`?editRegStatus=true`}
								onClick={() => setIsOpen("editRegStatus")}
								btnStyle={"dark"}
								icon={<FourDots />}
								width={"100%"}
							/>
							<Modal
								isOpen={isOpen === "editRegStatus"}
								setIsOpen={setIsOpen}
								name={"editRegStatus"}
								modalContent={
									<EditRegStatusModalForm
										setIsOpen={setIsOpen}
										customer={customerDetails?.customer}
									/>
								}
							/>
						</>
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)}

			<div className="">
				<p className="text-gray-800 text-sm font-normal tracking-tight">
					{`Total solde courant `}

					{/* <span className="font-bold">{`($ ${retrieveUSDAmount({
						amount: customerDetails?.customer?.balance_xaf,
						amountUSD: customerDetails?.customer?.balance_usd,
					})?.toLocaleString("fr-FR")})`}</span> */}
				</p>
				<p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">
					{`${
						customerDetails?.customer?.balance_xaf?.toLocaleString(
							"fr-FR"
						) ?? 0
					} XAF `}
				</p>
				{customerDetails?.customer?.country_iso_code === "CD" ? (
					<p className="font-bold text-xl font-bold tracking-tight my-2">{`(${
						customerDetails?.customer?.balance_currency?.toLocaleString(
							"fr-FR"
						) ?? 0
					} ${customerDetails?.customer?.currency})`}</p>
				) : (
					<></>
				)}

				{hasPermission(
					currentUser,
					"user_account_details:details",
					"edit"
				) ? (
					<>
						<div className="flex justify-between items-center gap-3">
							<CButton
								text={"Recharger"}
								// href={`?rechargeAccount=true`}
								onClick={() => setIsOpen("rechargeAccount")}
								btnStyle={"dark"}
								icon={<FourDots />}
								width={"100%"}
							/>
							{/* <Modal component={<RechargeAccountBalanceModalForm customer={customerDetails?.customer}/>}/> */}
							<Modal
								isOpen={isOpen === "rechargeAccount"}
								setIsOpen={setIsOpen}
								name={"rechargeAccount"}
								modalContent={
									<RechargeAccountBalanceModalForm
										setIsOpen={setIsOpen}
										action={"rechargeAccount"}
										customer={customerDetails?.customer}
									/>
								}
							/>
							<div
								style={{
									display:
										customerDetails?.customer
											?.balance_xaf &&
										customerDetails?.customer?.balance_xaf >
											0
											? "block"
											: "none",
								}}
							>
								<CButton
									text={"Retirer"}
									// href={`?withdrawAccount=true`}
									onClick={() => setIsOpen("withdrawAccount")}
									btnStyle={"dark"}
									icon={<FourDots />}
									width={"100%"}
								/>
							</div>
							<Modal
								isOpen={isOpen === "withdrawAccount"}
								setIsOpen={setIsOpen}
								name={"withdrawAccount"}
								modalContent={
									<RechargeAccountBalanceModalForm
										setIsOpen={setIsOpen}
										action={"withdrawAccount"}
										customer={customerDetails?.customer}
									/>
								}
							/>
						</div>
					</>
				) : (
					<></>
				)}
			</div>

			<div className="">
				<p className="text-gray-800 text-sm font-normal tracking-tight">
					{`Total solde en verification `}
					<span className="font-bold">{`($ ${retrieveUSDAmount({
						amount: customerDetails?.customer?.balance_xaf,
						amountUSD: customerDetails?.customer?.balance_usd,
					})?.toLocaleString("fr-FR")})`}</span>
				</p>
				<p className="text-gray-500 text-xl font-bold tracking-tight my-1">
					{`${
						customerDetails?.customer?.old_balance_xaf?.toLocaleString(
							"fr-FR"
						) ?? 0
					} XAF `}
				</p>
				{hasPermission(
					currentUser,
					"user_account_details:details",
					"edit"
				) && (customerDetails?.customer?.old_balance_xaf || 0) > 0 ? (
					<>
						{customerDetails?.customer?.regularisation_status ===
						"PROCESSING" ? (
							<>
								<CButton
									text={`Regulariser`} //{'Reverser vers solde actif'}
									// href={`?releaseStandByAccount=true`}
									onClick={() =>
										setIsOpen("releaseStandByAccount")
									}
									btnStyle={"red"}
									icon={<FourDots />}
									width={"100%"}
								/>
								<Modal
									isOpen={isOpen === "releaseStandByAccount"}
									setIsOpen={setIsOpen}
									name={"releaseStandByAccount"}
									modalContent={
										<ReleaseStandByAccountBalanceModalForm
											customer={customerDetails?.customer}
										/>
									}
								/>
							</>
						) : (
							<>
								<CButton
									text={`Regulariser`}
									btnStyle={"grey"}
									icon={<FourDots />}
									width={"100%"}
								/>
							</>
						)}
					</>
				) : (
					<></>
				)}
			</div>

			<div className="">
				{/* <p className="text-gray-800 text-sm font-normal tracking-tight">Total solde parrainage</p> */}
				<p className="text-gray-800 text-sm font-normal tracking-tight">
					{`Total solde parrainage `}
					<span className="font-bold">{`($ ${retrieveUSDAmount({
						amount: customerDetails?.customer
							?.balance_sponsorship_xaf,
						amountUSD:
							customerDetails?.customer?.balance_sponsorship_usd,
					})?.toLocaleString("fr-FR")})`}</span>
				</p>
				<p className="text-[#18BC7A] text-2xl font-bold tracking-tight my-1">
					{customerDetails?.customer?.balance_sponsorship_xaf?.toLocaleString(
						"fr-FR"
					) ?? 0}{" "}
					XAF
				</p>

				{hasPermission(
					currentUser,
					"user_account_details:details",
					"edit"
				) ? (
					<>
						<div className="flex justify-between items-center gap-3">
							<CButton
								text={"Recharger"}
								// href={`?rechargeSponsorshipAccount=true`}
								onClick={() =>
									setIsOpen("rechargeSponsorshipAccount")
								}
								btnStyle={"dark"}
								icon={<FourDots />}
								width={"100%"}
							/>
							<Modal
								isOpen={isOpen === "rechargeSponsorshipAccount"}
								setIsOpen={setIsOpen}
								name={"rechargeSponsorshipAccount"}
								modalContent={
									<RechargeAccountBalanceModalForm
										setIsOpen={setIsOpen}
										action={"rechargeSponsorshipAccount"}
										customer={customerDetails?.customer}
									/>
								}
							/>
							<div
								style={{
									display:
										customerDetails?.customer
											?.balance_sponsorship_xaf &&
										customerDetails?.customer
											?.balance_sponsorship_xaf > 0
											? "block"
											: "none",
								}}
							>
								<CButton
									text={"Retirer"}
									// href={`?withdrawSponsorshipAccount=true`}
									onClick={() =>
										setIsOpen("withdrawSponsorshipAccount")
									}
									btnStyle={"dark"}
									icon={<FourDots />}
									width={"100%"}
								/>
							</div>
							<Modal
								isOpen={isOpen === "withdrawSponsorshipAccount"}
								setIsOpen={setIsOpen}
								name={"withdrawSponsorshipAccount"}
								modalContent={
									<RechargeAccountBalanceModalForm
										setIsOpen={setIsOpen}
										action={"withdrawSponsorshipAccount"}
										customer={customerDetails?.customer}
									/>
								}
							/>
						</div>
					</>
				) : (
					<></>
				)}
			</div>

			<div className="flex flex-col justify-start gap-2">
				<div className="flex justify-between items-center w-full">
					<p className="text-gray-800 text-sm font-normal tracking-tight">
						Etat du KYC
					</p>
					{
						customerDetails?.customer?.kyc_result === "APPROVED" ? (
							<LabelWithBadge
								className={`text-xs`}
								label={"Approuvé"}
								badgeColor={"#1F66FF"}
								textColor={"#444"}
							/>
						) : customerDetails?.customer?.kyc_result ===
						  "DECLINED" ? (
							<LabelWithBadge
								className={`text-xs`}
								label={"Refusé"}
								badgeColor={"#F85D4B"}
								textColor={"#444"}
							/>
						) : customerDetails?.customer?.kyc_status ===
						  "PENDING" ? (
							<LabelWithBadge
								className={`text-xs`}
								label={"En cours"}
								badgeColor={"#777"}
								textColor={"#444"}
							/>
						) : customerDetails?.customer?.kyc_status ===
						  "NOT_STARTED" ? (
							<LabelWithBadge
								className={`text-xs`}
								label={"Aucun"}
								badgeColor={"#000"}
								textColor={"#000"}
							/>
						) : (
							<LabelWithBadge
								className={`text-xs`}
								label={String(
									customerDetails?.customer?.kyc_result
								)}
								badgeColor={"#000"}
								textColor={"#000"}
							/>
						)
						// :<></>
					}
				</div>
				{hasPermission(
					currentUser,
					"user_account_details:details",
					"edit_kyc"
				) ? (
					<div>
						<CButton
							onClick={() =>
								setIsUpdateVerificationStatusModalFormOpen(true)
							}
							text={"Modifier"}
							btnStyle={"yellow"}
							icon={<FourDots />}
							width={"100%"}
						/>
						<UpdateVerificationStatusModalForm
							isOpen={isUpdateVerificationStatusModalFormOpen}
							setIsOpen={
								setIsUpdateVerificationStatusModalFormOpen
							}
							customer={customerDetails?.customer}
						/>
						{/* <Modal name={'blockUserAccount'} modalContent={<BlockUserAccountModalForm customer={customerDetails?.customer}/>}/> */}
					</div>
				) : (
					<></>
				)}
				<div className="flex justify-between items-center w-full mt-3">
					<span className="text-gray-800 text-sm font-normal">
						Etat du compte
					</span>
					{customerDetails?.customer?.blocked ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Bloqué"}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : customerDetails?.customer?.active ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Actif"}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : (
						<LabelWithBadge
							className={`text-xs`}
							label={"Inactif"}
							badgeColor={"#000"}
							textColor={"#000"}
						/>
					)}
				</div>
				{hasPermission(
					currentUser,
					"user_account_details:details",
					"edit_kyc"
				) ? (
					<div>
						{customerDetails?.customer?.blocked ? (
							<CButton
								onClick={() =>
									updateUserStatus({
										active: true,
										blocked: false,
									})
								}
								text={"Activer ce compte"}
								btnStyle={"green"}
								icon={<FourDots />}
								width={"100%"}
							/>
						) : customerDetails?.customer?.active ? (
							<CButton
								onClick={() =>
									updateUserStatus({
										active: false,
										blocked: true,
									})
								}
								text={"Bloquer ce compte"}
								btnStyle={"red"}
								icon={<FourDots />}
								width={"100%"}
							/>
						) : (
							<CButton
								onClick={() =>
									updateUserStatus({
										active: true,
										blocked: false,
									})
								}
								text={"Activer ce compte"}
								btnStyle={"green"}
								icon={<FourDots />}
								width={"100%"}
							/>
						)}
					</div>
				) : (
					<></>
				)}
				<div className=" mt-3 mb-2">
					<span className="text-gray-800 text-sm font-normal my-5">
						Notification
					</span>
					<>
						<CButton
							icon={<IoIosSend />}
							onClick={() => setIsNotificationModalFormOpen(true)}
							text={"Envoyer une notification"}
							btnStyle={"green"}
							width={"100%"}
						/>
						<NotificationModalForm
							isOpen={isNotificationModalFormOpen}
							setIsOpen={setIsNotificationModalFormOpen}
							customer={customerDetails?.customer}
						/>
					</>
				</div>
				<div className=" mt-3 mb-2">
					<span className="text-gray-800 text-sm font-normal my-5">
						Whatsapp
					</span>
					<>
						<CButton
							icon={<IoIosSend />}
							onClick={() => setIsWhatsappModalFormOpen(true)}
							text={"Envoyer un Whatsapp"}
							btnStyle={"green"}
							width={"100%"}
						/>
						<WhatsappModalForm
							isOpen={isWhatsappModalFormOpen}
							setIsOpen={setIsWhatsappModalFormOpen}
							customer={customerDetails?.customer}
						/>
					</>
				</div>
			</div>
			<div
				style={{ zIndex: 9000 }}
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 fixed top-0 left-0 h-full w-full flex items-center justify-center",
					{
						"!opacity-100 !visible z-20": mutation.isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>
			<a ref={redirectRef} hidden href="#"></a>
		</div>
	);
}
