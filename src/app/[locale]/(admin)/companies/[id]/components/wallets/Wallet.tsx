"use client";

import { AdminService } from "@/api/services/cartevo-api/admin";
import CButton from "@/components/shared/CButton";
import CustomTable from "@/components/shared/CustomTable copy";
import { ItemFlag } from "@/components/shared/ItemFlag";
import Modal from "@/components/shared/Modal/Modal";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { PuffLoader } from "react-spinners";
import {
	setFilters as setFiltersStore,
	setSaving as setSavingStore,
	setToggling as setTogglingStore,
	setWallets as setWalletsStore,
} from "@/redux/slices/adminWallets";

const getWalletsByCompany = async ({
	companyId,
	token,
}: {
	companyId: string;
	token: string;
}) => {
	const response = await AdminService.getWalletsByCompany({
		token,
		companyId,
	});

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch wallets");
	}

	return responseJson;
};

const WalletComponent = () => {
	const currentToken: any = useSelector(selectCurrentToken);
	const selectedCompany = useSelector(
		(state: RootState) => state.selectedCompany.company
	);

	const [editWallet, setEditWallet] = useState<any | null>(null);
	const [editBalances, setEditBalances] = useState<{
		balance?: string;
		payin_balance?: string;
		payout_balance?: string;
	}>({});
	const [toggleWallet, setToggleWallet] = useState<any | null>(null);
	const [detailsWallet, setDetailsWallet] = useState<any | null>(null);
	const [isSavingBalances, setIsSavingBalances] = useState<boolean>(false);
	const [isTogglingWallet, setIsTogglingWallet] = useState<boolean>(false);
	const [filterContent, setFilterContent] = useState();
	const dispatch = useDispatch();

	const walletsQuery = useQuery({
		queryKey: ["wallets", selectedCompany.id, currentToken],
		queryFn: () =>
			getWalletsByCompany({
				companyId: selectedCompany.id,
				token: currentToken,
			}),

		onError: (err: any) => {
			toast.error("Failed to get wallets");
		},
	});

	const walletsHeaderData = {
		serial: "#",
		country: "Country",
		currency: "Currency",
		balance: "Balance",
		payin_balance: "Payin Balance",
		payout_balance: "Payout Balance",
		is_active: "Active",
		created_at: "Created At",
		actions: "Actions",
	};

	const rawWallets = Array.isArray(walletsQuery.data?.wallets)
		? walletsQuery.data?.wallets
		: [];

	const walletsTableData = rawWallets.map((wallet: any, index: number) => ({
		serial: index + 1,
		country: wallet.country ?? "-",
		currency: wallet.currency ?? "-",
		balance: wallet.balance ?? "0",
		payin_balance: wallet.payin_balance ?? "0",
		payout_balance: wallet.payout_balance ?? "0",
		is_active: (
			<span
				className={
					wallet.is_active
						? "px-2 py-1 rounded-full text-green-700 bg-green-100"
						: "px-2 py-1 rounded-full text-red-700 bg-red-100"
				}
			>
				{wallet.is_active ? "Active" : "Inactive"}
			</span>
		),
		created_at: wallet.created_at
			? new Date(wallet.created_at).toLocaleDateString()
			: "-",

		actions: (
			<div className="flex gap-2">
				{/* <CButton
					text="Details"
					btnStyle="outlineDark"
					onClick={() => setDetailsWallet(wallet)}
				/> */}
				<CButton
					text="Edit Wallet"
					btnStyle="outlineDark"
					onClick={() => {
						setEditWallet(wallet);
						setEditBalances({
							balance:
								wallet.balance != null
									? String(wallet.balance)
									: "",
							payin_balance:
								wallet.payin_balance != null
									? String(wallet.payin_balance)
									: "",
							payout_balance:
								wallet.payout_balance != null
									? String(wallet.payout_balance)
									: "",
						});
					}}
				/>
				{wallet.is_active ? (
					<CButton
						text="Disable"
						btnStyle="blue"
						onClick={() =>
							setToggleWallet({ ...wallet, nextActive: false })
						}
					/>
				) : (
					<CButton
						text="Enable"
						btnStyle="green"
						onClick={() =>
							setToggleWallet({ ...wallet, nextActive: true })
						}
					/>
				)}
			</div>
		),
	}));

	return (
		<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
			<Title title={"Wallets List"} />

			<CustomTable
				headerData={walletsHeaderData}
				tableData={walletsTableData}
				isLoading={walletsQuery.isLoading || walletsQuery.isFetching}
			/>

			{/* Modals */}
			{detailsWallet && (
				<WalletDetailsModal
					wallet={detailsWallet}
					onClose={() => setDetailsWallet(null)}
				/>
			)}

			{editWallet && (
				<EditWalletBalancesModal
					wallet={editWallet}
					balances={editBalances}
					setBalances={setEditBalances}
					isSaving={isSavingBalances}
					onClose={() => setEditWallet(null)}
					onSave={async () => {
						try {
							setIsSavingBalances(true);
							dispatch(setSavingStore(true));
							const payload: any = {};
							if (
								editBalances.balance !== undefined &&
								editBalances.balance !== ""
							)
								payload.balance = Number(editBalances.balance);
							if (
								editBalances.payin_balance !== undefined &&
								editBalances.payin_balance !== ""
							)
								payload.payin_balance = Number(
									editBalances.payin_balance
								);
							if (
								editBalances.payout_balance !== undefined &&
								editBalances.payout_balance !== ""
							)
								payload.payout_balance = Number(
									editBalances.payout_balance
								);
							const res = await AdminService.update_Wallet_Admin({
								token: currentToken,
								walletId: editWallet.id,
								payload,
							});
							const data = await res.json();
							if (!res.ok)
								throw new Error(
									data.message || "Failed to update wallet"
								);
							toast.success("Wallet updated");
							setEditWallet(null);
							walletsQuery.refetch();
						} catch (e: any) {
							toast.error(e.message || "Update failed");
						} finally {
							setIsSavingBalances(false);
							dispatch(setSavingStore(false));
						}
					}}
				/>
			)}

			{toggleWallet && (
				<ToggleWalletModal
					wallet={toggleWallet}
					onClose={() => setToggleWallet(null)}
					onConfirm={async () => {
						try {
							setIsTogglingWallet(true);
							dispatch(setTogglingStore(true));
							if (toggleWallet.nextActive) {
								const res =
									await AdminService.update_Wallet_Admin({
										token: currentToken,
										walletId: toggleWallet.id,
										payload: {
											is_active: true,
										},
									});
								const data = await res.json();
								if (!res.ok)
									throw new Error(
										data.message ||
											"Failed to enable wallet"
									);
								toast.success("Wallet enabled");
							} else {
								const res = await AdminService.disable_Wallet({
									token: currentToken,
									walletId: toggleWallet.id,
								});
								const data = await res.json();
								if (!res.ok)
									throw new Error(
										data.message ||
											"Failed to disable wallet"
									);
								toast.success("Wallet disabled");
							}
							setToggleWallet(null);
							await walletsQuery.refetch();
						} catch (e: any) {
							toast.error(e.message || "Action failed");
						} finally {
							setIsTogglingWallet(false);
							dispatch(setTogglingStore(false));
						}
					}}
				/>
			)}

			{isTogglingWallet && (
				<div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
					<PuffLoader color="#2563eb" size={56} />
				</div>
			)}
		</div>
	);
};

export default WalletComponent;

function WalletDetailsModal({
	wallet,
	isLoading,
	onClose,
}: {
	wallet: any;
	isLoading?: boolean;
	onClose: () => void;
}) {
	return (
		<Modal
			name="walletDetails"
			isOpen={!!wallet}
			setIsOpen={() => onClose()}
			modalContent={
				<div className="bg-white rounded-lg shadow-lg p-6 w-[520px]">
					<h3 className="text-lg font-semibold mb-4">
						Wallet details
					</h3>
					{isLoading ? (
						<div className="py-6 flex justify-center">
							<PuffLoader color="#2563eb" size={40} />
						</div>
					) : (
						<div className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-gray-600">ID</span>
								<span>{wallet?.id}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Company</span>
								<span>
									{wallet?.company?.name ??
										wallet?.company_id}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Currency</span>
								<span>{wallet?.currency}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Country</span>
								<span className="flex items-center gap-2">
									<ItemFlag
										iso2={wallet?.country_iso_code}
										size={5}
									/>
									<span>{wallet?.country}</span>
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">
									Phone code
								</span>
								<span>{wallet?.country_phone_code ?? "-"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Active</span>
								<span>{wallet?.is_active ? "Yes" : "No"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Balance</span>
								<span>{wallet?.balance}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">
									Payin balance
								</span>
								<span>{wallet?.payin_balance}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">
									Payout balance
								</span>
								<span>{wallet?.payout_balance}</span>
							</div>
							{wallet?.payInAmount != null && (
								<div className="flex justify-between">
									<span className="text-gray-600">
										Pay-in total
									</span>
									<span>{wallet?.payInAmount}</span>
								</div>
							)}
							{wallet?.payOutAmount != null && (
								<div className="flex justify-between">
									<span className="text-gray-600">
										Pay-out total
									</span>
									<span>{wallet?.payOutAmount}</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="text-gray-600">Created</span>
								<span>
									{wallet?.created_at
										? new Date(
												wallet.created_at
										  ).toLocaleString()
										: "-"}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Updated</span>
								<span>
									{wallet?.updated_at
										? new Date(
												wallet.updated_at
										  ).toLocaleString()
										: "-"}
								</span>
							</div>
						</div>
					)}
					<div className="flex justify-end gap-2 mt-5">
						<CButton
							text="Close"
							btnStyle="outlineDark"
							onClick={onClose}
						/>
					</div>
				</div>
			}
		/>
	);
}

function EditWalletBalancesModal({
	wallet,
	balances,
	setBalances,
	isSaving,
	onClose,
	onSave,
}: {
	wallet: any;
	balances: {
		balance?: string;
		payin_balance?: string;
		payout_balance?: string;
	};
	setBalances: (v: {
		balance?: string;
		payin_balance?: string;
		payout_balance?: string;
	}) => void;
	isSaving?: boolean;
	onClose: () => void;
	onSave: () => void;
}) {
	return (
		<Modal
			name="editWalletBalances"
			isOpen={!!wallet}
			setIsOpen={() => onClose()}
			modalContent={
				<div className="relative bg-white rounded-lg shadow-lg p-6 w-[420px]">
					<h3 className="text-lg font-semibold mb-4">
						Edit balances
					</h3>
					<div className="mb-3">
						<label className="block text-sm text-gray-600 mb-1">
							Main balance
						</label>
						<input
							className="w-full border rounded px-3 py-2"
							placeholder="e.g. 1000"
							type="number"
							value={balances.balance ?? ""}
							onChange={(e) =>
								setBalances({
									...balances,
									balance: e.target.value,
								})
							}
						/>
					</div>
					<div className="mb-3">
						<label className="block text-sm text-gray-600 mb-1">
							Payin balance
						</label>
						<input
							className="w-full border rounded px-3 py-2"
							placeholder="e.g. 500"
							type="number"
							value={balances.payin_balance ?? ""}
							onChange={(e) =>
								setBalances({
									...balances,
									payin_balance: e.target.value,
								})
							}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm text-gray-600 mb-1">
							Payout balance
						</label>
						<input
							className="w-full border rounded px-3 py-2"
							placeholder="e.g. 300"
							type="number"
							value={balances.payout_balance ?? ""}
							onChange={(e) =>
								setBalances({
									...balances,
									payout_balance: e.target.value,
								})
							}
						/>
					</div>
					<div className="flex justify-end gap-2">
						<CButton
							text="Cancel"
							btnStyle="outlineDark"
							onClick={onClose}
						/>
						<CButton text="Save" btnStyle="blue" onClick={onSave} />
					</div>
					{/** Overlay loader during save */}
					{isSaving && (
						<div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
							<PuffLoader color="#2563eb" size={42} />
						</div>
					)}
				</div>
			}
		/>
	);
}

function ToggleWalletModal({
	wallet,
	onClose,
	onConfirm,
}: {
	wallet: any;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const title = wallet?.nextActive ? "Enable wallet" : "Disable wallet";
	const desc = wallet?.nextActive
		? "This will set the wallet to active."
		: "This will disable the wallet.";
	return (
		<Modal
			name="toggleWallet"
			isOpen={!!wallet}
			setIsOpen={() => onClose()}
			modalContent={
				<div className="bg-white rounded-lg shadow-lg p-6 w-[420px]">
					<h3 className="text-lg font-semibold mb-2">{title}</h3>
					<p className="text-sm text-gray-600 mb-4">{desc}</p>
					<div className="flex justify-end gap-2">
						<CButton
							text="Cancel"
							btnStyle="outlineDark"
							onClick={onClose}
						/>
						<CButton
							text="Confirm"
							btnStyle="blue"
							onClick={onConfirm}
						/>
					</div>
				</div>
			}
		/>
	);
}
