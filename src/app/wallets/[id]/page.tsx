"use client";
import { WalletService } from "@/api/services/cartevo-api/wallets";
import TransferBetweenWalletsModal from "@/components/cards/TransferBetweenWalletsModal";
import TransferPayInPayOutModal from "@/components/cards/TransferPayInPayOutModal";
import WithdrawFundsModal from "@/components/cards/WithdrawFundsModal";
import BadgeLabel from "@/components/shared/BadgeLabel";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import { ItemFlag } from "@/components/shared/ItemFlag";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";
import Title from "@/components/shared/Title";
import { headerWalletTransactionData } from "@/constants/TransactionData";
import { useTitle } from "@/hooks/useTitle";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

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
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const [showTransferBetweenModal, setShowTransferBetweenModal] =
		useState(false);

	// Loading states for actions
	const [isTransferring, setIsTransferring] = useState(false);
	const [isWithdrawing, setIsWithdrawing] = useState(false);
	const [isTransferringBetween, setIsTransferringBetween] = useState(false);

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
			balance: w.balance,
			payin_balance: w.payin_balance || 0,
			payout_balance: w.payout_balance || 0,
			payin_amount: w.payin_amount || 0,
			payout_amount: w.payout_amount || 0,
			currency: w.currency,
			country: w.country,
			country_iso_code: w.country_iso_code,
			country_phone_code: w.country_phone_code,
			active: w.is_active || w.active,
			company_id: w.company_id,
			created_at: w.created_at,
			updated_at: w.updated_at,
			company: w.company,
			phoneNumbers: w.phoneNumbers || [],
			operators: w.operators || [],
			payInAmount: w.payInAmount || 0,
			payOutAmount: w.payOutAmount || 0,
		};
	}, [walletQuery.data]);

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
			const body = {
				amount: Number(data.amount),
				direction: data.direction,
				reason: data.reason,
			};
			const res = await WalletService.transfer_internal({
				token,
				walletId: walletDetails?.id,
				body,
			});
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

	return (
		<Layout title={"Wallet Details"}>
			<section className="mt-2">
				{walletQuery.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
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

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{/* Total Balance Section */}
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
									<div className="flex items-center gap-3 mb-2">
										<span className="text-sm font-medium text-gray-600">
											Available Balance
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
										{walletDetails.balance?.toLocaleString(
											"en-EN"
										) ?? 0}
										<span className="text-sm font-normal text-gray-600 ml-1">
											{walletDetails.currency}
										</span>
									</div>
								</div>

								{/* PayIn Balance */}
								<div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-gray-600 mb-1">
										PayIn Balance
									</div>
									<div className="text-xl font-bold text-green-600">
										{walletDetails.payin_balance?.toLocaleString(
											"en-EN"
										) ?? 0}
										<span className="text-sm font-normal text-gray-600 ml-1">
											{walletDetails.currency}
										</span>
									</div>
								</div>

								{/* PayOut Balance */}
								<div className="bg-gradient-to-r from-red-50 to-rose-50 p-4 rounded-lg">
									<div className="text-sm font-medium text-gray-600 mb-1">
										PayOut Balance
									</div>
									<div className="text-xl font-bold text-red-600">
										{walletDetails.payout_balance?.toLocaleString(
											"en-EN"
										) ?? 0}
										<span className="text-sm font-normal text-gray-600 ml-1">
											{walletDetails.currency}
										</span>
									</div>
								</div>

								{/* Currency & Country */}
								<div className="p-4 border border-gray-200 rounded-lg">
									<div className="text-sm font-medium text-gray-600 mb-1">
										Currency
									</div>
									<div className="text-lg font-semibold text-gray-900">
										{walletDetails.currency}
									</div>
									<div className="text-sm text-gray-500 mt-1">
										{walletDetails.country}
									</div>
									<div className="text-xs text-gray-400 mt-1">
										{walletDetails.country_iso_code} • +
										{walletDetails.country_phone_code}
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="mt-6 pt-6 border-t border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Wallet Actions
								</h3>
								<div className="flex flex-wrap gap-3">
									<CButton
										text="Transfer PayIn ↔ PayOut"
										btnStyle="blue"
										onClick={() =>
											setShowTransferPayInPayOutModal(
												true
											)
										}
									/>
									<CButton
										text="Withdraw Funds"
										btnStyle="red"
										onClick={() =>
											setShowWithdrawModal(true)
										}
									/>
									<CButton
										text="Transfer to Other Wallet"
										btnStyle="green"
										onClick={() =>
											setShowTransferBetweenModal(true)
										}
									/>
								</div>
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
								walletDetails.phoneNumbers.length > 0 && (
									<div className="mt-6 pt-6 border-t border-gray-200">
										<h3 className="text-lg font-semibold text-gray-900 mb-4">
											Associated Phone Numbers
										</h3>
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
															<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
																<ItemFlag
																	iso2={
																		phone.country_iso_code
																	}
																/>
															</span>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}

							{/* Available Operators Section */}
							{walletDetails.operators &&
								walletDetails.operators.length > 0 && (
									<div className="mt-6 pt-6 border-t border-gray-200">
										<h3 className="text-lg font-semibold text-gray-900 mb-4">
											Available Operators
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{walletDetails.operators.map(
												(
													operator: any,
													index: number
												) => (
													<div
														key={index}
														className="p-3 bg-blue-50 rounded-lg border border-blue-200"
													>
														<div className="flex items-center justify-between">
															<div>
																<div className="font-medium text-gray-900">
																	{
																		operator.operator_name
																	}
																</div>
																<div className="text-sm text-gray-500">
																	Code:{" "}
																	{
																		operator.operator_code
																	}{" "}
																	•{" "}
																	{
																		operator.currency
																	}
																</div>
																{operator.ussd_code && (
																	<div className="text-xs text-blue-600 mt-1">
																		USSD:{" "}
																		{
																			operator.ussd_code
																		}
																	</div>
																)}
															</div>
															<div className="flex flex-col items-end">
																<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
																	<ItemFlag
																		iso2={
																			operator.country_iso_code
																		}
																	/>
																</span>
																{operator.otp_required && (
																	<span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1">
																		OTP
																		Required
																	</span>
																)}
															</div>
														</div>
													</div>
												)
											)}
										</div>
									</div>
								)}
						</div>

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
						wallet={{
							id: walletDetails?.id || "",
							currency: walletDetails?.currency || "",
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
							country_phone_code: walletDetails?.country_phone_code,
						}}
						operators={walletDetails?.operators || []}
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
						onLoadWallets={loadAvailableWallets}
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
		</Layout>
	);
}
