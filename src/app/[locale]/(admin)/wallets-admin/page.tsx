"use client";

import CustomTable from "@/components/shared/CustomTable";
import Layout from "@/components/shared/Layout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Title from "@/components/shared/Title";
import { selectCurrentToken } from "@/redux/slices/auth";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
// import { AdminService } from "@/api/services/cartevo-api/admin";
import { AdminService as AdminApi } from "@/api/services/cartevo-api/admin";
import { ADMIN_BASE_URL } from "@/api/urls";
import CButton from "@/components/shared/CButton";
import { ItemFlag } from "@/components/shared/ItemFlag";
import Modal from "@/components/shared/Modal/Modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	setFilters as setFiltersStore,
	setSaving as setSavingStore,
	setToggling as setTogglingStore,
	setWallets as setWalletsStore,
} from "@/redux/slices/adminWallets";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useQuery as useRQ } from "react-query";
import { PuffLoader } from "react-spinners";

const headerData = {
	serial: "#",
	currency: "Currency",
	country: "Country",
	company: "Company",
	balances: "Balances",
	status: "Status",
	created_at: "Created",
	action: "Action",
};

const getWallets = async ({ queryKey }: any) => {
	const [_key, token, filters] = queryKey;
	const params = new URLSearchParams();
	if (filters?.companyId) params.append("companyId", filters.companyId);
	if (filters?.currency) params.append("currency", filters.currency);
	if (filters?.countryIsoCode)
		params.append("country_iso_code", filters.countryIsoCode);
	// Client-side pagination only for this page
	const url = `${ADMIN_BASE_URL}/wallets${
		params.toString() ? `?${params.toString()}` : ""
	}`;
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.message || "Failed to get wallets");
	return data;
};

export default function WalletsAdminPage() {
	const token: any = useSelector(selectCurrentToken);
	const dispatch = useDispatch();
	const storeFilters = useSelector((s: any) => s.adminWallets.filters);
	const router = useRouter();

	// Modals state
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

	// Use store data for details to avoid refetch
	const walletItems = useSelector((s: any) => s.adminWallets.items) as any[];
	const detailsWalletData = useMemo(() => {
		if (!detailsWallet?.id) return null;
		return (
			walletItems?.find((w: any) => w.id === detailsWallet.id) ||
			detailsWallet
		);
	}, [walletItems, detailsWallet]);

	// Fetch companies for admin filter
	const companiesQuery = useRQ(["admin-companies", token], async () => {
		const res = await AdminApi.get_Companies({ token });
		const data = await res.json();
		if (!res.ok) throw new Error(data.message || "Failed to get companies");
		return data?.data || [];
	});

	const walletsQuery = useQuery({
		queryKey: ["adminWallets", token, storeFilters],
		queryFn: getWallets,
		onSuccess: (data) => {
			dispatch(setWalletsStore(data?.data || []));
		},
	});

	const tableData = (walletItems || []).map((w: any, index: number) => ({
		serial: index + 1,
		currency: w.currency,
		country: (
			<div className="flex items-center gap-2">
				<ItemFlag iso2={w.country_iso_code} size={7} />
				<span>{w.country}</span>
			</div>
		),
		company: w.company?.name ?? w.company_id,
		balances: (
			<div className="flex flex-col gap-y-1">
				<span className="truncate">Balance: {w.balance}</span>
				<span className="truncate">Payin: {w.payin_balance}</span>
				<span className="truncate">Payout: {w.payout_balance}</span>
			</div>
		),
		status: (
			<span
				className={`px-2 py-1 rounded text-xs ${
					w.is_active ?? w.active
						? "bg-green-100 text-green-700"
						: "bg-red-100 text-red-700"
				}`}
			>
				{w.is_active ?? w.active ? "ENABLED" : "DISABLED"}
			</span>
		),
		created_at: new Date(w.created_at).toLocaleString(),
		action: (
			<div className="flex gap-2">
				<CButton
					text="Details"
					btnStyle="outlineDark"
					onClick={() => setDetailsWallet(w)}
				/>
				<CButton
					text="Edit"
					btnStyle="outlineDark"
					onClick={() => {
						setEditWallet(w);
						setEditBalances({
							balance: w.balance != null ? String(w.balance) : "",
							payin_balance:
								w.payin_balance != null
									? String(w.payin_balance)
									: "",
							payout_balance:
								w.payout_balance != null
									? String(w.payout_balance)
									: "",
						});
					}}
				/>
				{w.is_active ?? w.active ? (
					<CButton
						text="Disable"
						btnStyle="red"
						onClick={() =>
							setToggleWallet({ ...w, nextActive: false })
						}
					/>
				) : (
					<CButton
						text="Enable"
						btnStyle="green"
						onClick={() =>
							setToggleWallet({ ...w, nextActive: true })
						}
					/>
				)}
			</div>
		),
	}));

	return (
		<ProtectedRoute allowedClearances={["admin"]}>
			<Layout title="Wallets (Admin)">
				<section>
					<div className="my-[50px] bg-white shadow-md rounded-xl p-5">
						<Title title={"Wallets - Administration"} />
						{/* Filters */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
							<div>
								<label className="text-sm text-gray-600">
									Currency
								</label>
								<Select
									onValueChange={(v) => {
										const nf = {
											...storeFilters,
											currency:
												v === "__all__" ? undefined : v,
										};
										dispatch(setFiltersStore(nf));
									}}
									value={storeFilters.currency || "__all__"}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="All" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">
											All
										</SelectItem>
										<SelectItem value="USD">USD</SelectItem>
										<SelectItem value="NGN">NGN</SelectItem>
										<SelectItem value="XAF">XAF</SelectItem>
										<SelectItem value="XOF">XOF</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm text-gray-600">
									Country
								</label>
								<Select
									onValueChange={(v) => {
										const nf = {
											...storeFilters,
											countryIsoCode:
												v === "__all__" ? undefined : v,
										};
										dispatch(setFiltersStore(nf));
									}}
									value={
										storeFilters.countryIsoCode || "__all__"
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="All" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">
											All
										</SelectItem>
										<SelectItem value="NG">
											Nigeria
										</SelectItem>
										<SelectItem value="CM">
											Cameroon
										</SelectItem>
										<SelectItem value="GA">
											Gabon
										</SelectItem>
										<SelectItem value="BJ">
											Benin
										</SelectItem>
										<SelectItem value="BF">
											Burkina Faso
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm text-gray-600">
									Company
								</label>
								<Select
									onValueChange={(v) => {
										const nf = {
											...storeFilters,
											companyId:
												v === "__all__" ? undefined : v,
										};
										dispatch(setFiltersStore(nf));
									}}
									value={storeFilters.companyId || "__all__"}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												companiesQuery.isLoading
													? "Loading..."
													: "All"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">
											All
										</SelectItem>
										{(companiesQuery.data || [])
											.filter(
												(c: any) =>
													c &&
													typeof c.id === "string" &&
													c.id.length > 0
											)
											.map((c: any) => (
												<SelectItem
													key={c.id}
													value={c.id}
												>
													{c.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-end gap-2">
								<CButton
									text="Reset"
									btnStyle="outlineDark"
									onClick={() => {
										dispatch(setFiltersStore({}));
									}}
								/>
							</div>
						</div>
						{walletsQuery.isLoading ? (
							<div className="w-full flex justify-center py-10">
								<PuffLoader color="#2563eb" size={48} />
							</div>
						) : (
							<CustomTable
								headerData={headerData}
								tableData={tableData}
								isLoading={false}
							/>
						)}

						{/* Pagination removed: rely on shared table internal pagination */}

						{/* Modals */}
						{detailsWallet && (
							<WalletDetailsModal
								wallet={detailsWalletData}
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
											editBalances.balance !==
												undefined &&
											editBalances.balance !== ""
										)
											payload.balance = Number(
												editBalances.balance
											);
										if (
											editBalances.payin_balance !==
												undefined &&
											editBalances.payin_balance !== ""
										)
											payload.payin_balance = Number(
												editBalances.payin_balance
											);
										if (
											editBalances.payout_balance !==
												undefined &&
											editBalances.payout_balance !== ""
										)
											payload.payout_balance = Number(
												editBalances.payout_balance
											);
										const res =
											await AdminApi.update_Wallet_Admin({
												token,
												walletId: editWallet.id,
												payload,
											});
										const data = await res.json();
										if (!res.ok)
											throw new Error(
												data.message ||
													"Failed to update wallet"
											);
										toast.success("Wallet updated");
										setEditWallet(null);
										walletsQuery.refetch();
									} catch (e: any) {
										toast.error(
											e.message || "Update failed"
										);
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
												await AdminApi.update_Wallet_Admin(
													{
														token,
														walletId:
															toggleWallet.id,
														payload: {
															is_active: true,
														},
													}
												);
											const data = await res.json();
											if (!res.ok)
												throw new Error(
													data.message ||
														"Failed to enable wallet"
												);
											toast.success("Wallet enabled");
										} else {
											const res =
												await AdminApi.disable_Wallet({
													token,
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
										toast.error(
											e.message || "Action failed"
										);
									} finally {
										setIsTogglingWallet(false);
										dispatch(setTogglingStore(false));
									}
								}}
							/>
						)}
					</div>
				</section>
			</Layout>
			{isTogglingWallet && (
				<div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center">
					<PuffLoader color="#2563eb" size={56} />
				</div>
			)}
		</ProtectedRoute>
	);
}

// Modals
// Edit phone code modal
// Disable/Enable confirmation modal
// Placed after component to keep file self-contained
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
							btnStyle="red"
							onClick={onConfirm}
						/>
					</div>
				</div>
			}
		/>
	);
}

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
