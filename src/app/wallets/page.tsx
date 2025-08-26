"use client";
import { useTitle } from "@/hooks/useTitle";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";

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
import { FaArrowsRotate } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryTypeV2 } from "@/utils/graphs";
import BadgeLabel from "@/components/shared/BadgeLabel";
import { getFormattedDateTime } from "@/utils/DateFormat";
import Modal from "@/components/shared/Modal/Modal";
import TransactionModal from "./manage/[id]/components/Tabs/Transactions/modals/TransactionModal";
import { selectCurrentToken } from "@/redux/slices/auth";

const CountryFlags: any = CFlags;

const ItemFlag = ({ iso2 }: { iso2: string }) => CountryFlags[iso2];
// const ItemFlagUS = CountryFlags["US"];

let infoData: TDataList[] = [
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
					text: "136 000",
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
							text={"Recharger"}
							btnStyle={"blue"}
							// href={`/`}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
			// {
			// 	label: { text: "", fw: "", color: "#444" },
			// 	value: {
			// 		text: (
			// 			<CButton
			// 				text={"Convertir"}
			// 				btnStyle={"outlineDark"}
			// 				// href={`/`}
			// 				icon={<FaArrowsRotate />}
			// 				width={"100%"}
			// 				height={"40px"}
			// 			/>
			// 		),
			// 	},
			// },
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
					text: "1460",
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
							text={"Recharger"}
							btnStyle={"blue"}
							// href={`/`}
							icon={<MdOutlineFileDownload size={50} />}
							width={"100%"}
							height={"40px"}
						/>
					),
				},
			},
			// {
			// 	label: { text: "", fw: "", color: "#444" },
			// 	value: {
			// 		text: (
			// 			<CButton
			// 				text={"Convertir"}
			// 				btnStyle={"outlineDark"}
			// 				// href={`/`}
			// 				icon={<FaArrowsRotate />}
			// 				width={"100%"}
			// 				height={"40px"}
			// 			/>
			// 		),
			// 	},
			// },
		],
	],
];

infoData[0][0][0].value.text = (
	<span className="flex gap-2 items-center">
		<span>XAF</span>
		<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
			<ItemFlag iso2={"CM"} />
		</span>
	</span>
);
infoData[0][0][1].value.text = (
	<span className="flex gap-2 items-center">
		<span>0</span>
		<span className="text-xs">XAF</span>
	</span>
);
infoData[0][1][0].value.text = (
	<CButton
		text={"Recharger"}
		btnStyle={"blue"}
		// href={`/`}
		icon={<MdOutlineFileDownload size={50} />}
		width={"100%"}
		height={"40px"}
	/>
);

infoData[1][0][0].value.text = (
	<span className="flex gap-2 items-center">
		<span>USD</span>
		<span className="flex items-center overflow-hidden rounded-full h-[30px] w-[30px]">
			<ItemFlag iso2={"US"} />
		</span>
	</span>
);
infoData[1][0][1].value.text = (
	<span className="flex gap-2 items-center">
		<span>0</span>
		<span className="text-xs">USD</span>
	</span>
);
infoData[1][1][0].value.text = (
	<CButton
		text={"Recharger"}
		btnStyle={"blue"}
		// href={`/`}
		icon={<MdOutlineFileDownload size={50} />}
		width={"100%"}
		height={"40px"}
	/>
);

const getCompanyWallets = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;
	let params: any = {};
	const response = await CompanyService.get_wallets({ token: token || "" });
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

export default function Home() {
	useTitle("Cartevo | wallets", true);

	const currentToken: any = useSelector(selectCurrentToken);

	const [filterContent, setFilterContent] = useState({});

	const [statsData, setStatsData] = useState<TDataList[]>();

	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useDispatch();
	const redirectRef: any = useRef();
	// dispatch(setSearchTerm(''));
	const searchTerm: string = useSelector(selectSearchTerm);

	//------------------------------------------------
	const companyTransactionsQueryRes = useQuery({
		queryKey: ["companyTransactions", currentToken],
		queryFn: getCompanyTransactions,
		onError: (err) => {
			toast.error("Failed to get Company Transactions.");
		},
		// enabled: false,
		// refetchInterval: 50000, // Fetches data every 60 seconds
	});
	// dispatch(setCurrentCustomerTransactions(oneUserTransactionsQueryRes.data));
	console.log("userQueryRes.data : ", companyTransactionsQueryRes.data);
	const companyTransactionsData = companyTransactionsQueryRes.data;

	//------------------------------------------------

	const companyWalletsQueryRes: any = useQuery({
		queryKey: ["companyWallets", currentToken],
		queryFn: getCompanyWallets,
		onError: (err) => {
			toast.error("Failed to get wallets.");
		},
		refetchInterval: 60000, // Fetches data every 30 seconds
	});

	//------------------------------------------------

	let rearrangedTableData: any[] = [];

	/** ------------------------------------------------- */
	const { shiftDown, iPressed, ePressed } = useKeyPressed();

	if (companyWalletsQueryRes?.data) {
		infoData[0][0][0].value.text = (
			<span className="flex gap-2 items-center">
				<span>{companyWalletsQueryRes?.data?.[0]?.currency || ""}</span>
				<ItemFlag
					iso2={
						companyWalletsQueryRes?.data?.[0]?.country_iso_code ||
						""
					}
				/>
			</span>
		);
		infoData[0][0][1].value.text = (
			<span className="flex gap-2 items-center">
				<span>
					{companyWalletsQueryRes?.data?.[0]?.balance?.toLocaleString(
						"en-EN"
					) || 0}
				</span>
				<span className="text-xs">
					{companyWalletsQueryRes?.data?.[0]?.currency || ""}
				</span>
			</span>
		);

		infoData[1][0][0].value.text = (
			<span className="flex gap-2 items-center">
				<span>{companyWalletsQueryRes?.data?.[1]?.currency || ""}</span>
				<ItemFlag
					iso2={
						companyWalletsQueryRes?.data?.[1]?.country_iso_code ||
						""
					}
				/>
			</span>
		);
		infoData[1][0][1].value.text = (
			<span className="flex gap-2 items-center">
				<span>
					{companyWalletsQueryRes?.data?.[1]?.balance?.toLocaleString(
						"en-EN"
					) || 0}
				</span>
				<span className="text-xs">
					{companyWalletsQueryRes?.data?.[1]?.currency || ""}
				</span>
			</span>
		);

		rearrangedTableData = companyTransactionsQueryRes?.data?.map(
			(item: any, index: any) => {
				const rearrangedItem = {
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
									// href={`?transaction${index + 1}=true`}
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
											// customer={customerDetails?.customer}
											item={item}
										/>
									}
								/>
							</div>
						</>
					),
				};
				item = rearrangedItem;
				return item;
			}
		);
	}

	return (
		<Layout title={"Wallets"}>
			<section className="mt-2">
				{companyWalletsQueryRes?.status === "loading" ? (
					<div className="flex justify-center w-full py-10">
						<div className={"loadingSpinner"}></div>
					</div>
				) : (
					<WalletCardGrid walletData={infoData} />
				)}

				<div className="my-[50px] bg-white  shadow-md rounded-xl p-5">
					<div className="mb-5">
						<Title title={"Last transactions"} />
					</div>
					<CustomTable
						headerData={headerUserTransactionDataV2}
						tableData={rearrangedTableData}
						// isLoading={
						// 	oneUserTransactionsQueryRes?.status == "loading"
						// }
						// threeButtons
						filter
						filterType={"transaction"}
						filterContent={filterContent}
						setFilterContent={setFilterContent}
						// generateExcel={() => mutationExcel.mutate()}
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
