"use client";

import { SettingsService } from "@/api/services/cartevo-api/settings";
import { selectCurrentToken } from "@/redux/slices/auth";
import { EditRoleSchema } from "@/validation/FormValidation";
import { useTranslation } from "@/hooks/useTranslation";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Select, SelectItem } from "@nextui-org/select";
import CButton from "@/components/shared/CButton";
import { PuffLoader } from "react-spinners";
import classNames from "classnames";

const handleEditRole = async (
	token: string,
	data: z.infer<typeof EditRoleSchema>,
	userId: string
) => {
	const response = await SettingsService.EditUser({ userId, token, data });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to update role");
	}

	return responseJson;
};

const getUserRoles = (t: any) => [
	{
		key: "member",
		label: t.settings.teamMembers.modals.userRoles.member,
	},
	{
		key: "admin",
		label: t.settings.teamMembers.modals.userRoles.admin,
	},
];

type ModalProps = {
	onClose: () => void;
	userId: string;
	currentRole: "admin" | "member";
};

const EditRoleModal = ({ onClose, userId, currentRole }: ModalProps) => {
	const { t }: { t: any } = useTranslation();
	const currentToken: any = useSelector(selectCurrentToken);

	const [selectedRole, setSelectedRole] = useState<string>(currentRole);

	const rolePermissions: Record<
		string,
		{ action: string; allowed: boolean }[]
	> = {
		admin: [
			{
				action: t.settings.teamMembers.modals.permissionRole
					.accessSystem,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.modifyWebhook,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.reloadWalletOrCard,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.withdrawWalletOrCard,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.viewBalances,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.freezeOrUnfreezeCard,
				allowed: true,
			},
		],
		member: [
			{
				action: t.settings.teamMembers.modals.permissionRole
					.accessSystem,
				allowed: false,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.modifyWebhook,
				allowed: false,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.reloadWalletOrCard,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.withdrawWalletOrCard,
				allowed: false,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.viewBalances,
				allowed: true,
			},
			{
				action: t.settings.teamMembers.modals.permissionRole
					.freezeOrUnfreezeCard,
				allowed: false,
			},
		],
	};

	const form = useForm<z.infer<typeof EditRoleSchema>>({
		resolver: zodResolver(EditRoleSchema),
		defaultValues: {
			role: currentRole,
		},
	});

	const mutation = useMutation({
		mutationFn: (data: z.infer<typeof EditRoleSchema>) =>
			handleEditRole(currentToken, data, userId),
		onError: (err: any) => {
			toast.error(
				t.settings.teamMembers.modals.editRole.failedToUpdateUserRole,
				err.message
			);
		},
		onSuccess: () => {
			toast.success(
				t.settings.teamMembers.modals.editRole.userRoleUpdatedSuccess
			);
		},
	});

	const onSubmit = (data: any) => {
		mutation.mutate(data);
	};

	return (
		<div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-[1000]">
			<div className="relative flex flex-col px-8 py-8 bg-white rounded-lg w-[600px]">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-xl font-semibold">
						{t.settings.teamMembers.modals.editRole.title}
					</h1>

					<button
						className="text-gray-500 hover:text-black duration-300"
						onClick={() => onClose()}
					>
						<X size={24} />
					</button>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-md tracking-tight">
										{
											t.settings.teamMembers.modals
												.editRole.selectRole
										}
										<span className="text-red-500">*</span>
									</FormLabel>

									<FormControl>
										<Select
											{...field}
											placeholder={
												t.settings.teamMembers.modals
													.editRole.selectRole
											}
											style={{ width: "100%" }}
											className="bg-app-lightgray text-gray-900 font-normal"
											defaultSelectedKeys={[currentRole]} // rôle actuel
											selectedKeys={
												selectedRole
													? [selectedRole]
													: []
											}
											onSelectionChange={(keys) =>
												setSelectedRole(
													String(Array.from(keys)[0])
												)
											}
										>
											{getUserRoles(t).map((item) => (
												<SelectItem
													key={item.key}
													value={item.key}
												>
													{item.label}
												</SelectItem>
											))}
										</Select>
									</FormControl>
									<FormMessage className="text-red-400 " />
								</FormItem>
							)}
						/>

						{/* Permissions list */}
						{selectedRole && (
							<ul className="mt-4 ml-4 list-none flex flex-col gap-1">
								{rolePermissions[selectedRole].map(
									(perm, idx) => (
										<li
											key={idx}
											className="flex items-center gap-2"
										>
											<span
												className={`font-bold ${
													perm.allowed
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{perm.allowed ? "✅" : "❌"}
											</span>
											<span
												className={
													perm.allowed
														? ""
														: "line-through"
												}
											>
												{perm.action}
											</span>
										</li>
									)
								)}
							</ul>
						)}

						<div className="mt-8">
							<CButton
								text={
									t.settings.teamMembers.modals.editRole
										.editRole
								}
								btnStyle="blue"
								width="175px"
								height="49px"
								type="submit"
							/>
						</div>

						<div
							className={classNames(
								"transition-all invisible z-[1000] bg-blue-900/30 opacity-0 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 h-screen w-screen flex items-center justify-center",
								{
									"!opacity-100 !visible z-[1000]":
										mutation.isLoading,
								}
							)}
						>
							<PuffLoader
								className="shrink-0"
								size={50}
								color="#1F66FF"
							/>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default EditRoleModal;
