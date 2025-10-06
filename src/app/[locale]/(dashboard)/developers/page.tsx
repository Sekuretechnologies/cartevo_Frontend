"use client";
import { useTitle } from "@/hooks/useTitle";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";

import CButton from "@/components/shared/CButton";
import Checkbox from "@/components/shared/Checkbox";
import Layout from "@/components/shared/Layout";
import Modal from "@/components/shared/Modal/Modal";

import { DevelopersService } from "@/api/services/cartevo-api/developers";
import { useTranslation } from "@/hooks/useTranslation";
import { selectCurrentToken } from "@/redux/slices/auth";
import { DeveloperSettings } from "@/types/settings";
import { HiClipboardCopy, HiPencil, HiRefresh } from "react-icons/hi";
import { useSelector } from "react-redux";

const getDeveloperSettings = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;

	console.log("get Developer Settings accessToken :: ", token);

	const response = await DevelopersService.get_developer_settings({ token });
	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to get developer settings"
		);
	}
	console.log("responseJson.data : ", responseJson.data);

	return responseJson.data;
};

const handleUpdateWebhook = async (queryData: any) => {
	const { token, data } = queryData;
	// console.log("handleTransaction : ", {currentUserId, customerId, label, body});
	// return {currentUserId, customerId, label, body}
	const response = await DevelopersService.update_webhook({
		token,
		data,
	});
	if (!response.ok) {
		const responseJson = await response.json();
		throw new Error(responseJson.message || "Failed to update settings");
	}
	const responseJson = await response.json();
	return responseJson;
};

export default function Developers() {
	const { t } = useTranslation();
	const developerTrans = t.developer;
	const statusTrans = t.status;
	useTitle("Cartevo | Developers", true);
	const currentToken: any = useSelector(selectCurrentToken);
	const queryClient = useQueryClient();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const developerSettingsQueryRes = useQuery({
		queryKey: ["developerSettings", currentToken],
		queryFn: getDeveloperSettings,
		onError: (err) => {
			toast.error("Failed to get developer settings.");
		},
		refetchInterval: 60000, // Fetches data every 60 seconds
	});

	const regenerateCredentialsMutation = useMutation(
		() => DevelopersService.regenerate_credentials({ token: currentToken }),
		{
			onSuccess: async (response) => {
				const responseJson = await response.json();
				if (!response.ok) {
					throw new Error(
						responseJson.message ||
							"Failed to regenerate credentials"
					);
				}
				toast.success("Credentials regenerated successfully!");
				queryClient.invalidateQueries(["developerSettings"]);
			},
			onError: (error: any) => {
				toast.error(
					error.message || "Failed to regenerate credentials"
				);
			},
		}
	);

	const copyToClipboard = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`${label} copied to clipboard!`);
		} catch (err) {
			toast.error(`Failed to copy ${label}`);
		}
	};

	const developerSettings: DeveloperSettings =
		developerSettingsQueryRes.data || {};

	return (
		<Layout title={"Developers"}>
			<section className="mt-2">
				<div className="mb-[50px] bg-white shadow-md rounded-xl p-5">
					<div className="mb-6">
						<h2 className="text-xl font-semibold text-gray-800">
							{developerTrans.title}
						</h2>
						<p className="text-gray-600 text-sm mt-1">
							{developerTrans.description}
						</p>
					</div>

					{developerSettingsQueryRes.isLoading ? (
						<div className="flex justify-center items-center py-20">
							<div className={"loadingSpinner"}></div>
							{/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div> */}
						</div>
					) : (
						<div className="space-y-6">
							{/* Webhook URL Section */}
							<div className="border border-gray-200 rounded-lg p-4">
								<div className="flex justify-between items-start mb-3">
									<div>
										<h3 className="text-lg font-medium text-gray-800">
											Webhook URL
										</h3>
										<p className="text-gray-600 text-sm">
											{developerTrans.realTimeNotif}
										</p>
									</div>
									<CButton
										text={developerTrans.edit}
										btnStyle="outlineDark"
										icon={<HiPencil />}
										onClick={() => setIsEditModalOpen(true)}
									/>
								</div>
								<div className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
									<code className="text-sm text-gray-700 flex-1 mr-3">
										{developerSettings.webhook_url ||
											"Not configured"}
									</code>
									<CButton
										text="Copy"
										btnStyle="lightBlue"
										icon={<HiClipboardCopy />}
										onClick={() =>
											copyToClipboard(
												developerSettings.webhook_url ||
													"",
												"Webhook URL"
											)
										}
										disabled={
											!developerSettings.webhook_url
										}
									/>
								</div>
								<div className="mt-2 flex items-center">
									<div
										className={`w-2 h-2 rounded-full mr-2 ${
											developerSettings.webhook_is_active
												? "bg-green-500"
												: "bg-red-500"
										}`}
									></div>
									<span className="text-sm text-gray-600">
										Status:{" "}
										{developerSettings.webhook_is_active
											? statusTrans.active
											: statusTrans.inactive}
									</span>
								</div>
							</div>

							{/* API Credentials Section */}
							<div className="border border-gray-200 rounded-lg p-4">
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-lg font-medium text-gray-800">
											{developerTrans.apiCredential}
										</h3>
										<p className="text-gray-600 text-sm">
											{developerTrans.apiDescription}
										</p>
									</div>
									<CButton
										text={developerTrans.regenerate}
										btnStyle="outlineDark"
										icon={<HiRefresh />}
										onClick={() =>
											regenerateCredentialsMutation.mutate()
										}
										disabled={
											regenerateCredentialsMutation.isLoading
										}
									/>
								</div>

								{/* Client ID */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Client ID
									</label>
									<div className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
										<code className="text-sm text-gray-700 flex-1 mr-3">
											{developerSettings.client_id ||
												"Not generated"}
										</code>
										<CButton
											text="Copy"
											btnStyle="lightBlue"
											icon={<HiClipboardCopy />}
											onClick={() =>
												copyToClipboard(
													developerSettings.client_id ||
														"",
													"Client ID"
												)
											}
											disabled={
												!developerSettings.client_id
											}
										/>
									</div>
								</div>

								{/* Client Key */}
								<div className="mb-4">
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Client Key
									</label>
									<div className="bg-gray-50 rounded-md p-3 flex justify-between items-center">
										<code className="text-sm text-gray-700 flex-1 mr-3">
											{developerSettings.client_key
												? "••••••••••••••••••••••••••••••••"
												: "Not generated"}
										</code>
										<CButton
											text="Copy"
											btnStyle="lightBlue"
											icon={<HiClipboardCopy />}
											onClick={() =>
												copyToClipboard(
													developerSettings.client_key ||
														"",
													"Client Key"
												)
											}
											disabled={
												!developerSettings.client_key
											}
										/>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										{developerTrans.secure}
									</p>
								</div>
							</div>

							{/* Documentation Section */}
							<div className="border border-blue-100 rounded-lg p-4 bg-blue-50">
								<h3 className="text-lg font-medium text-blue-800 mb-2">
									{developerTrans.apiDoc}
								</h3>
								<p className="text-blue-700 text-sm mb-3">
									{developerTrans.apiDescription}
								</p>
								<CButton
									text={developerTrans.viewDoc}
									btnStyle="blue"
									href="https://developer.cartevo.co"
									openInNewTab={true}
								/>
							</div>
						</div>
					)}
				</div>

				{/* Edit Modal */}
				<Modal
					name="editWebhook"
					isOpen={isEditModalOpen}
					setIsOpen={setIsEditModalOpen}
					modalContent={
						<EditWebhookModal
							currentSettings={developerSettings}
							onClose={() => setIsEditModalOpen(false)}
							onSuccess={() => {
								setIsEditModalOpen(false);
								queryClient.invalidateQueries([
									"developerSettings",
								]);
							}}
						/>
					}
				/>
			</section>
		</Layout>
	);
}

// Edit Webhook Modal Component
function EditWebhookModal({
	currentSettings,
	onClose,
	onSuccess,
}: {
	currentSettings: DeveloperSettings;
	onClose: () => void;
	onSuccess: () => void;
}) {
	const { t } = useTranslation();
	const developerTrans = t.developer;
	const btn = t.btn;
	const currentToken = useSelector(selectCurrentToken);
	const [webhook_url, setWebhookUrl] = useState(
		currentSettings.webhook_url || ""
	);
	const [isActive, setIsActive] = useState(
		currentSettings.webhook_is_active || false
	);

	const updateSettingsMutation = useMutation(
		(data: any) =>
			handleUpdateWebhook({
				token: currentToken,
				data,
			}),
		{
			onSuccess: (data) => {
				console.log("onSuccess : ", data);
				toast.success("Settings updated successfully!");
				onSuccess();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to update settings");
			},
		}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		console.log("handleSubmit :", {
			webhook_url,
			webhook_is_active: isActive,
		});

		updateSettingsMutation.mutate({
			webhook_url,
			webhook_is_active: isActive,
		});
	};

	return (
		<div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 md:w-[655px]">
			<h3 className="text-lg font-semibold text-gray-800 mb-4">
				{developerTrans.editModal}
			</h3>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-2">
						Webhook URL
					</label>
					<input
						type="url"
						value={webhook_url}
						onChange={(e) => setWebhookUrl(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder="https://your-domain.com/webhook"
					/>
				</div>
				<div className="mb-6">
					<Checkbox
						id="webhook-active"
						checked={isActive}
						onChange={setIsActive}
						label={developerTrans.enable}
					/>
				</div>
				<div className="flex gap-3 justify-end">
					<CButton
						text={btn.cancel}
						btnStyle="outlineDark"
						onClick={onClose}
						type="button"
					/>
					<CButton
						text={
							updateSettingsMutation.isLoading
								? developerTrans.saving
								: developerTrans.save
						}
						btnStyle="blue"
						type="submit"
						disabled={updateSettingsMutation.isLoading}
					/>
				</div>
			</form>
		</div>
	);
}
