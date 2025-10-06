"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";

import { TDataList } from "@/components/cards/InfoCard";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";

import { WalletService } from "@/api/services/cartevo-api/wallets";
import AddWalletModal, {
	AddWalletSubmitProps,
} from "@/components/cards/AddWalletModal";
import DepositToUSDWalletModal, {
	DespoitToWalletSubmitProps,
} from "@/components/cards/DepositToUSDWalletModal";
import FundLocalCurrencyWalletModal, {
	FundLocalCurrencyWalletSubmitProps,
} from "@/components/cards/FundLocalCurrencyWalletModal";
import WalletCardGrid from "@/components/cards/WalletCardGrid";
import BadgeLabel from "@/components/shared/BadgeLabel";
import { ItemFlag } from "@/components/shared/ItemFlag";
import Modal from "@/components/shared/Modal/Modal";
import useKeyPressed from "@/hooks/useKeyPressed";
import { useLocalizedNavigation } from "@/hooks/useLocalizedNavigation";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import { selectSearchTerm } from "@/redux/slices/search";
import { setCompanyWallets } from "@/redux/slices/wallets";
import {
	fetchExchangeRates,
	fetchTransactionFees,
	selectCurrentMode,
} from "@/redux/slices_v2/settings";
import { getFormattedDateTime } from "@/utils/DateFormat";
import { getCategoryTypeV2 } from "@/utils/graphs";
import { sortByCreatedAtDescending } from "@/utils/utils";
import { HiDownload } from "react-icons/hi";
import { MdDownload, MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

// Initial infoData structure - will be updated with real data
const getInitialInfoData = (
	openFundModal: (wallet: any) => void,
	walletData?: any[],
	t?: any
): TDataList[] => [
	[
		[
			{
				label: {
					text: t?.wallets?.labels?.wallet,
					fw: "bold",
					fs: "20px",
					color: "#444",
				},
				value: {
					text: (
						<span className="flex gap-2 items-center">
							<span>XAF</span>
							<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
								<ItemFlag iso2={"CM"} />
							</span>
						</span>
					),
					fs: "20px",
					fw: "bold",
					color: "#444",
				},
			},
			{
				label: {
					text:
						t?.wallets?.labels?.availableBalance ||
						"Available balance",
					fw: "",
					color: "#444",
				},
				value: {
					text: "0",
					fs: "25px",
					fw: "bold",
					color: "#444",
				},
			},
		],
		[
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={t?.wallets?.actions?.fund}
							btnStyle={"blue"}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
		],
	],
	[
		[
			{
				label: {
					text: t?.wallets?.labels?.wallet || "wallet",
					fw: "bold",
					fs: "20px",
					color: "#444",
				},
				value: {
					text: (
						<span className="flex gap-2 items-center">
							<span>USD</span>
							<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
								<ItemFlag iso2={"US"} />
							</span>
						</span>
					),
					fs: "20px",
					fw: "bold",
					color: "#444",
				},
			},
			{
				label: {
					text:
						t?.wallets?.labels?.availableBalance ||
						"Available balance",
					fw: "",
					color: "#444",
				},
				value: {
					text: "0",
					fs: "25px",
					fw: "bold",
					color: "#444",
				},
			},
		],
		[
			{
				label: { text: "", fw: "", color: "#444" },
				value: {
					text: (
						<CButton
							text={t?.wallets?.actions?.fund || "Recharger"}
							btnStyle={"blue"}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
		],
	],
];

const getCompanyWallets = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	let params: any = {};
	const response = await WalletService.get_wallets({ token: token || "" });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get wallets");
	}
	return responseJson.data;
};

const getCompanyTransactions = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	let params: any = {};
	const response = await WalletService.get_transactions({
		token: token || "",
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get wallets");
	}
	return responseJson.data;
};

const createWallet = async (token: string, data: AddWalletSubmitProps) => {
	let params: any = {};
	const response = await WalletService.create_wallet({
		token: token,
		body: data,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to get wallets");
	}
	return responseJson.data;
};

const fundWallet = async (
	token: string,
	data: FundLocalCurrencyWalletSubmitProps
) => {
	let params: any = {};
	const response = await WalletService.fund_wallet({
		token: token,
		body: data,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fund wallet");
	}
	return responseJson.data;
};

const depositToWallet = async (
	token: string,
	data: DespoitToWalletSubmitProps
) => {
	console.log("depositToWallet : data :", data);

	let params: any = {};
	const response = await WalletService.deposit_to_wallet({
		token: token,
		body: data,
	});
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to deposit to wallet");
	}
	return responseJson.data;
};
// const creditTestWallet = async (
// 	token: string,
// 	data: CreditTestWalletSubmitProps
// ) => {
// 	console.log("creditTestWallet : data :", data);

// 	let params: any = {};
// 	const response = await WalletService.credit_test_wallet({
// 		token: token,
// 		body: { ...data, sandbox: true },
// 	});
// 	const responseJson = await response.json();
// 	if (!response.ok) {
// 		throw new Error(responseJson.message || "Failed to credit test wallet");
// 	}
// 	return responseJson.data;
// };

export default function Home() {
	const { t }: { t: any } = useTranslation();
	const currentUser: any = useSelector(selectCurrentUser);
	const companyName = currentUser?.company?.name || "Cartevo";

	useTitle(t.wallets.pageTitle.replace("{companyName}", companyName), true);

	const router = useRouter();
	const currentToken: any = useSelector(selectCurrentToken);
	const currentEnvMode: any = useSelector(selectCurrentMode);
	console.log("currentEnvMode :: ", currentEnvMode);
	console.log("currentEnvMode :: ", currentEnvMode);
	console.log("currentEnvMode :: ", currentEnvMode);

	const [filterContent, setFilterContent] = useState({});
	const [loadTransactions, setLoadTransactions] = useState(false);

	const [statsData, setStatsData] = useState<TDataList[]>();

	const [isOpen, setIsOpen] = useState(false);
	const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState(false);
	const [fundModalData, setFundModalData] = useState<{
		isOpen: boolean;
		wallet: any;
	}>({ isOpen: false, wallet: null });

	// Initialize infoData
	let infoData: TDataList[] = getInitialInfoData(
		(wallet: any) => setFundModalData({ isOpen: true, wallet }),
		undefined,
		t
	);

	const dispatch = useDispatch<any>();
	const redirectRef: any = useRef();
	const transactionsSectionRef = useRef<HTMLDivElement>(null);
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	//------------------------------------------------
	// Lazy load transactions - only when user scrolls to transactions section
	const companyTransactionsQueryRes = useQuery({
		queryKey: ["companyTransactions", currentToken],
		queryFn: getCompanyTransactions,
		onError: (err) => {
			toast.error("Failed to get Company Transactions.");
		},
		refetchInterval: 300000,
		// enabled: loadTransactions, // Only load when explicitly requested
		// staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		// cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});

	const companyTransactionsData = companyTransactionsQueryRes.data;

	//------------------------------------------------

	const companyWalletsQueryRes: any = useQuery({
		queryKey: ["companyWallets", currentToken],
		queryFn: getCompanyWallets,
		onError: (err) => {
			toast.error("Failed to get wallets.");
		},
		refetchInterval: 300000, // Reduced to 5 minutes instead of 1 minute
		// staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
		// cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});

	useEffect(() => {
		if (companyWalletsQueryRes?.data) {
			dispatch(setCompanyWallets(companyWalletsQueryRes.data));
		}
	}, [companyWalletsQueryRes?.data, dispatch]);

	// Sync wallets into Redux store for reuse elsewhere (e.g., transfer between wallets modal)
	useEffect(() => {
		if (companyWalletsQueryRes?.data) {
			dispatch(setCompanyWallets(companyWalletsQueryRes.data));
		}
	}, [companyWalletsQueryRes?.data, dispatch]);

	const createWalletMutation = useMutation(
		(data: AddWalletSubmitProps) => createWallet(currentToken, data),
		{
			onError: (err) => {
				toast.error("Failed to create wallet.");
			},
			onSuccess: () => {
				toast.success("Wallet created successfully!");
				companyWalletsQueryRes.refetch(); // Refetch wallets after creation
			},
		}
	);

	const fundWalletMutation = useMutation(
		(data: FundLocalCurrencyWalletSubmitProps) =>
			fundWallet(currentToken, data),
		{
			onSuccess: () => {
				toast.success("Wallet funding initiated !");
				companyWalletsQueryRes.refetch(); // Refetch wallets after funding
				companyTransactionsQueryRes.refetch(); // Refetch transactions
			},
			onError: (err) => {
				toast.error("Failed to fund wallet.");
			},
		}
	);

	const depositToWalletMutation = useMutation(
		(data: DespoitToWalletSubmitProps) =>
			depositToWallet(currentToken, data),
		{
			onSuccess: () => {
				toast.success("Wallet deposit done successfully!");
				companyWalletsQueryRes.refetch(); // Refetch wallets after funding
				companyTransactionsQueryRes.refetch(); // Refetch transactions
			},
			onError: (err) => {
				toast.error("Failed to fund wallet.");
			},
		}
	);
	// const creditTestWalletMutation = useMutation(
	// 	(data: CreditTestWalletSubmitProps) =>
	// 		creditTestWallet(currentToken, data),
	// 	{
	// 		onSuccess: () => {
	// 			toast.success("Wallet deposit done successfully!");
	// 			companyWalletsQueryRes.refetch(); // Refetch wallets after funding
	// 			companyTransactionsQueryRes.refetch(); // Refetch transactions
	// 		},
	// 		onError: (err) => {
	// 			toast.error("Failed to fund wallet.");
	// 		},
	// 	}
	// );
	const { navigateTo } = useLocalizedNavigation();

	// Fetch exchange rates and transaction fees on component mount
	useEffect(() => {
		if (currentToken) {
			dispatch(fetchExchangeRates(currentToken));
			dispatch(fetchTransactionFees(currentToken));
		}
	}, [currentToken, dispatch]);

	//------------------------------------------------

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	const { shiftDown, iPressed, ePressed } = useKeyPressed();

	if (companyWalletsQueryRes?.data) {
		// Sort wallets to ensure USD is first, then remaining wallets from oldest to most recent
		const sortedWallets = [...companyWalletsQueryRes.data].sort((a, b) => {
			if (a.currency === "USD") return -1;
			if (b.currency === "USD") return 1;
			// Sort remaining wallets by created_at (oldest first)
			return (
				new Date(a.created_at).getTime() -
				new Date(b.created_at).getTime()
			);
		});

		// Dynamically generate infoData based on sorted wallets
		infoData = sortedWallets.map((wallet) => [
			[
				{
					label: {
						text: "Wallet",
						fw: "bold",
						fs: "20px",
						color: "#444",
					},
					value: {
						text: (
							<span className="flex gap-2 items-center ">
								<span>{wallet.currency || ""}</span>
								{wallet.country_iso_code && (
									<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
										<ItemFlag
											iso2={wallet.country_iso_code}
										/>
									</span>
								)}
							</span>
						),
						fs: "20px",
						fw: "bold",
						color: "#444",
					},
				},
				{
					label: {
						text:
							t?.wallets?.labels?.availableBalance ||
							"Available balance",
						fw: "",
						color: "#444",
					},
					value: {
						text: (
							<span className="flex gap-2 items-center">
								<span>
									{wallet.balance?.toLocaleString("en-EN") ||
										0}
								</span>
								<span className="text-xs">
									{wallet.currency || ""}
								</span>
							</span>
						),
						fs: "25px",
						fw: "bold",
						color: "#444",
					},
				},
			],
			[
				{
					label: { text: "", fw: "", color: "#444" },
					value: {
						text: (
							<div className="flex flex-col gap-2 w-full">
								<CButton
									text={
										wallet.currency === "USD"
											? `${t.wallets.actions.deposit}`
											: `${t.wallets.actions.fund}`
									}
									btnStyle={"blue"}
									onClick={() => {
										if (wallet.currency === "USD") {
											if (currentEnvMode === "sandbox") {
												// creditTestWalletMutation.reset();
											} else {
												depositToWalletMutation.reset();
											}
										} else {
											fundWalletMutation.reset();
										}
										setFundModalData({
											isOpen: true,
											wallet,
										});
									}}
									icon={
										wallet.currency === "USD" ? (
											<HiDownload size={50} />
										) : (
											<MdDownload size={50} />
										)
									}
									width={"100%"}
									height={"40px"}
								/>
								{wallet.currency !== "USD" &&
									wallet.is_active && (
										<CButton
											text={"Details"}
											btnStyle={"outlineDark"}
											onClick={() =>
												navigateTo(
													`/wallets/${wallet.id}`
												)
											}
											width={"100%"}
											height={"36px"}
											style={{
												marginTop: "8px",
												padding: "10px",
											}}
										/>
									)}
							</div>
						),
					},
				},
			],
		]);

		if (companyTransactionsQueryRes?.data) {
			// Sort transactions by created_at descending (most recent first)

			const sortedTransactions = sortByCreatedAtDescending([
				...companyTransactionsQueryRes.data,
			]);

			rearrangedTableData = sortedTransactions.map(
				(item: any, index: any) => ({
					serial: index + 1,
					type: getCategoryTypeV2(item.category, item.type),
					// name: item.merchant?.name,
					wallet: `${item.wallet?.country_iso_code || ""} - ${
						item.wallet?.currency || ""
					}`,
					phone: item.phone_number && `${item.phone_number}`,
					idTrx: item.id,
					currency: item.currency,
					amount: item.amount?.toLocaleString("en-EN") ?? 0,
					status: (() => {
						switch (item.status?.toUpperCase()) {
							case "SUCCESS":
								return (
									<BadgeLabel
										className="text-xs"
										label={t.wallets.labels.status.success}
										badgeColor="#1F66FF"
										textColor="#444"
									/>
								);
							case "FAILED":
							case "ERROR":
								return (
									<BadgeLabel
										className="text-xs"
										label={t.wallets.labels.status.failed}
										badgeColor="#F85D4B"
										textColor="#444"
									/>
								);
							case "PENDING":
								return (
									<BadgeLabel
										className="text-xs"
										label={t.wallets.labels.status.pending}
										badgeColor="#FFAC1C"
										textColor="#444"
									/>
								);
							case "CANCELLED":
							case "CANCELED":
								return (
									<BadgeLabel
										className="text-xs"
										label={
											t.wallets.labels.status.cancelled
										}
										badgeColor="#444"
										textColor="#444"
									/>
								);
							default:
								return (
									<BadgeLabel
										className="text-xs"
										label={item.status || "Unknown"}
										badgeColor="#6B7280"
										textColor="#444"
									/>
								);
						}
					})(),
					date: getFormattedDateTime(item.created_at, "en"),
					actions: (
						<>
							<div className="flex gap-5">
								{/* <CButton
									text={"Details"}
									onClick={() => setIsOpen(index)}
									btnStyle={"outlineDark"}
								/>
								<Modal
									index={`${index}`}
									name={"pending"}
									isOpen={isOpen === index}
									setIsOpen={setIsOpen}
									modalContent={
										<TransactionModal
											setIsOpen={setIsOpen}
											item={item}
										/>
									}
								/> */}
							</div>
						</>
					),
				})
			);
		}
	}

	return (
		<Layout title={t.wallets.mainTitle}>
			<section className="mt-2">
				{companyWalletsQueryRes?.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
					</div>
				) : (
					<WalletCardGrid
						walletData={infoData}
						onAddWallet={() => setIsAddWalletModalOpen(true)}
					/>
				)}

				<Modal
					name="addWallet"
					isOpen={isAddWalletModalOpen}
					setIsOpen={setIsAddWalletModalOpen}
					modalContent={
						<AddWalletModal
							setIsOpen={setIsAddWalletModalOpen}
							onSubmit={createWalletMutation.mutate}
							existingWallets={companyWalletsQueryRes?.data || []}
						/>
					}
				/>

				<Modal
					name="fundWallet"
					isOpen={fundModalData.isOpen}
					setIsOpen={() =>
						setFundModalData({ isOpen: false, wallet: null })
					}
					modalContent={
						fundModalData.wallet?.currency === "USD" ? (
							<DepositToUSDWalletModal
								setIsOpen={() =>
									setFundModalData({
										isOpen: false,
										wallet: null,
									})
								}
								onSubmit={depositToWalletMutation.mutate}
								isLoading={depositToWalletMutation.isLoading}
								isSuccess={depositToWalletMutation.isSuccess}
								isError={depositToWalletMutation.isError}
								wallets={companyWalletsQueryRes?.data || []}
							/>
						) : (
							<FundLocalCurrencyWalletModal
								setIsOpen={() =>
									setFundModalData({
										isOpen: false,
										wallet: null,
									})
								}
								onSubmit={fundWalletMutation.mutate}
								isLoading={fundWalletMutation.isLoading}
								isSuccess={fundWalletMutation.isSuccess}
								isError={fundWalletMutation.isError}
								phoneNumbers={
									fundModalData.wallet?.phoneNumbers || []
								} // TODO: Get phone numbers from API
								userId={currentUser.id}
								walletId={fundModalData.wallet?.id}
								operators={
									fundModalData.wallet?.operators || []
								}
								currency={
									fundModalData.wallet?.currency || "XAF"
								}
								countryIsoCode={
									fundModalData.wallet?.country_iso_code ||
									"CM"
								}
								// countryPhoneCode={
								// 	fundModalData.wallet?.country_phone_code ||
								// 	"237"
								// }
							/>
						)
					}
				/>

				<div
					ref={transactionsSectionRef}
					className="my-[50px] bg-white  shadow-md rounded-xl p-5 "
				>
					<div className="mb-5">
						<Title title={t.wallets.labels.lastTransactions} />
					</div>

					<CustomTable
						headerData={{
							serial: t.wallets.transactions.serial,
							type: t.wallets.transactions.type,
							wallet: t.wallets.transactions.wallet,
							phone: t.wallets.transactions.phone,
							idTrx: t.wallets.transactions.idTrx,
							currency: t.wallets.transactions.currency,
							amount: t.wallets.transactions.amount,
							status: t.wallets.transactions.status,
							date: t.wallets.transactions.date,
							edit: "",
						}}
						tableData={rearrangedTableData}
						filter
						filterType={"transaction"}
						filterContent={filterContent}
						isLoading={companyTransactionsQueryRes.isLoading}
						setFilterContent={setFilterContent}
					/>
				</div>

				{/* <div
					style={{ zIndex: 9000 }}
					className={classNames(
						"transition-all invisible z-20 bg-blue-900/30 opacity-0 absolute top-0 left-0 h-full w-full flex items-center justify-center",
						{
							"!opacity-100 !visible z-20":
								mutationExcel.isLoading,
						}
					)}
				>
					<HashLoader
						className="shrink-0"
						size={50}
						color="#1F66FF"
					/>
				</div> */}
				<a ref={redirectRef} download hidden href="#"></a>
			</section>
		</Layout>
	);
}
