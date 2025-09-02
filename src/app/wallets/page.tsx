"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRef, useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useQuery, useMutation } from "react-query";

import { TDataList } from "@/components/cards/InfoCard";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import Title from "@/components/shared/Title";

import { CompanyService } from "@/api/services/cartevo-api/company";
import WalletCardGrid from "@/components/cards/WalletCardGrid";
import { headerUserTransactionDataV2 } from "@/constants/TransactionData";
import useKeyPressed from "@/hooks/useKeyPressed";
import { selectSearchTerm } from "@/redux/slices/search";
import * as CFlags from "country-flag-icons/react/3x2";
import { FaArrowsRotate, FaMoneyBillWave } from "react-icons/fa6";
import { MdDownload, MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryTypeV2 } from "@/utils/graphs";
import BadgeLabel from "@/components/shared/BadgeLabel";
import { getFormattedDateTime } from "@/utils/DateFormat";
import Modal from "@/components/shared/Modal/Modal";
import TransactionModal from "./manage/[id]/components/Tabs/Transactions/modals/TransactionModal";
import AddWalletModal, {
	AddWalletSubmitProps,
} from "@/components/cards/AddWalletModal";
import FundUSDModal, {
	DespoitToWalletSubmitProps,
} from "@/components/cards/DepositToUSDWalletModal";
import FundLocalCurrencyWalletModal, {
	FundLocalCurrencyWalletSubmitProps,
} from "@/components/cards/FundLocalCurrencyWalletModal";
import { selectCurrentToken, selectCurrentUser } from "@/redux/slices/auth";
import {
	fetchExchangeRates,
	fetchTransactionFees,
	selectExchangeRates,
	selectTransactionFees,
} from "@/redux/slices_v2/settings";
import { HiDownload } from "react-icons/hi";
import { WalletService } from "@/api/services/cartevo-api/wallets";
import DepositToUSDWalletModal from "@/components/cards/DepositToUSDWalletModal";
import { ItemFlag } from "@/components/shared/ItemFlag";

// Initial infoData structure - will be updated with real data
const getInitialInfoData = (
	openFundModal: (wallet: any) => void,
	walletData?: any[]
): TDataList[] => [
	[
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
				label: { text: "Available balance", fw: "", color: "#444" },
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
							text={"Fund"}
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
					text: "Wallet",
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
				label: { text: "Available balance", fw: "", color: "#444" },
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
							text={"Fund"}
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
	const response = await CompanyService.get_transactions({
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

export default function Home() {
	useTitle("Cartevo | wallets", true);

	const currentToken: any = useSelector(selectCurrentToken);
	const currentUser: any = useSelector(selectCurrentUser);

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
	let infoData: TDataList[] = getInitialInfoData((wallet: any) =>
		setFundModalData({ isOpen: true, wallet })
	);

	const dispatch = useDispatch<any>();
	const redirectRef: any = useRef();
	const transactionsSectionRef = useRef<HTMLDivElement>(null);
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	// Intersection Observer to load transactions when user scrolls to the section
	// useEffect(() => {
	// 	const observer = new IntersectionObserver(
	// 		(entries) => {
	// 			entries.forEach((entry) => {
	// 				if (entry.isIntersecting && !loadTransactions) {
	// 					setLoadTransactions(true);
	// 				}
	// 			});
	// 		},
	// 		{ threshold: 0.1 } // Trigger when 10% of the element is visible
	// 	);

	// 	if (transactionsSectionRef.current) {
	// 		observer.observe(transactionsSectionRef.current);
	// 	}

	// 	return () => {
	// 		if (transactionsSectionRef.current) {
	// 			observer.unobserve(transactionsSectionRef.current);
	// 		}
	// 	};
	// }, [loadTransactions]);

	//------------------------------------------------
	// Lazy load transactions - only when user scrolls to transactions section
	const companyTransactionsQueryRes = useQuery({
		queryKey: ["companyTransactions", currentToken],
		queryFn: getCompanyTransactions,
		onError: (err) => {
			toast.error("Failed to get Company Transactions.");
		},
		// enabled: loadTransactions, // Only load when explicitly requested
		staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
		cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
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
		staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
		cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
	});

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
				toast.success("Wallet funded successfully!");
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
				toast.success("Wallet funded successfully!");
				companyWalletsQueryRes.refetch(); // Refetch wallets after funding
				companyTransactionsQueryRes.refetch(); // Refetch transactions
			},
			onError: (err) => {
				toast.error("Failed to fund wallet.");
			},
		}
	);

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
		// Sort wallets to ensure USD is first
		const sortedWallets = [...companyWalletsQueryRes.data].sort((a, b) => {
			if (a.currency === "USD") return -1;
			if (b.currency === "USD") return 1;
			return 0;
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
							<span className="flex gap-2 items-center">
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
					label: { text: "Available balance", fw: "", color: "#444" },
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
							<CButton
								text={
									wallet.currency === "USD"
										? "Deposit"
										: "Fund"
								}
								btnStyle={"blue"}
								onClick={() =>
									setFundModalData({ isOpen: true, wallet })
								}
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
						),
					},
				},
			],
		]);

		if (companyTransactionsQueryRes?.data) {
			rearrangedTableData = companyTransactionsQueryRes.data.map(
				(item: any, index: any) => ({
					serial: index + 1,
					type: getCategoryTypeV2(item.category, item.type),
					name: item.merchant?.name,
					country: item.country,
					phone: item.phone_number,
					idTrx: item.id,
					amount: item.amount_xaf?.toLocaleString("en-EN") ?? 0,
					status:
						item.status == "SUCCESS" ? (
							<BadgeLabel
								className={`text-xs`}
								label={"Réussi"}
								badgeColor={"#1F66FF"}
								textColor={"#444"}
							/>
						) : item.status == "FAILED" ? (
							<BadgeLabel
								className={`text-xs`}
								label={"Echec"}
								badgeColor={"#F85D4B"}
								textColor={"#444"}
							/>
						) : item.status?.toUpperCase() == "PENDING" ? (
							<BadgeLabel
								className={`text-xs`}
								label={"En cours"}
								badgeColor={"#FFAC1C"}
								textColor={"#444"}
							/>
						) : item.status == "CANCELLED" ||
						  item.status == "CANCELED" ? (
							<BadgeLabel
								className={`text-xs`}
								label={"Suspendu"}
								badgeColor={"#444"}
								textColor={"#444"}
							/>
						) : (
							<></>
						),
					date: getFormattedDateTime(item.created_at, "en"),
					actions: (
						<>
							<div className="flex gap-5">
								<CButton
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
								/>
							</div>
						</>
					),
				})
			);
		}
	}

	return (
		<Layout title={"Wallets"}>
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
								phoneNumbers={[]} // TODO: Get phone numbers from API
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
								countryPhoneCode={
									fundModalData.wallet?.country_phone_code ||
									"+237"
								}
							/>
						)
					}
				/>

				<div
					ref={transactionsSectionRef}
					className="my-[50px] bg-white  shadow-md rounded-xl p-5"
				>
					<div className="mb-5">
						<Title title={"Last transactions"} />
					</div>

					<CustomTable
						headerData={headerUserTransactionDataV2}
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
