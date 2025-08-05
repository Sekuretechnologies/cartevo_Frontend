import CButton from "@/components/shared/CButton";
import LabelWithBadge from "@/components/shared/LabelWithBadge";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useDispatch, useSelector } from "react-redux";
// import { Modal } from "@mui/material";
import { NairapayService } from "@/api/services/v2/nairapay";
import { selectCurrentUser } from "@/redux/slices/auth";
import { selectCurrentNairaPayment } from "@/redux/slices_v2/nairapay";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaX } from "react-icons/fa6";
import { useMutation } from "react-query";
import ConfirmStatusModal from "./modals/ConfirmSubmitModal";
import { selectCurrentChnPayment } from "@/redux/slices_v2/chinpay";
import classNames from "classnames";
import { HashLoader } from "react-spinners";

const handleUpdateChnPayment = async (queryData: any) => {
	const { currentUserId, transactionId, mode, body } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await NairapayService.update_nairapayment({
		userId: currentUserId,
		transactionId: transactionId,
		mode: mode,
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
	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	const [isConfirmStatusModalOpen, setIsConfirmStatusModalOpen] =
		useState(false);
	const [status, setStatus] = useState<string>("PENDING");
	const nairaPaymentData: any = useSelector(selectCurrentNairaPayment);
	const chnPaymentData = useSelector(selectCurrentChnPayment);
	const currentUser = useSelector(selectCurrentUser);

	console.log("chnPaymentData ::: ", chnPaymentData);
	console.log("nairaPaymentData ::: ", nairaPaymentData);

	// const handleStatus = (value: any) => {
	//   setStatus(value);
	// 	setIsConfirmStatusModalOpen(true);
	// }

	const mutation = useMutation({
		mutationFn: (data: any) =>
			handleUpdateChnPayment({
				currentUserId: currentUser?.id,
				transactionId: nairaPaymentData?.id,
				mode: data?.mode,
				body: data,
			}),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(`Erreur lors de la modification : ${err.message}`);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(`Modification effectuée avec succès`);
			redirectRef.current.href =
				"/dashboard/v2/payment_services/nairapay";
			redirectRef.current.click();
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	/** ------------------------------------------------- */
	const [shiftDown, setShiftDown] = useState(false);
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.shiftKey) {
				setShiftDown(true);
			}
		};
		const handleKeyUp = () => {
			setShiftDown(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);
	/** ------------------------------------------------- */

	return (
		<div className="pl-10 py-3 pt-5 w-[300px] grid grid-cols-1 gap-3">
			<div className="flex justify-between items-center w-full">
				<h1 className="flex-1 text-sm font-semibold text-gray-800">
					Créé le
				</h1>
				<p className="text-gray-900 text-sm font-semibold">
					{getFormattedDateTime(nairaPaymentData?.created_at)}
				</p>
			</div>
			<div className="flex justify-between items-center w-full">
				<span className="text-gray-800 text-sm font-semibold">
					Statut
				</span>
				{
					nairaPaymentData?.status === "SUCCESS" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Approuvé"}
							badgeColor={"#1F66FF"}
							textColor={"#444"}
						/>
					) : nairaPaymentData?.status === "FAILED" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"Refusé"}
							badgeColor={"#F85D4B"}
							textColor={"#444"}
						/>
					) : nairaPaymentData?.status === "PENDING" ? (
						<LabelWithBadge
							className={`text-xs`}
							label={"En attente"}
							badgeColor={"orange"}
							textColor={"#444"}
						/>
					) : (
						<LabelWithBadge
							className={`text-xs`}
							label={String(nairaPaymentData?.status)}
							badgeColor={"#000"}
							textColor={"#000"}
						/>
					)
					// :<></>
				}
			</div>

			{nairaPaymentData?.status === "PENDING" ? (
				<div className="flex flex-col items-between justify-center gap-3 mt-2">
					<CButton
						text={
							nairaPaymentData?.order_id ? "Verifier" : "Initier"
						}
						btnStyle={"green"}
						icon={<FaCheck />}
						onClick={() => onSubmit({ status })}
					/>
					{!nairaPaymentData?.order_id ? (
						<div
							className="w-full"
							style={{ display: shiftDown ? "block" : "none" }}
						>
							<CButton
								text={"Rejeter"}
								btnStyle={"red"}
								width="100%"
								icon={<FaX />}
								onClick={() =>
									setIsConfirmStatusModalOpen(true)
								}
							/>
							<ConfirmStatusModal
								status={status}
								isOpen={isConfirmStatusModalOpen}
								setIsOpen={setIsConfirmStatusModalOpen}
								onSubmit={() =>
									onSubmit({
										status: "FAILED",
										mode: "UPDATE",
									})
								}
							/>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}

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
