"use client";
import { WalletService } from "@/api/services/cartevo-api/wallets";
import FundLocalCurrencyWalletModal, {
	FundLocalCurrencyWalletSubmitProps,
} from "@/components/cards/FundLocalCurrencyWalletModal";
import TransferBetweenWalletsModal from "@/components/cards/TransferBetweenWalletsModal";
import TransferPayInPayOutModal from "@/components/cards/TransferPayInPayOutModal";
import WithdrawFundsModal from "@/components/cards/WithdrawFundsModal";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { ItemFlag } from "@/components/shared/ItemFlag";
import Layout from "@/components/shared/Layout";
import LoadingOverlay from "@/components/shared/LoadingOverlay";
import Modal from "@/components/shared/Modal/Modal";
import PhoneInput from "@/components/shared/PhoneInput";
import Title from "@/components/shared/Title";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { headerWalletTransactionData } from "@/constants/TransactionData";
import { useTitle } from "@/hooks/useTitle";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { getFormattedDateTime } from "@/utils/DateFormat";
import classNames from "classnames";
import { MoreVertical, Pencil, Replace, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineFileDownload } from "react-icons/md";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";

const getOneWallet = async ({ queryKey }: any) => {
	const [_key, token, id] = queryKey;
	const response = await WalletService.get_wallet({ token, id });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get wallet");
	}
	// Backend returns data in responseJson.data (fallback to .output for backward compatibility)
	return responseJson.data || responseJson.output;
};

const getWalletTransactions = async ({ queryKey }: any) => {
	const [_key, token, id] = queryKey;
	const response = await WalletService.get_wallet_transactions({
		token,
		walletId: id,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get wallet transactions"
		);
	}
	// Backend returns data in responseJson.data for transactions
	return responseJson.data || [];
};

export default function WalletDetailsPage() {
	useTitle("Cartevo | Wallet details", true);
	const { id } = useParams();
	const router = useRouter();
	const token: any = useSelector(selectCurrentToken);
	const currentUser: any = useSelector(selectCurrentUser);
	const [filterContent, setFilterContent] = useState({});
	// Modal states
	const [showTransferPayInPayOutModal, setShowTransferPayInPayOutModal] =
		useState(false);
	// Track source for unified transfer modal (MAIN or PAYOUT)
	const [transferSource, setTransferSource] = useState<"MAIN" | "PAYOUT">(
		"PAYOUT"
	);
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const [showTransferBetweenModal, setShowTransferBetweenModal] =
		useState(false);
	// Loading states for actions
	const [isTransferring, setIsTransferring] = useState(false);
	const [isWithdrawing, setIsWithdrawing] = useState(false);
	const [isTransferringBetween, setIsTransferringBetween] = useState(false);
	const [isFunding, setIsFunding] = useState(false);
	// Phone number management
	const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
	const [isSavingPhone, setIsSavingPhone] = useState(false);
	const [newPhone, setNewPhone] = useState({
		country_phone_code: "",
		phone_number: "",
		operator: "",
	});
	// New modals for MAIN -> PAYIN / MAIN -> PAYOUT
	const [showMainToPayInModal, setShowMainToPayInModal] = useState(false);
	const [showMainToPayOutModal, setShowMainToPayOutModal] = useState(false);
	// Fund wallet modal
	const [showFundWalletModal, setShowFundWalletModal] = useState(false);

	const [mainTransferAmount, setMainTransferAmount] = useState("");
	const [mainTransferReason, setMainTransferReason] = useState("");
	const [showSendPopover, setShowSendPopover] = useState(false);
	const [showTotalToPayOutModal, setShowTotalToPayOutModal] = useState(false);
	const [totalToPayOutAmount, setTotalToPayOutAmount] = useState("");
	const [totalToPayOutReason, setTotalToPayOutReason] = useState("");
	// New modals for PAYIN -> (PAYOUT|MAIN)
	const [showPayInToPayOutModal, setShowPayInToPayOutModal] = useState(false);
	const [showPayInToMainModal, setShowPayInToMainModal] = useState(false);
	const [payInTransferAmount, setPayInTransferAmount] = useState("");
	const [payInTransferReason, setPayInTransferReason] = useState("");
	const [isDeletingPhoneId, setIsDeletingPhoneId] = useState<string | null>(
		null
	);
	const [showDeletePhoneModal, setShowDeletePhoneModal] = useState(false);
	const [showEditPhoneModal, setShowEditPhoneModal] = useState(false);
	const [selectedPhone, setSelectedPhone] = useState<any>(null);
	const [editPhoneValue, setEditPhoneValue] = useState<{
		country_phone_code: string;
		phone_number: string;
	}>({ country_phone_code: "", phone_number: "" });
	// Add Phone modal validation state
	const [phoneNumberError, setPhoneNumberError] = useState<string>("");
	const walletQuery = useQuery({
		queryKey: ["oneWallet", token, id],
		queryFn: getOneWallet,
		onError: () => toast.error("Failed to get wallet details."),
		enabled: !!token && !!id,
	});
	const walletTrxQuery = useQuery({
		queryKey: ["walletTransactions", token, id],
		queryFn: getWalletTransactions,
		onError: () => toast.error("Failed to get wallet transactions."),
		enabled: !!token && !!id,
	});
	const walletDetails = useMemo(() => {
		const w = walletQuery.data;
		if (!w) return null;
		return {
			id: w.id,
			balance: Number(w.balance ?? 0),
			payin_balance: Number(w.payin_balance ?? 0),
			payout_balance: Number(w.payout_balance ?? 0),
			payin_amount: Number(w.payin_amount ?? 0),
			payout_amount: Number(w.payout_amount ?? 0),
			currency: w.currency,
			country: w.country,
			country_iso_code: w.country_iso_code,
			country_phone_code: w.country_phone_code,
			active: w.active,
			company_id: w.company_id,
			created_at: w.created_at,
			updated_at: w.updated_at,
			company: w.company,
			phoneNumbers: w.phoneNumbers || [],
			operators: w.operators || [],
			payInAmount: Number(w.payInAmount ?? 0),
			payOutAmount: Number(w.payOutAmount ?? 0),
		};
	}, [walletQuery.data]);

	const totalBalance = useMemo(() => {
		return (
			Number(walletDetails?.balance || 0) +
			Number(walletDetails?.payin_balance || 0)
		);
	}, [walletDetails]);
	const tableData = useMemo(() => {
		const list = walletTrxQuery.data || [];
		return list
			.sort(
				(a: any, b: any) =>
					new Date(b.created_at).getTime() -
					new Date(a.created_at).getTime()
			)
			.map((item: any, index: number) => {
				// Determine transaction type display
				const getTransactionTypeDisplay = (
					category: string,
					type: string
				) => {
					if (category && type) {
						return `${category} / ${type}`;
					}
					return category || type || "Unknown";
				};
				// Get status badge
				const getStatusBadge = (status: string) => {
					switch (status?.toUpperCase()) {
						case "SUCCESS":
						case "COMPLETED":
							return (
								<BadgeLabel
									className="text-xs"
									label="Success"
									badgeColor="#1F66FF"
									textColor="#444"
								/>
							);
						case "FAILED":
						case "ERROR":
							return (
								<BadgeLabel
									className="text-xs"
									label="Failed"
									badgeColor="#F85D4B"
									textColor="#444"
								/>
							);
						case "PENDING":
							return (
								<BadgeLabel
									className="text-xs"
									label="Pending"
									badgeColor="#FFAC1C"
									textColor="#444"
								/>
							);
						case "CANCELLED":
						case "CANCELED":
							return (
								<BadgeLabel
									className="text-xs"
									label="Cancelled"
									badgeColor="#444"
									textColor="#444"
								/>
							);
						default:
							return (
								<BadgeLabel
									className="text-xs"
									label={status || "Unknown"}
									badgeColor="#444"
									textColor="#444"
								/>
							);
					}
				};
				// Format amount with proper sign
				const formatAmount = (amount: number, type: string) => {
					const formattedAmount =
						amount?.toLocaleString("en-EN") ?? 0;
					const isDebit =
						type?.toLowerCase().includes("withdraw") ||
						type?.toLowerCase().includes("debit");
					return (
						<span
							className={`font-medium ${
								isDebit ? "text-red-600" : "text-green-600"
							}`}
						>
							{isDebit ? "-" : "+"}
							{formattedAmount}
						</span>
					);
				};
				return {
					serial: index + 1,
					type: getTransactionTypeDisplay(item.category, item.type),
					wallet: item.wallet
						? `${item.wallet.country_iso_code} - ${item.wallet.currency}`
						: "N/A",
					phone: item.phone_number || "-",
					idTrx: (
						<span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
							{item.id}
						</span>
					),
					currency: item.currency || "-",
					amount: formatAmount(item.amount, item.type),
					status: getStatusBadge(item.status),
					date: getFormattedDateTime(item.created_at, "en"),
					actions: <></>,
				};
			});
	}, [walletTrxQuery.data]);
	// Action handlers
	const handleTransferPayInPayOut = async (data: any) => {
		setIsTransferring(true);
		try {
			// If direction is PAYOUT → MAIN, use advanced internal transfer endpoint
			let res: Response;
			if (data?.direction === "PAYOUT_TO_MAIN") {
				res = await WalletService.transfer_internal_advanced({
					token,
					walletId: walletDetails?.id,
					body: {
						amount: Number(data.amount),
						from_type: "PAYOUT",
						to_type: "MAIN",
						reason: data.reason,
					},
				});
			} else if (
				data?.direction === "MAIN_TO_PAYIN" ||
				data?.direction === "MAIN_TO_PAYOUT"
			) {
				res = await WalletService.transfer_internal_advanced({
					token,
					walletId: walletDetails?.id,
					body: {
						amount: Number(data.amount),
						from_type: "MAIN",
						to_type:
							data?.direction === "MAIN_TO_PAYIN"
								? "PAYIN"
								: "PAYOUT",
						reason: data.reason,
					},
				});
			} else {
				const body = {
					amount: Number(data.amount),
					direction: data.direction,
					reason: data.reason,
				};
				res = await WalletService.transfer_internal({
					token,
					walletId: walletDetails?.id,
					body,
				});
			}
			const json = await res.json();
			if (!res.ok || json?.success === false)
				throw new Error(json?.message || "Transfer failed");
			toast.success(json?.message || "Transfer completed successfully");
			setShowTransferPayInPayOutModal(false);
			walletQuery.refetch();
		} catch (error: any) {
			toast.error(error?.message || "Transfer failed");
		} finally {
			setIsTransferring(false);
		}
	};

	const handleWithdraw = async (data: any) => {
		setIsWithdrawing(true);
		try {
			const body = {
				walletId: walletDetails?.id,
				amount: Number(data.amount),
				phone_number: data.phone_number,
				operator: data.operator,
				reason: data.reason,
				user_id: data.user_id,
			};

			const res = await WalletService.withdraw_wallet({
				token,
				body: body as any,
			});
			const json = await res.json();
			if (!res.ok || json?.success === false)
				throw new Error(json?.message || "Withdrawal failed");
			toast.success(json?.message || "Withdrawal initiated successfully");
			setShowWithdrawModal(false);
			walletQuery.refetch();
		} catch (error: any) {
			toast.error(error?.message || "Withdrawal failed");
		} finally {
			setIsWithdrawing(false);
		}
	};

	const submitTotalToPayOut = async () => {
		if (!walletDetails?.id) return;
		const amountNum = Number(totalToPayOutAmount);
		if (!amountNum || amountNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		const availableTotal =
			Number(walletDetails.balance) + Number(walletDetails.payin_balance);
		if (amountNum > availableTotal) {
			toast.error("Amount exceeds Total Balance");
			return;
		}
		setIsTransferring(true);
		try {
			const neededFromMain = Math.min(
				amountNum,
				Number(walletDetails.balance)
			);
			const neededFromPayIn = Math.max(amountNum - neededFromMain, 0);

			if (neededFromMain > 0) {
				const res1 = await WalletService.transfer_internal_advanced({
					token,
					walletId: walletDetails.id,
					body: {
						amount: neededFromMain,
						from_type: "MAIN",
						to_type: "PAYOUT",
						reason: totalToPayOutReason,
					},
				});
				const json1 = await res1.json();
				if (!res1.ok || json1?.success === false)
					throw new Error(
						json1?.message || "Transfer from Main failed"
					);
			}

			if (neededFromPayIn > 0) {
				const res2 = await WalletService.transfer_internal_advanced({
					token,
					walletId: walletDetails.id,
					body: {
						amount: neededFromPayIn,
						from_type: "PAYIN",
						to_type: "PAYOUT",
						reason: totalToPayOutReason,
					},
				});
				const json2 = await res2.json();
				if (!res2.ok || json2?.success === false)
					throw new Error(
						json2?.message || "Transfer from PayIn failed"
					);
			}

			toast.success("Total transferred to PayOut successfully");
			setShowTotalToPayOutModal(false);
			setTotalToPayOutAmount("");
			setTotalToPayOutReason("");
			walletQuery.refetch();
		} catch (e: any) {
			toast.error(e?.message || "Transfer failed");
		} finally {
			setIsTransferring(false);
		}
	};

	const handleFundWallet = async (
		data: FundLocalCurrencyWalletSubmitProps
	) => {
		if (!walletDetails?.id) return;
		setIsFunding(true);
		try {
			const res = await WalletService.fund_wallet({
				token,
				body: data as any,
			});
			const json = await res.json();
			if (!res.ok || json?.success === false)
				throw new Error(json?.message || "Failed to fund wallet");
			toast.success(json?.message || "Wallet funding initiated !");
			setShowFundWalletModal(false);
			walletQuery.refetch();
		} catch (e: any) {
			toast.error(e?.message || "Failed to fund wallet");
		} finally {
			setIsFunding(false);
		}
	};
	const handleTransferBetween = async (data: any) => {
		setIsTransferringBetween(true);
		try {
			const body = {
				from_wallet_id: walletDetails?.id,
				to_wallet_id: data.to_wallet_id,
				amount: Number(data.amount),
				reason: data.reason,
			};
			const res = await WalletService.transfer_between({ token, body });
			const json = await res.json();
			if (!res.ok || json?.success === false)
				throw new Error(json?.message || "Transfer failed");
			toast.success(json?.message || "Transfer completed successfully");
			setShowTransferBetweenModal(false);
			walletQuery.refetch();
		} catch (error: any) {
			toast.error(error?.message || "Transfer failed");
		} finally {
			setIsTransferringBetween(false);
		}
	};
	// MAIN -> PAYIN / PAYOUT advanced internal transfer
	const submitMainTransfer = async (toType: "PAYIN" | "PAYOUT") => {
		if (!walletDetails?.id) return;
		const amountNum = Number(mainTransferAmount);
		if (!amountNum || amountNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		setIsTransferring(true);
		try {
			const res = await WalletService.transfer_internal_advanced({
				token,
				walletId: walletDetails.id,
				body: {
					amount: amountNum,
					from_type: "MAIN",
					to_type: toType,
					reason: mainTransferReason,
				},
			});
			const json = await res.json();
			if (!res.ok || json?.success === false) {
				throw new Error(json?.message || "Transfer failed");
			}
			toast.success(json?.message || "Transfer completed successfully");
			setShowMainToPayInModal(false);
			setShowMainToPayOutModal(false);
			setMainTransferAmount("");
			setMainTransferReason("");
			walletQuery.refetch();
		} catch (e: any) {
			toast.error(e?.message || "Transfer failed");
		} finally {
			setIsTransferring(false);
		}
	};
	// PAYIN -> (PAYOUT | MAIN) advanced internal transfer
	const submitPayInTransfer = async (toType: "PAYOUT" | "MAIN") => {
		if (!walletDetails?.id) return;
		const amountNum = Number(payInTransferAmount);
		if (!amountNum || amountNum <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		setIsTransferring(true);
		try {
			const res = await WalletService.transfer_internal_advanced({
				token,
				walletId: walletDetails.id,
				body: {
					amount: amountNum,
					from_type: "PAYIN",
					to_type: toType,
					reason: payInTransferReason,
				},
			});
			const json = await res.json();
			if (!res.ok || json?.success === false) {
				throw new Error(json?.message || "Transfer failed");
			}
			toast.success(json?.message || "Transfer completed successfully");
			setShowPayInToPayOutModal(false);
			setShowPayInToMainModal(false);
			setPayInTransferAmount("");
			setPayInTransferReason("");
			walletQuery.refetch();
		} catch (e: any) {
			toast.error(e?.message || "Transfer failed");
		} finally {
			setIsTransferring(false);
		}
	};
	const loadAvailableWallets = async () => {
		try {
			const res = await WalletService.get_available_wallets_for_transfer({
				token,
				sourceWalletId: walletDetails?.id,
			});
			const json = await res.json();
			if (!res.ok || json?.success === false)
				throw new Error(
					json?.message || "Failed to get available wallets"
				);
			return json.data || [];
		} catch (e) {
			toast.error("Failed to get available wallets");
			return [];
		}
	};
	// Phone numbers: add
	const handleAddPhone = async () => {
		if (!walletDetails?.id) return;
		// Block numbers starting with + (indicatif handled separately)
		if (/^\s*\+/.test(newPhone.phone_number)) {
			toast.error(
				"N'entrez pas l'indicatif (+...). Renseignez seulement le numéro."
			);
			return;
		}
		if (!newPhone.phone_number || !newPhone.country_phone_code) {
			toast.error(
				"Veuillez renseigner le numéro et le code téléphonique"
			);
			return;
		}
		setIsSavingPhone(true);
		try {
			const res = await WalletService.create_wallet_phone_number({
				token,
				body: {
					wallet_id: walletDetails.id,
					country_iso_code: walletDetails.country_iso_code,
					country_phone_code: newPhone.country_phone_code,
					currency: walletDetails.currency,
					phone_number: newPhone.phone_number,
					operator: newPhone.operator,
				},
			});
			const json = await res.json();
			if (
				!res.ok ||
				json?.status === "error" ||
				json?.success === false
			) {
				throw new Error(json?.message || "Failed to add phone number");
			}
			toast.success(json?.message || "Numéro ajouté avec succès");
			setShowAddPhoneModal(false);
			setNewPhone({
				country_phone_code: "",
				phone_number: "",
				operator: "",
			});
			walletQuery.refetch();
		} catch (e: any) {
			toast.error(e?.message || "Echec d'ajout du numéro");
		} finally {
			setIsSavingPhone(false);
		}
	};
	return (
		<Layout title={"Wallet Details"}>
			<section className="mt-2">
				{walletQuery.status === "loading" ? (
					<div
						className={classNames(
							"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
							{
								"!opacity-100 !visible z-[1000]":
									isTransferring,
							}
						)}
					>
						<PuffLoader
							className="shrink-0"
							size={50}
							color="#1F66FF"
						/>
					</div>
				) : walletDetails ? (
					<>
						{/* Wallet Information Card */}
						<div className="bg-white shadow-md rounded-xl p-6 mb-6">
							<div className="flex items-center justify-between mb-6">
								<Title title="Wallet Information" />
								<BadgeLabel
									className="text-xs"
									label={
										walletDetails.active
											? "Active"
											: "Inactive"
									}
									badgeColor={
										walletDetails.active
											? "#10B981"
											: "#EF4444"
									}
									textColor="#fff"
								/>
							</div>
							<div className="grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 gap-6">
								{/* Total Balance Section */}
								<div className="border-2 border-blue-50 p-4 rounded-lg flex lg:col-span-2 md:col-span-1">
									<div className="w-3/4">
										<div className="flex items-center gap-3 mb-2">
											<span className="text-sm font-medium text-gray-600">
												Total Balance
											</span>
											{walletDetails.country_iso_code && (
												<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
													<ItemFlag
														iso2={
															walletDetails.country_iso_code
														}
													/>
												</span>
											)}
										</div>
										<div className="text-2xl font-bold text-gray-900">
											{totalBalance?.toLocaleString(
												"en-EN"
											) ?? 0}
											<span className="text-sm font-normal text-gray-600 ml-1">
												{walletDetails.currency}
											</span>
										</div>
										<div className="mt-2 space-y-1">
											<div className="flex items-center  text-sm text-gray-600">
												<span>Main Balance</span>
												<span className="font-medium text-gray-900 ml-[20%]">
													{walletDetails.balance?.toLocaleString(
														"en-EN"
													) ?? 0}
													<span className="text-medium font-normal text-gray-600 ml-1">
														{walletDetails.currency}
													</span>
												</span>
											</div>
											<div className="flex items-center  text-sm text-gray-600">
												<span>Collected Balance</span>
												<span className="font-medium text-gray-900 ml-[20%]">
													{walletDetails.payin_balance?.toLocaleString(
														"en-EN"
													) ?? 0}
													<span className="text-medium font-normal text-gray-600 ml-1">
														{walletDetails.currency}
													</span>
												</span>
											</div>
										</div>
									</div>
									<div className="mt-3 flex flex-col gap-2  w-2/4 ">
										<CButton
											text={"Fund"}
											btnStyle={"blue"}
											icon={
												<MdOutlineFileDownload
													size={50}
												/>
											}
											onClick={() => {
												setShowFundWalletModal(true);
											}}
											width={"100%"}
											height={"36px"}
											style={{
												padding: "11px",
												maxHeight: "40px",
											}}
										/>

										<div className="relative w-full  ">
											<CButton
												text={"Actions"}
												btnStyle={"outlineDark"}
												icon={
													<MoreVertical size={16} />
												}
												width={"100%"}
												height={"36px"}
												onClick={() =>
													setShowSendPopover(
														(v) => !v
													)
												}
												style={{
													padding: "11px",
													maxHeight: "40px",
													marginTop: "10px",
												}}
											/>
											{showSendPopover && (
												<div
													className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black/5 p-2 z-[100] animate-[fadeZoom_160ms_ease-out]"
													style={{
														animationName:
															"fadeZoom",
														animationDuration:
															"200ms",
														animationTimingFunction:
															"ease-out",
													}}
													onMouseLeave={() =>
														setShowSendPopover(
															false
														)
													}
												>
													<button
														className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-sm text-gray-800"
														onClick={() => {
															setShowSendPopover(
																false
															);
															setTotalToPayOutAmount(
																String(
																	totalBalance
																)
															);
															setTotalToPayOutReason(
																""
															);
															setShowTotalToPayOutModal(
																true
															);
														}}
													>
														Transfer to PayOut
													</button>
													<button
														className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-sm text-gray-800"
														onClick={() => {
															setShowSendPopover(
																false
															);
															setShowTransferBetweenModal(
																true
															);
														}}
													>
														Transfer to another
														wallet
													</button>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* PayOut Balance */}
								<div className="border-neutral-100 border-2 bg-white p-4 rounded-lg flex shadow-sm">
									<div className="w-3/4">
										<div className="text-sm font-medium text-gray-600 mb-1">
											PayOut Balance
										</div>
										<div className="text-2xl font-bold text-red-600">
											{walletDetails.payout_balance?.toLocaleString(
												"en-EN"
											) ?? 0}
											<span className="text-sm font-normal text-gray-600 ml-1">
												{walletDetails.currency}
											</span>
										</div>
									</div>
									<div className="mt-3 grid grid-cols-1 gap-2 gap-t-1 w-2/4">
										{/* <CButton
											text={"transfer"}
											btnStyle={"outlineDark"}
											onClick={() => {
												setTransferSource("PAYOUT");
												setShowTransferPayInPayOutModal(
													true
												);
											}}
											width={"100%"}
											height={"36px"}
										/> */}

										<div className="w-full h-full flex ">
											<CButton
												text={"withdraw"}
												btnStyle={"red"}
												onClick={() =>
													setShowWithdrawModal(true)
												}
												width={"100%"}
												height={"36px"}
												style={{
													padding: "11px",
													maxHeight: "40px",
												}}
											/>
										</div>
									</div>
								</div>
								{/* Currency & Country */}
							</div>
							{/* Additional Details */}
							<div className="mt-6 pt-6 border-t border-gray-200">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium text-gray-600">
											Wallet ID:
										</span>
										<span className="ml-2 text-gray-900 font-mono">
											{walletDetails.id}
										</span>
									</div>
									<div>
										<span className="font-medium text-gray-600">
											Company:
										</span>
										<span className="ml-2 text-gray-900">
											{walletDetails.company
												?.business_name ||
												walletDetails.company?.name ||
												"N/A"}
										</span>
										{walletDetails.company?.email && (
											<div className="text-xs text-gray-500 mt-1">
												{walletDetails.company.email}
											</div>
										)}
									</div>
									<div>
										<span className="font-medium text-gray-600">
											Created:
										</span>
										<span className="ml-2 text-gray-900">
											{getFormattedDateTime(
												walletDetails.created_at,
												"en"
											)}
										</span>
									</div>
									<div>
										<span className="font-medium text-gray-600">
											Last Updated:
										</span>
										<span className="ml-2 text-gray-900">
											{getFormattedDateTime(
												walletDetails.updated_at,
												"en"
											)}
										</span>
									</div>
								</div>
							</div>
							{/* Phone Numbers Section */}
							{walletDetails.phoneNumbers &&
								walletDetails.phoneNumbers.length >= 0 && (
									<div className="mt-6 pt-6 border-t border-gray-200">
										<div className="flex items-center justify-between mb-4">
											<h3 className="text-lg font-semibold text-gray-900">
												Associated Phone Numbers
											</h3>
											<CButton
												text={"+ Add"}
												btnStyle={"blue"}
												onClick={() => {
													setNewPhone({
														country_phone_code:
															walletDetails?.country_phone_code ||
															"",
														phone_number: "",
														operator: "",
													});
													setShowAddPhoneModal(true);
												}}
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{walletDetails.phoneNumbers.map(
												(phone: any, index: number) => (
													<div
														key={index}
														className="p-3 bg-gray-50 rounded-lg"
													>
														<div className="flex items-center justify-between">
															<div>
																<div className="font-medium text-gray-900">
																	{
																		phone.country_phone_code
																	}{" "}
																	{
																		phone.phone_number
																	}
																</div>
																<div className="text-sm text-gray-500">
																	{
																		phone.operator
																	}{" "}
																	•{" "}
																	{
																		phone.currency
																	}
																</div>
															</div>
															<div className="flex items-center gap-3">
																<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
																	<ItemFlag
																		iso2={
																			phone.country_iso_code
																		}
																	/>
																</span>
																<button
																	className="p-2 hover:bg-gray-200 rounded"
																	onClick={() => {
																		setSelectedPhone(
																			phone
																		);
																		setShowEditPhoneModal(
																			true
																		);
																		setEditPhoneValue(
																			{
																				country_phone_code:
																					phone.country_phone_code,
																				phone_number:
																					phone.phone_number,
																			}
																		);
																	}}
																	title="Edit"
																>
																	<Pencil
																		size={
																			16
																		}
																	/>
																</button>
																<button
																	className="p-2 hover:bg-red-100 text-red-600 rounded"
																	onClick={() => {
																		setSelectedPhone(
																			phone
																		);
																		setShowDeletePhoneModal(
																			true
																		);
																	}}
																	title="Delete"
																>
																	<Trash2
																		size={
																			16
																		}
																	/>
																</button>
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}
							{/* Transactions Section */}
							<div className="bg-white shadow-md rounded-xl p-5">
								<div className="mb-5">
									<Title title="Wallet Transaction History" />
									<p className="text-sm text-gray-600 mt-2">
										All transactions for this{" "}
										{walletDetails.currency} wallet
									</p>
								</div>
								{tableData.length > 0 ? (
									<CustomTable
										headerData={headerWalletTransactionData}
										tableData={tableData as any}
										filter
										filterType={"transaction"}
										filterContent={filterContent}
										isLoading={walletTrxQuery.isLoading}
										setFilterContent={setFilterContent}
									/>
								) : (
									<div className="text-center py-8">
										<div className="text-gray-500 text-lg mb-2">
											No transactions found
										</div>
										<div className="text-gray-400 text-sm">
											This wallet doesn't have any
											transactions yet
										</div>
									</div>
								)}
							</div>
						</div>
					</>
				) : (
					<div className="flex justify-center w-full py-10">
						<div className="text-center">
							<div className="text-gray-500 text-lg">
								Wallet not found
							</div>
							<button
								onClick={() => router.back()}
								className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								Go Back
							</button>
						</div>
					</div>
				)}
			</section>
			{/* Modals */}
			{/* PAYIN -> PAYOUT */}
			<Modal
				name="totalToPayOut"
				isOpen={showTotalToPayOutModal}
				setIsOpen={setShowTotalToPayOutModal}
				modalContent={(() => {
					const amountNum = Number(totalToPayOutAmount) || 0;
					const available = Number(totalBalance || 0);
					const hasError = amountNum <= 0 || amountNum > available;
					return (
						<div className="bg-white rounded-lg p-6 w-[400px] relative">
							<h2 className="text-xl font-bold mb-4">
								Total{" "}
								<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />{" "}
								PayOut
							</h2>
							<div className="space-y-4">
								<div>
									<label className="flex justify-between items-center  text-sm font-medium text-gray-700 mb-2">
										<span>
											Amount ({walletDetails?.currency})
										</span>
										<span className="text-xs">
											Available:{" "}
											{available.toLocaleString()}{" "}
											{walletDetails?.currency}
										</span>
									</label>
									<input
										type="number"
										value={totalToPayOutAmount}
										onChange={(e) =>
											setTotalToPayOutAmount(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder={`Enter amount in ${walletDetails?.currency}`}
										min="1"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Reason (Optional)
									</label>
									<input
										type="text"
										value={totalToPayOutReason}
										onChange={(e) =>
											setTotalToPayOutReason(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
										placeholder="Enter reason for transfer"
									/>
								</div>
								{amountNum > 0 && (
									<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">
												From Main:
											</span>
											<span className="font-bold text-red-600">
												-
												{Math.min(
													amountNum,
													Number(
														walletDetails?.balance ||
															0
													)
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												From PayIn:
											</span>
											<span className="font-bold text-red-600">
												-
												{Math.max(
													amountNum -
														Number(
															walletDetails?.balance ||
																0
														),
													0
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												To PayOut:
											</span>
											<span className="font-bold text-green-600">
												+{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex gap-3 justify-end mt-6">
								<CButton
									text="Cancel"
									btnStyle="outlineDark"
									onClick={() =>
										setShowTotalToPayOutModal(false)
									}
								/>
								<CButton
									text={
										isTransferring
											? "Processing..."
											: "Transfer"
									}
									btnStyle="blue"
									onClick={submitTotalToPayOut}
									disabled={hasError}
								/>
							</div>
							<LoadingOverlay isLoading={isTransferring} />
						</div>
					);
				})()}
			/>
			<Modal
				name="fundWallet"
				isOpen={showFundWalletModal}
				setIsOpen={setShowFundWalletModal}
				modalContent={
					walletDetails ? (
						<FundLocalCurrencyWalletModal
							setIsOpen={setShowFundWalletModal}
							onSubmit={handleFundWallet}
							isLoading={isFunding}
							isSuccess={false}
							isError={false}
							phoneNumbers={walletDetails?.phoneNumbers || []}
							userId={currentUser?.id}
							walletId={walletDetails?.id}
							operators={walletDetails?.operators || []}
							currency={walletDetails?.currency || "XAF"}
							countryIsoCode={
								walletDetails?.country_iso_code || "CM"
							}
						/>
					) : null
				}
			/>

			{/* PAYIN -> PAYOUT */}
			<Modal
				name="payInToPayOut"
				isOpen={showPayInToPayOutModal}
				setIsOpen={setShowPayInToPayOutModal}
				modalContent={(() => {
					const amountNum = Number(payInTransferAmount) || 0;
					const available = Number(walletDetails?.payin_balance || 0);
					const hasError = amountNum <= 0 || amountNum > available;
					return (
						<div className="bg-white rounded-lg p-6 w-[400px] relative">
							<h2 className="text-xl font-bold mb-4">
								PayIn{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayOut
							</h2>
							<div className="space-y-4">
								<div>
									<label className="flex justify-between items-center  text-sm font-medium text-gray-700 mb-2">
										<span>
											Amount ({walletDetails?.currency})
										</span>
										<span className="text-xs">
											Available:{" "}
											{available.toLocaleString()}{" "}
											{walletDetails?.currency}
										</span>
									</label>
									<input
										type="number"
										value={payInTransferAmount}
										onChange={(e) =>
											setPayInTransferAmount(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder={`Enter amount in ${walletDetails?.currency}`}
										min="1"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Reason (Optional)
									</label>
									<input
										type="text"
										value={payInTransferReason}
										onChange={(e) =>
											setPayInTransferReason(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
										placeholder="Enter reason for transfer"
									/>
								</div>
								{amountNum > 0 && (
									<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">
												From PayIn:
											</span>
											<span className="font-bold text-red-600">
												-{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												To PayOut:
											</span>
											<span className="font-bold text-green-600">
												+{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between border-t pt-2">
											<span className="font-medium">
												PayIn after transfer:
											</span>
											<span className="font-bold text-gray-900">
												{Math.max(
													available - amountNum,
													0
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex gap-3 justify-end mt-6">
								<CButton
									text="Cancel"
									btnStyle="outlineDark"
									onClick={() =>
										setShowPayInToPayOutModal(false)
									}
								/>
								<CButton
									text={
										isTransferring
											? "Processing..."
											: "Transfer"
									}
									btnStyle="blue"
									onClick={() =>
										submitPayInTransfer("PAYOUT")
									}
									disabled={hasError}
								/>
							</div>
							<LoadingOverlay isLoading={isTransferring} />
						</div>
					);
				})()}
			/>
			{/* PAYIN -> MAIN */}
			<Modal
				name="payInToMain"
				isOpen={showPayInToMainModal}
				setIsOpen={setShowPayInToMainModal}
				modalContent={(() => {
					const amountNum = Number(payInTransferAmount) || 0;
					const available = Number(walletDetails?.payin_balance || 0);
					const hasError = amountNum <= 0 || amountNum > available;
					return (
						<div className="bg-white rounded-lg p-6 w-[400px] relative">
							<h2 className="text-xl font-bold mb-4">
								PayIn{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								Main
							</h2>
							<div className="space-y-4">
								<div>
									<label className="flex justify-between items-center  text-sm font-medium text-gray-700 mb-2">
										<span>
											Amount ({walletDetails?.currency})
										</span>
										<span className="text-xs">
											Available:{" "}
											{available.toLocaleString()}{" "}
											{walletDetails?.currency}
										</span>
									</label>
									<input
										type="number"
										value={payInTransferAmount}
										onChange={(e) =>
											setPayInTransferAmount(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder={`Enter amount in ${walletDetails?.currency}`}
										min="1"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Reason (Optional)
									</label>
									<input
										type="text"
										value={payInTransferReason}
										onChange={(e) =>
											setPayInTransferReason(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder="Enter reason for transfer"
									/>
								</div>
								{amountNum > 0 && (
									<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">
												From PayIn:
											</span>
											<span className="font-bold text-red-600">
												-{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												To Main:
											</span>
											<span className="font-bold text-green-600">
												+{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between border-t pt-2">
											<span className="font-medium">
												PayIn after transfer:
											</span>
											<span className="font-bold text-gray-900">
												{Math.max(
													available - amountNum,
													0
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex gap-3 justify-end mt-6">
								<CButton
									text="Cancel"
									btnStyle="outlineDark"
									onClick={() =>
										setShowPayInToMainModal(false)
									}
								/>
								<CButton
									text={
										isTransferring
											? "Processing..."
											: "Transfer"
									}
									btnStyle="blue"
									onClick={() => submitPayInTransfer("MAIN")}
									disabled={hasError}
								/>
							</div>
							<LoadingOverlay isLoading={isTransferring} />
						</div>
					);
				})()}
			/>
			<Modal
				name="mainToPayIn"
				isOpen={showMainToPayInModal}
				setIsOpen={setShowMainToPayInModal}
				modalContent={(() => {
					const amountNum = Number(mainTransferAmount) || 0;
					const available = Number(walletDetails?.balance || 0);
					const hasError = amountNum <= 0 || amountNum > available;
					return (
						<div className="bg-white rounded-lg p-6 w-[400px] relative">
							<h2 className="text-xl font-bold mb-4">
								Main{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayIn
							</h2>
							<div className="space-y-4">
								<div>
									<label className="flex justify-between items-center  text-sm font-medium text-gray-700 mb-2">
										<span>
											Amount ({walletDetails?.currency})
										</span>
										<span className="text-xs">
											Available:{" "}
											{available.toLocaleString()}{" "}
											{walletDetails?.currency}
										</span>
									</label>
									<input
										type="number"
										value={mainTransferAmount}
										onChange={(e) =>
											setMainTransferAmount(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder={`Enter amount in ${walletDetails?.currency}`}
										min="1"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Reason (Optional)
									</label>
									<input
										type="text"
										value={mainTransferReason}
										onChange={(e) =>
											setMainTransferReason(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder="Enter reason for transfer"
									/>
								</div>
								{amountNum > 0 && (
									<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">
												From Main:
											</span>
											<span className="font-bold text-red-600">
												-{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												To PayIn:
											</span>
											<span className="font-bold text-green-600">
												+{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between border-t pt-2">
											<span className="font-medium">
												Main after transfer:
											</span>
											<span className="font-bold text-gray-900">
												{Math.max(
													available - amountNum,
													0
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex gap-3 justify-end mt-6">
								<CButton
									text="Cancel"
									btnStyle="outlineDark"
									onClick={() =>
										setShowMainToPayInModal(false)
									}
								/>
								<CButton
									text={
										isTransferring
											? "Processing..."
											: "Transfer"
									}
									btnStyle="blue"
									onClick={() => submitMainTransfer("PAYIN")}
									disabled={hasError}
								/>
							</div>
							{isTransferring && (
								<div
									className={classNames(
										"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
										{
											"!opacity-100 !visible z-[1000]":
												isTransferring,
										}
									)}
								>
									<PuffLoader
										className="shrink-0"
										size={50}
										color="#1F66FF"
									/>
								</div>
							)}
						</div>
					);
				})()}
			/>
			<Modal
				name="mainToPayOut"
				isOpen={showMainToPayOutModal}
				setIsOpen={setShowMainToPayOutModal}
				modalContent={(() => {
					const amountNum = Number(mainTransferAmount) || 0;
					const available = Number(walletDetails?.balance || 0);
					const hasError = amountNum <= 0 || amountNum > available;
					return (
						<div className="bg-white rounded-lg p-6 w-[400px] relative">
							<h2 className="text-xl font-bold mb-4">
								Main{" "}
								{
									<Replace className="inline-block -rotate-180 mx-2 -mt-1.5" />
								}{" "}
								PayOut
							</h2>
							<div className="space-y-4">
								<div>
									<label className="flex justify-between items-center  text-sm font-medium text-gray-700 mb-2">
										<span>
											Amount ({walletDetails?.currency})
										</span>
										<span className="text-xs">
											Available:{" "}
											{available.toLocaleString()}{" "}
											{walletDetails?.currency}
										</span>
									</label>
									<input
										type="number"
										value={mainTransferAmount}
										onChange={(e) =>
											setMainTransferAmount(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder={`Enter amount in ${walletDetails?.currency}`}
										min="1"
										step="0.01"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Reason (Optional)
									</label>
									<input
										type="text"
										value={mainTransferReason}
										onChange={(e) =>
											setMainTransferReason(
												e.target.value
											)
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
										placeholder="Enter reason for transfer"
									/>
								</div>
								{amountNum > 0 && (
									<div className="bg-gray-50 p-4 rounded-md space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="font-medium">
												From Main:
											</span>
											<span className="font-bold text-red-600">
												-{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="font-medium">
												To PayOut:
											</span>
											<span className="font-bold text-green-600">
												+{amountNum.toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
										<div className="flex justify-between border-t pt-2">
											<span className="font-medium">
												Main after transfer:
											</span>
											<span className="font-bold text-gray-900">
												{Math.max(
													available - amountNum,
													0
												).toLocaleString()}{" "}
												{walletDetails?.currency}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex gap-3 justify-end mt-6">
								<CButton
									text="Cancel"
									btnStyle="outlineDark"
									onClick={() =>
										setShowMainToPayOutModal(false)
									}
								/>
								<CButton
									text={
										isTransferring
											? "Processing..."
											: "Transfer"
									}
									btnStyle="blue"
									onClick={() => submitMainTransfer("PAYOUT")}
									disabled={hasError}
								/>
							</div>
							{isTransferring && (
								<div
									className={classNames(
										"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
										{
											"!opacity-100 !visible z-[1000]":
												isTransferring,
										}
									)}
								>
									<PuffLoader
										className="shrink-0"
										size={50}
										color="#1F66FF"
									/>
								</div>
							)}
						</div>
					);
				})()}
			/>
			<Modal
				name="transferPayInPayOut"
				isOpen={showTransferPayInPayOutModal}
				setIsOpen={setShowTransferPayInPayOutModal}
				modalContent={
					<TransferPayInPayOutModal
						setIsOpen={setShowTransferPayInPayOutModal}
						onSubmit={handleTransferPayInPayOut}
						isLoading={isTransferring}
						isSuccess={false}
						isError={false}
						source={transferSource}
						wallet={{
							id: walletDetails?.id || "",
							currency: walletDetails?.currency || "",
							balance: walletDetails?.balance || 0,
							payin_balance: walletDetails?.payin_balance || 0,
							payout_balance: walletDetails?.payout_balance || 0,
						}}
					/>
				}
			/>
			<Modal
				name="withdraw"
				isOpen={showWithdrawModal}
				setIsOpen={setShowWithdrawModal}
				modalContent={
					<WithdrawFundsModal
						setIsOpen={setShowWithdrawModal}
						onSubmit={handleWithdraw}
						isLoading={isWithdrawing}
						isSuccess={false}
						isError={false}
						wallet={{
							id: walletDetails?.id || "",
							currency: walletDetails?.currency || "",
							payout_balance: walletDetails?.payout_balance || 0,
							country_iso_code: walletDetails?.country_iso_code,
							country_phone_code:
								walletDetails?.country_phone_code,
						}}
						operators={walletDetails?.operators || []}
						phoneNumbers={walletDetails?.phoneNumbers || []}
						userId={currentUser?.id || ""}
					/>
				}
			/>
			<Modal
				name="transferBetween"
				isOpen={showTransferBetweenModal}
				setIsOpen={setShowTransferBetweenModal}
				modalContent={
					<TransferBetweenWalletsModal
						setIsOpen={setShowTransferBetweenModal}
						onSubmit={handleTransferBetween}
						isLoading={isTransferringBetween}
						sourceWallet={{
							id: walletDetails?.id || "",
							currency: walletDetails?.currency || "",
							balance: walletDetails?.balance || 0,
							country_iso_code: walletDetails?.country_iso_code,
						}}
						token={token}
					/>
				}
			/>
			{/* ADD PHONE NUMBER */}
			<Modal
				name="addPhone"
				isOpen={showAddPhoneModal}
				setIsOpen={setShowAddPhoneModal}
				modalContent={
					<div className="bg-white rounded-lg p-6 w-[420px] relative">
						<h2 className="text-xl font-bold mb-4">
							Add Phone Number
						</h2>
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<PhoneInput
									value={newPhone.phone_number}
									onChange={(number, code) =>
										setNewPhone((p) => ({
											...p,
											phone_number: number,
											country_phone_code: code,
										}))
									}
								/>
								<input
									type="text"
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
									placeholder="Phone number"
									value={newPhone.phone_number}
									onChange={(e) => {
										const val = e.target.value;
										if (/^\s*\+/.test(val)) {
											setPhoneNumberError(
												"N'entrez pas l'indicatif (+...). Renseignez seulement le numéro."
											);
										} else {
											setPhoneNumberError("");
										}
										setNewPhone((p) => ({
											...p,
											phone_number: val,
										}));
									}}
								/>
							</div>
							{phoneNumberError && (
								<p className="text-xs text-red-600 mt-1">
									{phoneNumberError}
								</p>
							)}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Operator
								</label>
								{(() => {
									const operators = (
										walletDetails?.operators || []
									).filter(
										(op: any) =>
											op?.country_phone_code ===
												newPhone.country_phone_code ||
											op?.country_iso_code ===
												walletDetails?.country_iso_code
									);
									return (
										<Select
											value={newPhone.operator}
											onValueChange={(val) =>
												setNewPhone((p) => ({
													...p,
													operator: val,
												}))
											}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select operator" />
											</SelectTrigger>
											<SelectContent className="z-[12000]">
												{operators.map((op: any) => (
													<SelectItem
														key={
															op?.id ||
															op?.operator_code
														}
														value={
															op?.operator_code ||
															op?.operator_name
														}
													>
														{op?.operator_name ||
															op?.operator_code}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									);
								})()}
							</div>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<CButton
								text="Cancel"
								btnStyle="outlineDark"
								onClick={() => setShowAddPhoneModal(false)}
							/>
							<CButton
								text={isSavingPhone ? "Saving..." : "Save"}
								btnStyle="blue"
								onClick={handleAddPhone}
								disabled={isSavingPhone}
							/>
						</div>
						<LoadingOverlay isLoading={isSavingPhone} />
					</div>
				}
			/>
			{/* Delete Phone Confirm Modal */}
			<Modal
				name="deletePhone"
				isOpen={showDeletePhoneModal}
				setIsOpen={setShowDeletePhoneModal}
				modalContent={
					<div className="bg-white rounded-lg p-6 w-[380px]">
						<h2 className="text-lg font-bold mb-2">
							Supprimer le numéro
						</h2>
						<p className="text-sm text-gray-600">
							Êtes-vous sûr de vouloir supprimer ce numéro{" "}
							{selectedPhone?.country_phone_code}{" "}
							{selectedPhone?.phone_number} ?
						</p>
						<div className="flex gap-3 justify-end mt-6">
							<CButton
								text="Annuler"
								btnStyle="outlineDark"
								onClick={() => setShowDeletePhoneModal(false)}
							/>
							<CButton
								text={
									isDeletingPhoneId === selectedPhone?.id
										? "Suppression..."
										: "Supprimer"
								}
								btnStyle="red"
								onClick={async () => {
									if (!selectedPhone?.id) return;
									setIsDeletingPhoneId(selectedPhone.id);
									try {
										const res =
											await WalletService.delete_wallet_phone_number(
												{ token, id: selectedPhone.id }
											);
										const json = await res.json();
										if (
											!res.ok ||
											json?.status === "error" ||
											json?.success === false
										)
											throw new Error(
												json?.message || "Failed"
											);
										toast.success(
											json?.message || "Numéro supprimé"
										);
										setShowDeletePhoneModal(false);
										walletQuery.refetch();
									} catch (e: any) {
										toast.error(
											e?.message || "Echec de suppression"
										);
									} finally {
										setIsDeletingPhoneId(null);
									}
								}}
							/>
						</div>
					</div>
				}
			/>

			{/* Edit Phone Modal */}
			<Modal
				name="editPhone"
				isOpen={showEditPhoneModal}
				setIsOpen={setShowEditPhoneModal}
				modalContent={
					<div className="bg-white rounded-lg p-6 w-[420px] relative">
						<h2 className="text-xl font-bold mb-4">
							Modifier le numéro
						</h2>
						<div className="flex items-center">
							<PhoneInput
								value={editPhoneValue.phone_number}
								onChange={(number, code) =>
									setEditPhoneValue({
										country_phone_code: code,
										phone_number: number,
									})
								}
							/>
							<input
								type="text"
								className="w-full px-3  border border-gray-300 rounded-md focus:outline-none "
								placeholder="Phone number"
								value={editPhoneValue.phone_number}
								onChange={(e) =>
									setEditPhoneValue({
										...editPhoneValue,
										phone_number: e.target.value,
									})
								}
							/>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<CButton
								text="Annuler"
								btnStyle="outlineDark"
								onClick={() => setShowEditPhoneModal(false)}
							/>
							<CButton
								text="Enregistrer"
								btnStyle="blue"
								onClick={async () => {
									if (!selectedPhone?.id) return;
									try {
										const res =
											await WalletService.update_wallet_phone_number(
												{
													token,
													id: selectedPhone.id,
													body: {
														country_phone_code:
															editPhoneValue.country_phone_code,
														phone_number:
															editPhoneValue.phone_number,
													},
												}
											);
										const json = await res.json();
										if (
											!res.ok ||
											json?.status === "error" ||
											json?.success === false
										)
											throw new Error(
												json?.message || "Failed"
											);
										toast.success(
											json?.message || "Numéro mis à jour"
										);
										setShowEditPhoneModal(false);
										walletQuery.refetch();
									} catch (e: any) {
										toast.error(
											e?.message || "Echec de mise à jour"
										);
									}
								}}
							/>
						</div>
					</div>
				}
			/>
		</Layout>
	);
}
