import { TransactionService } from "@/api/services/v2/transaction";
import { TDataList } from "@/components/cards/InfoCard";
import Title from "@/components/shared/Title";
import { useTranslation } from "@/hooks/useTranslation";
import {
	getFormattedDate,
	getFormattedDateTime,
	getFormattedTime,
} from "@/utils/DateFormat";
import {
	getCategoryMode,
	getCategoryModeV2,
	getCategoryTypeV2,
} from "@/utils/graphs";
import classNames from "classnames";
import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaX } from "react-icons/fa6";
import { useMutation } from "react-query";
import { HashLoader } from "react-spinners";
import cstyle from "../styles/style.module.scss";

// Create translated info data structure
const getInfoData = (t: any): TDataList[] => [
	[
		[
			{
				key: "type",
				label: {
					text: t.cards.modals.transactionDetails.labels.type,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", fw: "bold", color: "#444" },
			},
		],
		[
			{
				key: "date",
				label: {
					text: t.cards.modals.transactionDetails.labels.date,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", fw: "bold", color: "#444" },
			},
		],
		[
			{
				key: "heure",
				label: {
					text: t.cards.modals.transactionDetails.labels.time,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", fw: "bold", color: "#444" },
			},
		],
		[
			{
				key: "status",
				label: {
					text: t.cards.modals.transactionDetails.labels.status,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", fw: "bold", color: "#1F66FF" },
			},
		],
		[
			{
				key: "name",
				label: {
					text: t.cards.modals.transactionDetails.labels.name,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "masked_number",
				label: {
					text: t.cards.modals.transactionDetails.labels.maskedNumber,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "id",
				label: {
					text: t.cards.modals.transactionDetails.labels
						.transactionId,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "merchant_name",
				label: {
					text: t.cards.modals.transactionDetails.labels.merchantName,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "merchant_country",
				label: {
					text: t.cards.modals.transactionDetails.labels
						.merchantCountry,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "merchant_city",
				label: {
					text: t.cards.modals.transactionDetails.labels.merchantCity,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
	],
	[
		[
			{
				key: "amount",
				label: {
					text: t.cards.modals.transactionDetails.labels.amount,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", fw: "bold", color: "#444" },
			},
		],
		[
			{
				key: "fee",
				label: {
					text: t.cards.modals.transactionDetails.labels.fee,
					fw: "bold",
					color: "#444",
				},
				value: { text: "", color: "#444" },
			},
		],
		[
			{
				key: "description",
				label: {
					text: t.cards.modals.transactionDetails.labels.description,
					fw: "bold",
					color: "#444",
				},
				value: {
					text: "",
					color: "#444",
					maxWidth: "200px",
					whiteSpace: "wrap",
				},
			},
		],
	],
];

const handleVerifyTrxStatus = async (queryData: any) => {
	const { trxId } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await TransactionService.verify_trx_status({
		trxId,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

const handleCheckPartnerTrx = async (queryData: any) => {
	const { trxId } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await TransactionService.check_partner_trx({
		trxId,
	});
	if (!response.ok) {
		const responseBody = await response.json();
		throw new Error(responseBody.message);
	}
	const responseJson = await response.json();
	return responseJson;
};

interface TransferModalProps {
	item: any;
	customer: any;
	setIsOpen?: (data?: any) => void;
}
interface ItmInterface {
	[key: string]: any;
}
export default function TransactionModal({
	item,
	customer,
	setIsOpen,
}: TransferModalProps) {
	const { t }: { t: any } = useTranslation();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	// const dispatch = useDispatch();
	// const router = useRouter();
	// const cardSearchTerm:any = useSelector(selectCardSearchTerm);
	const [diagnosisOpen, setDiagnosisOpen] = useState<boolean>(false);
	const [partnerTrx, setPartnerTrx] = useState<any>(null);
	const redirectRef: any = useRef();

	const itemData = (
		itm: ItmInterface,
		infoData: TDataList[],
		customer: any,
		t: any
	): TDataList[] => {
		// Assuming TDataList is an array of arrays or a similar structure that supports forEach
		let modifiedInfoData: TDataList[] = JSON.parse(
			JSON.stringify(infoData)
		); // Shallow copy
		const itm2 = { ...itm };
		const customerFirstName =
			customer?.first_name ||
			customer?.full_name ||
			itm?.customerDetails?.first_name ||
			"";
		const customerLastName =
			customer?.last_name || itm?.customerDetails?.last_name || "";
		const customerPhone =
			customer?.phone ||
			customer?.phone_number ||
			itm?.customerDetails?.phone ||
			itm?.phone ||
			"";
		itm2.name = `${customerLastName} ${customerFirstName}`.trim();
		itm2.phone = customerPhone;
		itm2.date = "2024-02-18";
		itm2.heure = "11:18";
		itm2.merchant_name = "";
		itm2.merchant_country = "";
		itm2.merchant_city = "";
		itm2.masked_number = "";
		itm2.oldNew = "";
		itm2.customer_name = "";
		itm2.customer_phone = "";
		Object.keys(itm2).forEach((key, itmIndex) => {
			modifiedInfoData.forEach((data, dataIndex) => {
				data.forEach((line, lineIndex) => {
					line.forEach((x, xIndex) => {
						if (key.toString() === String(x.key)) {
							if (key.toString() === "name") {
								x.value.text =
									`${customerLastName} ${customerFirstName}`.trim();
							} else if (key.toString() === "oldNew") {
								x.value.text = itm?.is_from_v1
									? "Ancien"
									: "Nouveau";
								x.value.color = itm?.is_from_v1
									? "#444"
									: "#1F66FF";
							} else if (key.toString() === "masked_number") {
								x.value.text = itm?.card?.masked_number;
							} else if (key.toString() === "customer_phone") {
								x.value.text = `${itm?.phone}`;
							} else if (key.toString() === "customer_name") {
								x.value.text = `${itm?.customerDetails?.last_name} ${itm?.customerDetails?.first_name}`;
							} else if (key.toString() === "country") {
								x.value.text = itm?.userDetails?.country;
							} else if (key.toString() === "date") {
								x.value.text = getFormattedDate(
									itm["created_at"]
								);
							} else if (key.toString() === "heure") {
								x.value.text = getFormattedTime(
									itm["created_at"]
								);
							} else if (key.toString() === "phone") {
								x.value.text = customerPhone;
							} else if (key.toString() === "merchant_name") {
								x.value.text = itm.merchant?.name ?? "";
							} else if (key.toString() === "merchant_country") {
								x.value.text = itm.merchant?.country ?? "";
							} else if (key.toString() === "merchant_city") {
								x.value.text = itm.merchant?.city ?? "";
							} else if (key.toString() === "amount_xaf") {
								const CurrencyValue = itm?.amount_user_currency
									? `(${itm?.amount_user_currency?.toLocaleString(
											"fr-FR"
									  )} ${itm?.user_currency})`
									: "";
								const USDValue = itm?.amount_usd
									? `(${itm?.amount_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]?.toLocaleString("fr-FR") ?? 0) +
									" XAF " +
									CurrencyValue +
									USDValue;
								if (
									getCategoryModeV2(
										itm.category,
										itm.type,
										itm.mode
									).mode == "CREDIT"
								) {
									x.value.color = "#1F66FF";
								} else if (
									getCategoryModeV2(
										itm.category,
										itm.type,
										itm.mode
									).mode == "DEBIT"
								) {
									x.value.color = "#F85D4B";
								}
							} else if (key.toString() === "old_balance_xaf") {
								const CurrencyValue =
									itm?.old_balance_user_currency
										? `(${itm?.old_balance_user_currency?.toLocaleString(
												"fr-FR"
										  )} ${itm?.user_currency})`
										: "";
								const USDValue = itm?.old_balance_usd
									? `(${itm?.old_balance_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]?.toLocaleString("fr-FR") ?? 0) +
									" XAF " +
									CurrencyValue +
									USDValue;
								x.value.color = "#999";
							} else if (key.toString() === "new_balance_xaf") {
								const CurrencyValue =
									itm?.new_balance_user_currency
										? `(${itm?.new_balance_user_currency?.toLocaleString(
												"fr-FR"
										  )} ${itm?.user_currency})`
										: "";
								const USDValue = itm?.new_balance_usd
									? `(${itm?.new_balance_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]?.toLocaleString("fr-FR") ?? 0) +
									" XAF " +
									CurrencyValue +
									USDValue;
							} else if (
								key.toString() === "card_old_balance_xaf"
							) {
								const USDValue = itm?.card_old_balance_usd
									? `(${itm?.card_old_balance_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]?.toLocaleString("fr-FR") ?? 0) +
									" XAF " +
									USDValue;
								x.value.color = "#999";
							} else if (
								key.toString() === "card_new_balance_xaf"
							) {
								const USDValue = itm?.card_new_balance_usd
									? `(${itm?.card_new_balance_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]?.toLocaleString("fr-FR") ?? 0) +
									" XAF " +
									USDValue;
							} else if (key.toString() === "fee_xaf") {
								const CurrencyValue = itm?.fee_user_currency
									? `(${itm?.fee_user_currency?.toLocaleString(
											"fr-FR"
									  )} ${itm?.user_currency})`
									: "";
								const USDValue = itm?.fee_usd
									? `(${itm?.fee_usd?.toLocaleString(
											"fr-FR"
									  )} USD)`
									: "";
								x.value.text =
									(itm[key]
										? itm[key]?.toLocaleString("fr-FR")
										: itm.category === "card" &&
										  (itm.type === "topup" ||
												itm.type === "withdrawal")
										? itm?.fee
										: 0) +
									" XAF " +
									CurrencyValue +
									USDValue;
								x.value.color = "#F85D4B";
							} else if (key.toString() === "author") {
								x.value.text = itm[key]?.name ?? "";
							} else if (key.toString() === "status") {
								if (itm[key] === "SUCCESS") {
									x.value.text =
										t.cards.modals.transactionDetails.statusValues.success;
									x.value.color = "#1F66FF";
								} else if (itm[key] === "FAILED") {
									x.value.text =
										t.cards.modals.transactionDetails.statusValues.failed;
									x.value.color = "#F85D4B";
								} else if (
									itm[key] === "PENDING" ||
									itm[key] === "pending"
								) {
									x.value.text =
										t.cards.modals.transactionDetails.statusValues.pending;
									x.value.color = "orange";
								} else if (
									itm[key] === "CANCELLED" ||
									itm[key] === "CANCELED"
								) {
									x.value.text =
										t.cards.modals.transactionDetails.statusValues.cancelled;
									x.value.color = "#777";
								} else if (itm[key] === "INITIATED") {
									x.value.text =
										t.cards.modals.transactionDetails.statusValues.initiated;
									x.value.color = "#007FFF";
								}
							} else if (key.toString() === "created_at") {
								x.value.text = getFormattedDateTime(itm[key]);
							} else if (key.toString() === "type") {
								x.value.text = getCategoryTypeV2(
									itm.category,
									itm.type
								);
							} else if (key.toString() === "mode") {
								x.value.text = `${
									getCategoryMode(
										itm.category,
										itm.type,
										itm.mode
									).text
								} (${itm.mode})`;
								if (
									getCategoryMode(
										itm.category,
										itm.type,
										itm.mode
									).mode == "CREDIT"
								) {
									x.value.color = "#1F66FF";
								} else if (
									getCategoryMode(
										itm.category,
										itm.type,
										itm.mode
									).mode == "DEBIT"
								) {
									x.value.color = "#F85D4B";
								}
							} else {
								x.value.text = String(itm[key]);
							}
						}
					});
				});
			});
		});
		return modifiedInfoData; // Consider adjusting the return type if necessary
	};

	const mutationVerifyTrxStatus = useMutation({
		mutationFn: (data) => handleVerifyTrxStatus({ trxId: item?.id }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`${t.cards.modals.transactionDetails.messages.verificationError} : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				t.cards.modals.transactionDetails.messages.verificationSuccess
			);
			redirectRef.current.href = `${window.location.pathname}?${searchParams}`;
			redirectRef.current.click();
		},
	});

	const handleVerifyTransactionStatus = (trxId: any) => {
		const data: any = { trxId };
		mutationVerifyTrxStatus.mutate(data);
	};

	const mutationCheckPartnerTrx = useMutation({
		mutationFn: (data) => handleCheckPartnerTrx({ trxId: item?.id }),
		onError: (err: any) => {
			console.error("onError : ", err.message);
			toast.error(
				`${t.cards.modals.transactionDetails.messages.verificationError} : ${err.message}`
			);
		},
		onSuccess: (data) => {
			console.log("onSuccess : ", data);
			toast.success(
				t.cards.modals.transactionDetails.messages.verificationSuccess
			);
			setPartnerTrx(data);
			// redirectRef.current.href = `${window.location.pathname}${searchParams}`;
			// redirectRef.current.click();
		},
	});

	const handleCheckPartnerTransaction = (trxId: any) => {
		if (!diagnosisOpen) {
			const data: any = { trxId };
			setDiagnosisOpen(true);
			if (!partnerTrx) mutationCheckPartnerTrx.mutate(data);
		} else {
			setDiagnosisOpen(false);
		}
	};

	const onError = (err: any) => {
		console.error("any", err);
	};

	console.log(`window.location.pathname :: ${window.location.pathname}`);
	console.log(`searchParams :: ${searchParams}`);
	console.log(
		`window.location.pathname - searchParams ::${window.location.pathname}?${searchParams}`
	);

	return (
		<div className="bg-white m-auto p-8 rounded-md">
			<div className="flex justify-between mb-5">
				<Title title={t.cards.modals.transactionDetails.title} />
				{/* {customer.name} */}
				<div className="flex justify-end items-center gap-5">
					{/* {item?.category === "wallet" ||
					item?.category === "service" ||
					item?.category === "card" ? (
						<div className={`flex gap-3`}>
							<CButton
								text={
									diagnosisOpen
										? "Retour"
										: `Diagnostiquer la transaction`
								}
								btnStyle={"lightGreen"}
								onClick={() =>
									handleCheckPartnerTransaction(item?.id)
								}
								// icon={<FaEdit/>}
								width={"100%"}
								height={"35px"}
							/>
							<CustomDropdown
								cstyle={"outline"}
								iconSize={20}
								hasDropdownIcon={false}
								icon={<RxDotsHorizontal />}
								items={[
									<div
										key={"1"}
										className="flex justify-between gap-2"
									>
										<span
											onClick={() =>
												handleVerifyTransactionStatus(
													item?.id
												)
											}
											style={{ whiteSpace: "nowrap" }}
											className="text-sm"
										>
											{"Verifier le statut"}
										</span>
									</div>,
								]}
							/>
						</div>
					) : (
						<></>
					)} */}
					<div
						className="cursor-pointer"
						onClick={() => setIsOpen && setIsOpen(false)}
					>
						<FaX size={16} color={"#444"} />
					</div>
				</div>
			</div>

			{diagnosisOpen ? (
				<>
					<div className="grid grid-cols-2 gap-3 w-full">
						<div>
							<span className={"mb-3"}>SEKURE</span>
							<div className="bg-gray-100 overflow-scroll max-h-[500px]">
								<pre>{JSON.stringify(item, null, 2)}</pre>
							</div>
						</div>
						<div>
							<span className={"mb-3"}>
								{item?.provider?.toUpperCase()}
							</span>
							<div className="bg-gray-100 overflow-scroll  max-h-[500px]">
								<pre>
									{JSON.stringify(partnerTrx?.data, null, 2)}
								</pre>
							</div>
						</div>
					</div>
				</>
			) : (
				<div className={`${cstyle["dualGrid"]}`}>
					{itemData(item, getInfoData(t), customer, t).map(
						(data, index) => (
							<div key={index} className={``}>
								{data.map((line, index1) => (
									<div
										key={index1}
										className={`flex flex-wrap justify-between items-center mx-1`}
									>
										{line.map((item, index2) => (
											<div
												key={index2}
												className={`my-3 grid grid-cols-2 gap-3 w-full`}
											>
												<span
													title={
														item.label.tooltip ?? ""
													}
													style={{
														fontSize:
															item.label.fs ??
															"14px",
														color:
															item.label.color ??
															"#444",
													}}
													className={`font-${
														item.label.fw ??
														"normal"
													}`}
												>
													{item.label.text}
												</span>
												<span
													title={
														item.value.tooltip ?? ""
													}
													style={{
														maxWidth:
															item.value
																.maxWidth ??
															"unset",
														whiteSpace:
															item.value
																.whiteSpace ??
															"unset",
														fontSize:
															item.value.fs ??
															"14px",
														color:
															item.value.color ??
															"#444",
													}}
													className={`font-${
														item.value.fw ??
														"normal"
													}`}
												>
													{item.value.text}
												</span>
											</div>
										))}
									</div>
								))}
							</div>
						)
					)}
				</div>
			)}

			<div
				className={classNames(
					"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
					{
						"!opacity-100 !visible z-20":
							mutationVerifyTrxStatus.isLoading,
					}
				)}
			>
				<HashLoader className="shrink-0" size={50} color="#1F66FF" />
			</div>
			<a ref={redirectRef} hidden href="#"></a>
			{/* <div className='flex gap-5 mt-8'>
                <CButton
                text={'Voir utilisateur'}
                href={``}
                btnStyle={'dark'}
                icon={<FourDots />}  
                height={'32px'}            
                width={'100%'}
                />
                <CButton
                text={'Copier'}
                icon={<IoCopyOutline/>}
                btnStyle={'lightGreen'}
                height={'32px'}
                width={'100%'}
                />
        </div> */}
		</div>
	);
}
